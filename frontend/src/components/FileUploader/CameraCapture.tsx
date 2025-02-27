import React, { useRef, useState, useEffect } from 'react';
import { X, Camera as CameraIcon, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      setIsInitializing(true);
      try {
        if (videoRef.current) {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode, aspectRatio: 16/9 } 
          });
          
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          
          // Add a small delay to ensure the video is initialized
          setTimeout(() => {
            setIsInitializing(false);
          }, 1000);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsInitializing(false);
      }
    };
    
    startCamera();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95); // 95% quality
      }
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 dark:bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Take a Photo</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative bg-black aspect-video">
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          )}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Camera frame overlay */}
          <div className="absolute inset-0 pointer-events-none border-2 border-white/30 rounded-lg m-4 opacity-70"></div>
        </div>
        
        <div className="p-5 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <button
            onClick={switchCamera}
            className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Switch camera"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full bg-white dark:bg-gray-700 border-4 border-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-all"
            aria-label="Take photo"
          >
            <CameraIcon className="w-8 h-8 text-blue-500" />
          </button>
          
          <div className="w-11"></div> {/* Spacer for layout balance */}
        </div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;
