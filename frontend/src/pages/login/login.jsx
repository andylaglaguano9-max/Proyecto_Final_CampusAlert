import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', full_name: '' });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`, {
        credential: credentialResponse.credential
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsAuthenticated(true);
      toast.success('Sesión iniciada con Google');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al autenticar con Google');
    }
  };

  const handleGoogleError = () => {
    toast.error('Autenticación con Google cancelada o fallida');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${endpoint}`, formData);
      
      if (res.data.requiresVerification) {
        toast.success(res.data.mensaje || 'Revisa tu correo para verificar tu cuenta', { duration: 5000 });
        setIsLogin(true); // Switch to login screen after register
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        toast.success('Bienvenido a CampusAlert AI');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ocurrió un error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] relative px-4">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-3xl h-[120%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="bg-slate-900/70 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
        
        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 text-blue-400 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <ShieldAlert className="h-10 w-10 drop-shadow-[0_0_8px_currentColor]" />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight drop-shadow-md">
            CampusAlert <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
          </h1>
          <p className="text-slate-400 mt-2 text-center text-sm font-light">Plataforma inteligente de gestión de incidentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre Completo</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="Ej. Juan Pérez"
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Correo Institucional</label>
            <input
              type="email"
              required
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="correo@universidad.edu.ec"
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              required
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="••••••••"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 mt-4"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 relative z-10">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">O continuar con</span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              width="100%"
              text={isLogin ? 'signin_with' : 'signup_with'}
            />
          </div>
        </div>

        <div className="mt-8 text-center relative z-10">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
