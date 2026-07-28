import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Autocompletar si el usuario está logueado
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.full_name || '',
          email: user.email || ''
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error('Por favor, completa todos los campos.');
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/contact`, formData);
      toast.success('¡Mensaje enviado correctamente! Te contactaremos pronto.');
      setFormData(prev => ({ ...prev, message: '' })); // Solo borramos el mensaje
    } catch (err) {
      console.error('Error enviando mensaje', err);
      toast.error('Hubo un error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Contact Info */}
        <div className="relative z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />
          
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 drop-shadow-md">
            Ponte en <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">contacto</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed font-light">
            ¿Tienes alguna duda sobre el uso de la plataforma o encontraste un problema que requiere atención inmediata del equipo de desarrollo? Escríbenos, estamos aquí para ayudarte.
          </p>

          <div className="space-y-6">
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-default p-4 rounded-2xl hover:bg-slate-800/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <MapPin className="w-7 h-7 drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-300 transition-colors">Ubicación</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">Edificio de Sistemas, Universidad Central</p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-default p-4 rounded-2xl hover:bg-slate-800/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 text-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:text-fuchsia-300 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                <Mail className="w-7 h-7 drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">Correo Electrónico</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">soporte@campusalert.edu.ec</p>
              </div>
            </motion.div>
            
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-default p-4 rounded-2xl hover:bg-slate-800/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 text-green-400 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:text-emerald-300 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Phone className="w-7 h-7 drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-green-300 transition-colors">Teléfono</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">+593 99 123 4567</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          <div className="bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl hover:border-slate-600 transition-colors">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" 
                  placeholder="Ej. Juan Pérez" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" 
                  placeholder="juan@universidad.edu.ec" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Mensaje</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all placeholder:text-slate-600" 
                  placeholder="¿En qué te podemos ayudar?"
                ></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-8 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'} <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
