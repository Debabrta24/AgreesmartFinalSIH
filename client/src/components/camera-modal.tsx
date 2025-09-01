import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Zap, X, AlertTriangle } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useMutation } from "@tanstack/react-query";
import { uploadPestImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CameraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onAnalysisComplete?: (result: any) => void;
}

export function CameraModal({ open, onOpenChange, userId, onAnalysisComplete }: CameraModalProps) {
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const {
    isOpen: cameraOpen,
    hasFlash,
    flashEnabled,
    error: cameraError,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    toggleFlash,
    capturePhoto
  } = useCamera();

  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) =>
      uploadPestImage(userId, file, description),
    onSuccess: (data) => {
      onAnalysisComplete?.(data);
      handleClose();
      toast({
        title: "Analysis Complete",
        description: "Your crop image has been analyzed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed", 
        description: error.message || "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    closeCamera();
    setDescription("");
    onOpenChange(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate({ file, description });
    }
  };

  const handleCameraCapture = async () => {
    const blob = await capturePhoto();
    if (blob) {
      const file = new File([blob], "crop-photo.jpg", { type: "image/jpeg" });
      uploadMutation.mutate({ file, description });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Crop Doctor - Pest Detection</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} data-testid="button-close-camera-modal">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {!cameraOpen ? (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-8 text-center border-2 border-dashed border-border">
                <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Point camera at affected plant parts for accurate diagnosis
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => openCamera({ facingMode: "environment" })}
                    data-testid="button-take-photo"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById("modal-file-upload")?.click()}
                    data-testid="button-upload-image"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                <input
                  id="modal-file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-modal-file-upload"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Additional Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe any symptoms you've noticed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="textarea-pest-description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                  data-testid="camera-preview"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-center space-x-4">
                {hasFlash && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFlash}
                    className={flashEnabled ? "bg-secondary text-secondary-foreground" : ""}
                    data-testid="button-flash-toggle"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={handleCameraCapture} data-testid="button-capture-image">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
                <Button variant="outline" onClick={closeCamera} data-testid="button-cancel-camera">
                  Cancel
                </Button>
              </div>
              
              {cameraError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {uploadMutation.isPending && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Analyzing image with AI...</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
