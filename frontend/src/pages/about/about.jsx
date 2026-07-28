import { motion } from 'framer-motion';
import { Mail, ShieldCheck, Zap, BrainCircuit, Users, Globe, Link as LinkIcon } from 'lucide-react';
import laglaguanoImg from '../../assets/Laglaguano.png';

export default function About() {
  const team = [
    { 
      name: 'Andy Laglaguano', 
      role: 'Desarrollador Full Stack & Fundador', 
      img: laglaguanoImg,
      bio: 'Apasionado por la tecnología y la inteligencia artificial. Dedicado a construir soluciones modernas y eficientes que generen un impacto real en la comunidad universitaria.',
      links: {
        github: '#',
        linkedin: '#',
        email: 'mailto:andy@example.com'
      }
    },
  ];

  const features = [
    {
      title: "Inteligencia Artificial",
      description: "Utilizamos IA de vanguardia para analizar y categorizar automáticamente los reportes de incidentes con alta precisión.",
      icon: BrainCircuit,
      color: "text-purple-400"
    },
    {
      title: "Respuesta Inmediata",
      description: "Nuestro sistema de alertas en tiempo real asegura que el personal adecuado sea notificado al instante.",
      icon: Zap,
      color: "text-amber-400"
    },
    {
      title: "Seguridad Total",
      description: "Mantenemos un registro inmutable de todos los eventos y usamos autenticación estricta para garantizar seguridad.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-24 mb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto pt-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-8 tracking-tight">
          Revolucionando la Seguridad Estudiantil
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
          En <span className="text-white font-semibold">CampusAlert AI</span> combinamos innovación, diseño y tecnología avanzada para crear entornos educativos más seguros, eficientes y conectados.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-3xl border border-slate-700/50 hover:border-slate-500/50 transition-colors group">
            <div className={`w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform ${feature.color}`}>
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </motion.div>

      {/* Team Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-10"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium text-sm mb-4 border border-blue-500/20">
            <Users className="w-4 h-4" />
            <span>Nuestro Equipo</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Conoce al Creador</h2>
        </div>

        <div className="flex justify-center">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="glass-panel max-w-md w-full p-10 rounded-[2.5rem] border border-slate-700/50 text-center group hover:shadow-2xl hover:shadow-blue-900/20 transition-all relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-40 h-40 mx-auto bg-slate-800 rounded-full mb-8 overflow-hidden border-4 border-slate-700 group-hover:border-blue-500 transition-colors shadow-2xl">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-semibold mb-6">{member.role}</p>
                <p className="text-slate-400 text-base mb-8 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-4 text-slate-400">
                  <a href={member.links.github} className="p-3 bg-slate-800/80 rounded-xl hover:bg-white hover:text-slate-900 transition-colors border border-slate-700"><Globe className="w-5 h-5" /></a>
                  <a href={member.links.linkedin} className="p-3 bg-slate-800/80 rounded-xl hover:bg-blue-500 hover:text-white transition-colors border border-slate-700"><LinkIcon className="w-5 h-5" /></a>
                  <a href={member.links.email} className="p-3 bg-slate-800/80 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-slate-700"><Mail className="w-5 h-5" /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
