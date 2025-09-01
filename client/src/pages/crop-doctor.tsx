import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Zap, CheckCircle, AlertTriangle, Leaf } from "lucide-react";
import { uploadPestImage, getUserPestDetections } from "@/lib/api";
import { useCamera } from "@/hooks/use-camera";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/language-provider";
import { queryClient } from "@/lib/queryClient";

// Mock user ID for demo
const DEMO_USER_ID = "demo-user-123";

export default function CropDoctor() {
  const [description, setDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
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

  const { data: pastDetections, isLoading: loadingDetections } = useQuery({
    queryKey: ["/api/pest-detections", DEMO_USER_ID],
    queryFn: () => getUserPestDetections(DEMO_USER_ID),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) =>
      uploadPestImage(DEMO_USER_ID, file, description),
    onSuccess: (data) => {
      setAnalysisResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/pest-detections", DEMO_USER_ID] });
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
      closeCamera();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      case "low":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Crop Doctor</h1>
          <p className="text-xl text-muted-foreground">
            AI-powered pest and disease detection with organic solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera/Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Capture or Upload Plant Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                          data-testid="button-open-camera"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          data-testid="button-upload-photo"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional Description (Optional)
                      </label>
                      <Textarea
                        placeholder="Describe any symptoms you've noticed..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        data-testid="textarea-description"
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
                        data-testid="camera-video"
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
                          data-testid="button-toggle-flash"
                        >
                          <Zap className="w-4 h-4" />
                        </Button>
                      )}
                      <Button onClick={handleCameraCapture} data-testid="button-capture-photo">
                        <Camera className="w-4 h-4 mr-2" />
                        Capture
                      </Button>
                      <Button variant="outline" onClick={closeCamera} data-testid="button-close-camera">
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
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>AI Analysis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Detected Issue</h4>
                      <p className="text-lg font-semibold text-destructive" data-testid="detected-pest">
                        {analysisResult.detectedPest}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Severity Level</h4>
                      <Badge className={getSeverityColor(analysisResult.severity)} data-testid="severity-level">
                        {analysisResult.severity}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-primary" />
                        <span>Organic Solution</span>
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid="organic-solution">
                        {analysisResult.organicSolution}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <span className="text-secondary">🌿</span>
                        <span>Ayurvedic Remedy</span>
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid="ayurvedic-remedy">
                        {analysisResult.ayurvedicRemedy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-medium text-foreground mb-2">Confidence Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(analysisResult.confidence || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium" data-testid="confidence-score">
                        {Math.round((analysisResult.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Past Detections */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Detections</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingDetections ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : pastDetections && pastDetections.length > 0 ? (
                  <div className="space-y-4">
                    {pastDetections.slice(0, 5).map((detection: any, index: number) => (
                      <div key={detection.id} className="p-3 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm" data-testid={`past-detection-${index}`}>
                            {detection.detectedPest}
                          </span>
                          <Badge 
                            className={getSeverityColor(detection.severity)}
                            data-testid={`past-severity-${index}`}
                          >
                            {detection.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(detection.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No detections yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start by taking a photo of your crops
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Photography Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Take clear, well-lit photos of affected plant parts
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Include both healthy and affected areas for comparison
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Use flash or good lighting for better detection accuracy
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Focus on leaves, stems, or fruits showing symptoms
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
