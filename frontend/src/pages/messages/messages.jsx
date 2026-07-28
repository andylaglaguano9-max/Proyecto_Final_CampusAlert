import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Clock, Inbox } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages', err);
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mensaje marcado como leído');
      // Actualizar localmente
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error('Error', err);
      toast.error('Error al actualizar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 flex items-center gap-3 drop-shadow-md">
            <Inbox className="w-10 h-10 text-cyan-400" />
            Bandeja de Mensajes
          </h1>
          <p className="text-slate-400 mt-2">Gestiona las consultas y dudas de los usuarios.</p>
        </div>
        <div className="bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-3">
          <span className="text-slate-300 font-medium">Mensajes sin leer:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${unreadCount > 0 ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-700 text-slate-400'}`}>
            {unreadCount}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-slate-900/60 p-12 rounded-3xl text-center border border-slate-700/50"
            >
              <Inbox className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl text-slate-300 font-bold mb-2">Bandeja Vacía</h3>
              <p className="text-slate-500">No hay mensajes de contacto por el momento.</p>
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 transition-all ${
                  msg.is_read 
                    ? 'bg-slate-900/40 border-slate-800' 
                    : 'bg-slate-900/80 border-cyan-900/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                }`}
              >
                {!msg.is_read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-slate-300 border border-slate-700">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${msg.is_read ? 'text-slate-300' : 'text-white'}`}>
                          {msg.name}
                        </h3>
                        <a href={`mailto:${msg.email}`} className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                          {msg.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                      <p className={`whitespace-pre-wrap leading-relaxed ${msg.is_read ? 'text-slate-400' : 'text-slate-200'}`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(msg.created_at).toLocaleString('es-ES', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' 
                      })}
                    </div>

                    {!msg.is_read ? (
                      <button 
                        onClick={() => markAsRead(msg.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl transition-colors border border-cyan-500/20"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar Leído
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-500 rounded-xl cursor-default">
                        <CheckCircle className="w-4 h-4" />
                        Leído
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
