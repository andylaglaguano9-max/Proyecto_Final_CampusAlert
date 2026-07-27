import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldAlert, FileWarning, Clock, CheckCircle2, Activity, UserPlus, LogIn, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuditPanel() {
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [incidentsRes, logsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setIncidents(incidentsRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      toast.error('Error al cargar datos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Polling every 10s for real-time
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      Cargando registro de actividad...
    </div>;
  }

  const activeIncidents = incidents.filter(i => !i.is_deleted);
  const pendingIncidents = activeIncidents.filter(i => i.status === 'pending').length;
  const resolvedIncidents = activeIncidents.filter(i => i.status === 'resolved').length;

  const getActionIcon = (action) => {
    if (action.includes('REGISTER')) return <UserPlus className="w-4 h-4 text-emerald-400" />;
    if (action.includes('CREATE')) return <FileWarning className="w-4 h-4 text-blue-400" />;
    if (action.includes('DELETE')) return <Trash2 className="w-4 h-4 text-red-400" />;
    if (action.includes('EDIT') || action.includes('CHANGE')) return <Edit className="w-4 h-4 text-amber-400" />;
    if (action.includes('LOGIN') || action.includes('VERIFY')) return <LogIn className="w-4 h-4 text-purple-400" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  const formatActionDetails = (action, detailsStr) => {
    if (!detailsStr) return 'Sin detalles adicionales';
    try {
      const details = JSON.parse(detailsStr);
      switch (action) {
        case 'REGISTER_USER':
        case 'REGISTER_USER_GOOGLE':
          return `Se registró un nuevo usuario con el rol de "${details.role || 'estudiante'}". Correo: ${details.email}`;
        case 'CREATE_INCIDENT':
          return `Creó una nueva alerta de nivel "${details.priority === 'high' ? 'Alto' : details.priority === 'medium' ? 'Medio' : 'Bajo'}". ID del reporte: #${details.incident_id}`;
        case 'DELETE_INCIDENT':
          return `Eliminó el reporte #${details.incident_id}.`;
        case 'EDIT_INCIDENT':
          return `Editó la información del reporte #${details.incident_id}.`;
        case 'UPDATE_INCIDENT_STATUS': {
          let text = `Actualizó el reporte #${details.incident_id} - Nuevo estado: ${details.status === 'resolved' ? 'Resuelto' : details.status === 'in_progress' ? 'En Progreso' : details.status}. Prioridad: ${details.priority === 'high' ? 'Alta' : details.priority === 'medium' ? 'Media' : 'Baja'}.`;
          if (details.duration) {
            text += ` (Tiempo de resolución: ${details.duration})`;
          }
          return text;
        }
        case 'CHANGE_ROLE':
          return `Cambió el rol del usuario ${details.target_email} de "${details.old_role}" a "${details.new_role}".`;
        case 'DELETE_USER':
          return `Eliminó al usuario ${details.target_email}.`;
        case 'VERIFY_EMAIL':
          return `Verificó su correo electrónico (${details.email}).`;
        case 'LINK_GOOGLE_ACCOUNT':
          return `Vinculó su cuenta con Google (${details.email}).`;
        default:
          return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ');
      }
    } catch (e) {
      return detailsStr;
    }
  };

  const getActionTitle = (action) => {
    switch (action) {
      case 'REGISTER_USER': return 'Registro de Usuario';
      case 'REGISTER_USER_GOOGLE': return 'Registro con Google';
      case 'CREATE_INCIDENT': return 'Creación de Alerta';
      case 'DELETE_INCIDENT': return 'Eliminación de Alerta';
      case 'EDIT_INCIDENT': return 'Edición de Alerta';
      case 'UPDATE_INCIDENT_STATUS': return 'Actualización de Estado';
      case 'CHANGE_ROLE': return 'Cambio de Rol';
      case 'DELETE_USER': return 'Eliminación de Usuario';
      case 'VERIFY_EMAIL': return 'Verificación de Correo';
      case 'LINK_GOOGLE_ACCOUNT': return 'Vinculación de Cuenta';
      default: return action.replace(/_/g, ' ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">Registro de Actividad</h1>
      </div>
      <p className="text-slate-400 text-sm max-w-2xl">Línea de tiempo de acciones críticas en el sistema. Monitoreo de reportes y permisos.</p>

      {/* Estadísticas de Incidentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-lg group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400 border border-blue-500/20">
            <FileWarning className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Alertas Creadas</p>
            <p className="text-3xl font-black text-white">{activeIncidents.length}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-lg group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
          <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reportes Pendientes</p>
            <p className="text-3xl font-black text-white">{pendingIncidents}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-lg group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reportes Resueltos</p>
            <p className="text-3xl font-black text-white">{resolvedIncidents}</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Línea de Tiempo de Actividades</h2>
        </div>
        
        <div className="p-6">
          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No hay actividades registradas recientemente.
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors shadow-sm"
                >
                  <div className="mt-1 p-2 rounded-full bg-slate-900 border border-slate-700">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">
                        {log.full_name || 'Sistema/Usuario'} <span className="text-slate-400 font-normal ml-1">realizó una acción:</span>
                      </p>
                      <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {new Date(log.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/50 text-cyan-300 border border-cyan-500/20 mb-3 shadow-inner">
                      {getActionTitle(log.action)}
                    </div>
                    <div className="text-sm text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 shadow-inner">
                      {formatActionDetails(log.action, log.details)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
