import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CameraCapture({ image, setImage }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Evidencia Fotográfica</label>
      
      {isCameraOpen ? (
        <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden border-2 border-slate-600">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {/* Controles de cámara */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4">
            <button 
              type="button"
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              title="Cancelar"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              type="button"
              onClick={capturePhoto}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
              title="Tomar Foto"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          {image ? (
            <div className="relative w-full h-48 border-2 border-slate-600 rounded-lg group">
              <img src={image} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-400">Cámara Web</span>
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="file"
                  accept="image/*"
                  id="cameraInput"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="cameraInput"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-400">Subir Archivo</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
