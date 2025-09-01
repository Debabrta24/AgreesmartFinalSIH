import { useState, useRef, useCallback } from "react";

interface CameraOptions {
  facingMode?: "user" | "environment";
  width?: number;
  height?: number;
}

export function useCamera() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = useCallback(async (options: CameraOptions = {}) => {
    try {
      setError(null);
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: options.facingMode || "environment",
          width: { ideal: options.width || 1920 },
          height: { ideal: options.height || 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check if device has flash/torch capability
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      
      if (capabilities && (capabilities as any).torch) {
        setHasFlash(true);
      }

      setIsOpen(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please check permissions.");
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsOpen(false);
    setFlashEnabled(false);
    setError(null);
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current || !hasFlash) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const newFlashState = !flashEnabled;
      
      await track.applyConstraints({
        advanced: [{ torch: newFlashState } as any]
      });
      
      setFlashEnabled(newFlashState);
    } catch (err) {
      console.error("Flash toggle error:", err);
      setError("Failed to toggle flash");
    }
  }, [flashEnabled, hasFlash]);

  const capturePhoto = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current) {
        resolve(null);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        resolve(null);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }, []);

  return {
    isOpen,
    hasFlash,
    flashEnabled,
    error,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    toggleFlash,
    capturePhoto
  };
}
