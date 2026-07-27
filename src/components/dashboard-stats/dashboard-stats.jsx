import { motion } from 'framer-motion';
import { Activity, ShieldAlert, TrendingUp } from 'lucide-react';

export default function DashboardStats({ activeIncidents }) {
  const pendingCount = activeIncidents.filter(i => i.status === 'pending').length;
  const criticalCount = activeIncidents.filter(i => i.priority === 'critical' || i.priority === 'high').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl flex items-center gap-5 border border-slate-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10 transition-all group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
          <Activity className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Reportes</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{activeIncidents.length}</p>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }} 
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl flex items-center gap-5 border border-slate-700/50 hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/10 transition-all group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors" />
        <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl border border-yellow-500/20 shadow-inner group-hover:scale-110 transition-transform">
          <TrendingUp className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Pendientes</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{pendingCount}</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }} 
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl flex items-center gap-5 border border-slate-700/50 hover:border-red-500/50 shadow-lg hover:shadow-red-500/10 transition-all group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors" />
        <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl border border-red-500/20 shadow-inner group-hover:scale-110 transition-transform">
          <ShieldAlert className="w-8 h-8 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Prioridad Alta</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{criticalCount}</p>
        </div>
      </motion.div>
    </div>
  );
}
