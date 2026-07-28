import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { saveOfflineIncident } from '../../services/db';
import { Send, Loader2, AlertTriangle, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraCapture from '../../components/camera-capture';
import LocationPicker from '../../components/location-picker';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Leve (No urgente)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20' },
  { value: 'medium', label: 'Media (Requiere atención pronto)', color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20' },
  { value: 'high', label: 'Alta (Urgente)', color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20' },
  { value: 'critical', label: 'Extrema (Emergencia crítica)', color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20' }
];

export default function Report() {
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [image, setImage] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === priority);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      description,
      location_text: locationText,
      lat: location.lat,
      lng: location.lng,
      image_data: image,
      priority
    };

    if (navigator.onLine) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('¡Incidente reportado exitosamente! Analizado por IA.', { duration: 3000 });
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        toast.error('Error al enviar. Guardando localmente...', { duration: 3000 });
        await saveOfflineIncident(payload);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } else {
      await saveOfflineIncident(payload);
      toast.success('Guardado offline. Se sincronizará cuando haya conexión.', { duration: 3000 });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 relative">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 p-6 md:p-10 rounded-3xl shadow-2xl hover:border-slate-600 transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <h1 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-md flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></span>
          Reportar <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Incidente</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="relative">
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-cyan-400" />
              Nivel de Prioridad / Gravedad
            </label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between bg-slate-950/50 border ${isDropdownOpen ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'border-slate-700/80'} rounded-xl p-4 cursor-pointer transition-all shadow-inner`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${selectedPriority?.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} style={{ color: selectedPriority?.color.replace('text-', 'var(--tw-colors-') + ')' }} />
                <span className={`font-medium ${selectedPriority?.color}`}>{selectedPriority?.label}</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden origin-top"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <div 
                      key={opt.value}
                      onClick={() => {
                        setPriority(opt.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${opt.bg} ${priority === opt.value ? 'bg-slate-800' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${opt.color.replace('text-', 'bg-')}`} />
                        <span className={`font-medium ${opt.color}`}>{opt.label}</span>
                      </div>
                      {priority === opt.value && <Check className={`w-5 h-5 ${opt.color}`} />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Descripción detallada del daño o incidente
            </label>
            <textarea
              required
              rows="4"
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl p-5 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-slate-600 shadow-inner"
              placeholder="Ej. Tubo de agua roto inundando el laboratorio del sótano..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Referencia del lugar (Opcional)
            </label>
            <input
              type="text"
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl p-4 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="Ej. Baño del primer piso, Edificio principal..."
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CameraCapture image={image} setImage={setImage} />
            <LocationPicker location={location} setLocation={setLocation} />
          </div>

          {!navigator.onLine && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <AlertTriangle className="w-5 h-5" /> Estás sin conexión. El reporte se guardará localmente.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? 'Procesando con IA...' : 'Enviar Reporte a IA'}
          </button>
        </form>
      </div>
    </div>
  );
}
