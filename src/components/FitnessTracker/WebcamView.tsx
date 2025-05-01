
import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type WebcamViewProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  onFrame?: (imageData: ImageData) => void;
  width?: number;
  height?: number;
  drawCanvas?: boolean;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  showControls?: boolean;
}

const WebcamView = ({
  className,
  onFrame,
  width = 640,
  height = 480,
  drawCanvas = true,
  canvasRef: externalCanvasRef,
  showControls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Effect for handling camera setup and teardown based on isCameraActive
  useEffect(() => {
    let stream = null;

    async function setupCamera() {
      if (!isCameraActive) return;

      try {
        setIsLoading(true);
        setHasPermission(null); // Reset permission status on attempt
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width,
            height,
            facingMode: "user",
            frameRate: { ideal: 30 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsLoading(false);
            setHasPermission(true);
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasPermission(false);
        setIsLoading(false);
      }
    }

    setupCamera();

    // Cleanup function: stops tracks when isCameraActive becomes false or component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the srcObject
      }
      setIsLoading(false); // Ensure loading is reset
      // Keep hasPermission state as is, it reflects the last attempt
    };
  }, [isCameraActive, width, height]); // Re-run if active state or dimensions change

  // Effect for handling frame capture and drawing
  useEffect(() => {
    // Only run if camera is active, permission granted, and onFrame is provided
    if (!isCameraActive || !hasPermission || !onFrame || !videoRef.current || !canvasRef.current) {
      // If capture was running, stop it
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    let lastFrameTime = 0;
    const frameDuration = 1000 / 30; // Target 30fps

    const captureFrame = (timestamp) => {
      if (!videoRef.current || !canvasRef.current) return; // Guard against null refs

      if (timestamp - lastFrameTime >= frameDuration) {
        lastFrameTime = timestamp;

        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        try {
          ctx.drawImage(videoRef.current, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          onFrame(imageData);
        } catch (error) {
           console.error("Error processing frame:", error);
           // Optionally stop capture if errors persist
        }
      }

      animationRef.current = requestAnimationFrame(captureFrame);
    };

    // Start capturing frames only when conditions are met
    animationRef.current = requestAnimationFrame(captureFrame);

    // Cleanup function for this effect: cancel animation frame
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  // Rerun if activity, permission, frame handler, or dimensions change
  }, [isCameraActive, hasPermission, onFrame, width, height, drawCanvas, canvasRef]);

  // Toggle function only changes the state, effect handles the rest
  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
    if (isCameraActive) {
        // If turning off, reset permission state visually until next attempt
        setHasPermission(null);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {showControls && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          <button
            onClick={toggleCamera}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Loading...' : (isCameraActive ? 'Stop Camera' : 'Start Camera')}
          </button>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-10">
          Loading camera...
        </div>
      )}

      {hasPermission === false && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive bg-opacity-20 text-destructive z-10 p-4 text-center">
          <div>
            <p className="font-bold text-lg">Camera access denied</p>
            <p className="text-sm">Please allow camera access in your browser settings.</p>
          </div>
        </div>
      )}

      {/* Show placeholder or video/canvas */}
      {(!isCameraActive || hasPermission === false) && !isLoading && (
         <div className="w-full bg-muted aspect-video rounded-lg flex items-center justify-center text-muted-foreground">
            Camera is off or permission denied.
         </div>
      )}

      <video
        ref={videoRef}
        className={cn(
          "w-full h-auto rounded-lg",
          // Show video only if active, has permission, and canvas isn't supposed to be drawn
          (isCameraActive && hasPermission && !drawCanvas) ? "block" : "hidden"
        )}
        width={width}
        height={height}
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-auto rounded-lg",
          // Show canvas only if active, has permission, and canvas is supposed to be drawn
          (isCameraActive && hasPermission && drawCanvas) ? "block" : "hidden"
        )}
        width={width}
        height={height}
      />
    </div>
  );
};

export default WebcamView;
