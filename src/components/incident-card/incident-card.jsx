import { AlertTriangle, Clock, CheckCircle2, ShieldQuestion, Play, Trash2, CheckSquare, Edit3, User, Sparkles, Building, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function IncidentCard({ incident, index, userRole, currentUserId, onUpdateStatus, onResolveStart, onDelete, onEdit }) {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical': return { color: 'text-rose-400 bg-rose-500/20 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]', label: 'Crítica', icon: AlertTriangle };
      case 'high': return { color: 'text-orange-400 bg-orange-500/20 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.3)]', label: 'Alta', icon: AlertTriangle };
      case 'medium': return { color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]', label: 'Media', icon: ShieldQuestion };
      case 'low': return { color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]', label: 'Leve', icon: ShieldQuestion };
      default: return { color: 'text-slate-400 bg-slate-500/20 border-slate-500/30', label: 'Desconocida', icon: ShieldQuestion };
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { color: 'text-yellow-500', label: 'Pendiente', icon: Clock };
      case 'in_progress': return { color: 'text-blue-500', label: 'En Progreso', icon: Clock };
      case 'resolved': return { color: 'text-emerald-500', label: 'Resuelto', icon: CheckCircle2 };
      default: return { color: 'text-slate-500', label: status, icon: Clock };
    }
  };

  const Priority = getPriorityConfig(incident.priority);
  const Status = getStatusConfig(incident.status);

  const isOwner = currentUserId === incident.user_id;
  const isAdmin = userRole === 'admin';
  const isWithin10m = (new Date() - new Date(incident.created_at)) <= 10 * 60 * 1000;
  
  const canDelete = isAdmin || (isOwner && userRole !== 'operador' && isWithin10m && incident.status !== 'resolved');
  const canEdit = isOwner && incident.status === 'pending' && !incident.is_deleted && isWithin10m;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx(
        "backdrop-blur-xl border rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group",
        incident.is_deleted ? "bg-slate-900/40 border-red-900/50 opacity-60 hover:opacity-100" : "bg-slate-900/60 border-slate-700/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {incident.is_deleted && (
        <div className="w-full bg-red-600/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-black px-4 py-1.5 text-center shadow-sm uppercase tracking-wider border-b border-red-500/50">
          Eliminado
        </div>
      )}

      {incident.image_data && (
        <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
          <img src={incident.image_data} alt="Evidencia" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
      )}
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4 mt-2">
          <span className={clsx("px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border backdrop-blur-sm transition-all", Priority.color)}>
            <Priority.icon className="w-3.5 h-3.5" />
            {Priority.label}
          </span>
          {!incident.is_deleted && (
            <span className={clsx("flex items-center gap-1.5 text-sm font-bold", Status.color)}>
              <Status.icon className="w-4 h-4 drop-shadow-sm" />
              {Status.label}
            </span>
          )}
        </div>
        <p className="text-slate-300 text-sm mb-5 line-clamp-3 leading-relaxed">{incident.description}</p>
        
        {incident.ai_analysis && (
          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 mt-5 shadow-inner">
            <p className="text-xs text-cyan-400 font-bold mb-2 flex items-center gap-2 drop-shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ✨ Análisis IA
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-light">{incident.ai_analysis}</p>
          </div>
        )}
        
        <div className="mt-5 text-xs text-slate-500 flex flex-col gap-2 pb-5 border-b border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-3 sm:gap-4">
            <span className="font-medium text-slate-300 flex items-center gap-1.5 mt-0.5 min-w-0 max-w-full">
              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate" title={incident.reporter_name || 'Estudiante'}>
                {incident.reporter_name || 'Estudiante'}
              </span>
            </span>
            <div className="flex flex-col items-start sm:items-end gap-1 shrink-0 ml-5 sm:ml-0">
              {incident.location_text && (
                <span className="text-slate-200 font-semibold max-w-[200px] sm:max-w-[160px] text-left sm:text-right truncate flex items-center gap-1.5" title={incident.location_text}>
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {incident.location_text}
                </span>
              )}
              {(incident.lat && incident.lng) ? (
                <a href={`https://www.google.com/maps/search/?api=1&query=${incident.lat},${incident.lng}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-2 hover:underline">
                  <MapPin className="w-3.5 h-3.5" /> Ver GPS en Mapa
                </a>
              ) : (
                !incident.location_text && <span className="text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Sin ubicación</span>
              )}
            </div>
          </div>
          <span className="font-medium text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Reportado: {new Date(incident.created_at).toLocaleDateString()} a las {new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
          {incident.status === 'resolved' && incident.resolved_at && (
            <div className="flex flex-col gap-2 mt-1 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span className="font-medium text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Resuelto el {new Date(incident.resolved_at).toLocaleDateString()} a las {new Date(incident.resolved_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                <span className="ml-auto text-emerald-400/80">
                  (Tomó {
                    (() => {
                      const diffMs = new Date(incident.resolved_at) - new Date(incident.created_at);
                      const hours = Math.floor(diffMs / (1000 * 60 * 60));
                      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${mins}m`;
                    })()
                  })
                </span>
              </span>
              {incident.resolution_comment && (
                <div className="text-emerald-400/90 text-sm mt-1 pl-6 relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-emerald-500/30"></div>
                  <span className="font-semibold block mb-0.5">Comentario de resolución:</span>
                  {incident.resolution_comment}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Acciones */}
        <div className="mt-5 flex flex-wrap gap-3 justify-end">
          {canEdit && (
             <button 
               onClick={() => onEdit(incident.id, incident.description)}
               className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-slate-500 active:scale-95"
             >
               <Edit3 className="w-3.5 h-3.5" />
               Editar
             </button>
          )}

          {(userRole === 'admin' || userRole === 'operador') && !incident.is_deleted && (
            <>
              {incident.status === 'pending' && (
                <button 
                  onClick={() => onUpdateStatus(incident.id, 'in_progress')}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  Atender
                </button>
              )}
              {incident.status === 'in_progress' && (
                <button 
                  onClick={() => onResolveStart(incident.id)}
                  className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Resolver
                </button>
              )}
            </>
          )}

          {canDelete && !incident.is_deleted && (
            <button 
              onClick={() => onDelete(incident.id)}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-slate-800/80 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-colors hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-95"
              title={isAdmin ? "Eliminar Reporte (Admin)" : "Eliminar (Tienes 24h para hacerlo)"}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
