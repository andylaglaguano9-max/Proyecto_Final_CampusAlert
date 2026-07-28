import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token no encontrado en la URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/verify`, { token });
        setStatus('success');
        setMessage(res.data.mensaje || '¡Cuenta verificada exitosamente!');
        toast.success('Cuenta verificada exitosamente');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Error al verificar la cuenta. El enlace puede haber expirado.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${
          status === 'loading' ? 'bg-blue-500/20' : status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`} />

        <div className="relative z-10 flex flex-col items-center">
          {status === 'loading' && <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />}
          {status === 'success' && <CheckCircle2 className="w-16 h-16 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />}
          {status === 'error' && <XCircle className="w-16 h-16 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />}
          
          <h1 className="text-2xl font-bold text-white mb-4">Verificación de Correo</h1>
          <p className="text-slate-300 mb-8">{message}</p>
          
          {status !== 'loading' && (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
            >
              Ir a Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
