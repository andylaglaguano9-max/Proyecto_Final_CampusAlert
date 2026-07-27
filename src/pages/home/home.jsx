import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, BarChart3, Bot } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'IA Integrada',
      description: 'Clasificación automática de incidentes impulsada por inteligencia artificial en tiempo real.',
      icon: Bot,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      title: 'Reportes Offline',
      description: 'Guarda reportes sin conexión y sincronízalos automáticamente cuando recuperes el internet.',
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    },
    {
      title: 'Análisis de Datos',
      description: 'Visualiza estadísticas precisas para la toma de decisiones en el campus.',
      icon: BarChart3,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      title: 'Seguridad 24/7',
      description: 'Plataforma robusta con autenticación encriptada y gestión segura de datos.',
      icon: ShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    }
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-slate-800/50">
        
        {/* Background Base */}
        <div className="absolute inset-0 -z-30 bg-[#020617]" />
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-8 tracking-tight drop-shadow-2xl">
            CampusAlert <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            La primera plataforma de reporte de incidentes universitarios con inteligencia artificial, funcionamiento offline y analíticas en tiempo real.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/reportar" 
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Reportar Incidente
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-slate-900/80 backdrop-blur-xl hover:bg-slate-800 border border-slate-700/50 hover:border-slate-500 text-white rounded-2xl font-bold shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Ver Panel de Control
              <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 -mt-10">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 -translate-y-1/2" />
        
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 drop-shadow-md tracking-tight">Nuestra Tecnología</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Diseñada para mantener el campus seguro y conectado bajo cualquier circunstancia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="relative group p-8 rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${feature.bg.replace('/10', '')}`} />
              
              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/5 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-slate-100 mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="relative z-10 text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
