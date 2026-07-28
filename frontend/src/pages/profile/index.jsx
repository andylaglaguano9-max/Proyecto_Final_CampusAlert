import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Lock, Save, Loader2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePanel() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', password: '', profile_picture: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      setFormData({ full_name: savedUser.full_name, password: '', profile_picture: savedUser.profile_picture || '' });
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { full_name: formData.full_name, profile_picture: formData.profile_picture };
      if (formData.password) payload.password = formData.password;

      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setFormData({ ...formData, password: '' });
      toast.success('¡Perfil actualizado con éxito!');
      window.dispatchEvent(new Event('user-updated')); // Dispatch event to update navbar
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al actualizar perfil');
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-xl group-hover:border-cyan-500/50 transition-all">
              {formData.profile_picture ? (
                <img src={formData.profile_picture} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <User className="w-16 h-16 text-slate-500" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-xs text-white font-medium">Cambiar</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 drop-shadow-md">
              Configuración de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Perfil</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Personaliza tu identidad en CampusAlert</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Correo Electrónico</label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-xl p-4 cursor-not-allowed shadow-inner"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Rol Actual</label>
              <input
                type="text"
                disabled
                value={user.role === 'admin' ? 'Administrador' : user.role === 'operador' ? 'Operador' : 'Estudiante'}
                className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-xl p-4 cursor-not-allowed shadow-inner uppercase tracking-wider font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Nueva Contraseña <span className="text-slate-500 font-normal">(Opcional)</span></label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Déjalo en blanco para mantener la actual"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Guardando Cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
