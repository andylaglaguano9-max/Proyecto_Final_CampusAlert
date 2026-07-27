import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Activity, ShieldAlert, CheckCircle2, TrendingUp, RefreshCw, X, Save, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IncidentCard from '../../components/incident-card';
import EditIncidentModal from '../../components/modals/edit-incident-modal';
import ResolveIncidentModal from '../../components/modals/resolve-incident-modal';
import DashboardStats from '../../components/dashboard-stats/dashboard-stats';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editModal, setEditModal] = useState({ isOpen: false, id: null, description: '', saving: false });
  const [resolveModal, setResolveModal] = useState({ isOpen: false, id: null, comment: '', saving: false });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
      setCurrentUserId(user.id);
    }
  }, []);

  const openEditModal = (id, description) => {
    setEditModal({ isOpen: true, id, description, saving: false });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, id: null, description: '', saving: false });
  };

  const saveEdit = async () => {
    if (!editModal.description.trim()) {
      toast.error('La descripción no puede estar vacía');
      return;
    }
    
    setEditModal(prev => ({ ...prev, saving: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents/${editModal.id}/edit`, { description: editModal.description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reporte editado con éxito');
      closeEditModal();
      fetchIncidents();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al editar');
      setEditModal(prev => ({ ...prev, saving: false }));
    }
  };

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(res.data);
    } catch (err) {
      toast.error('Error de conexión. ¿Está encendido MySQL y el Backend?', { id: 'db-error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, newStatus, comment = null) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { status: newStatus };
      if (comment) payload.resolution_comment = comment;

      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Estado actualizado');
      fetchIncidents();
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const openResolveModal = (id) => {
    setResolveModal({ isOpen: true, id, comment: '', saving: false });
  };

  const closeResolveModal = () => {
    setResolveModal({ isOpen: false, id: null, comment: '', saving: false });
  };

  const confirmResolve = async () => {
    setResolveModal(prev => ({ ...prev, saving: true }));
    await handleUpdateStatus(resolveModal.id, 'resolved', resolveModal.comment);
    closeResolveModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este reporte?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Reporte eliminado');
      fetchIncidents();
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const activeIncidents = incidents.filter(i => !i.is_deleted);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative">
      <AnimatePresence>
        <EditIncidentModal 
          isOpen={editModal.isOpen} 
          description={editModal.description} 
          saving={editModal.saving} 
          onClose={closeEditModal} 
          onSave={saveEdit} 
          onChangeDescription={(desc) => setEditModal(prev => ({ ...prev, description: desc }))} 
        />
      </AnimatePresence>

      <AnimatePresence>
        <ResolveIncidentModal 
          isOpen={resolveModal.isOpen} 
          comment={resolveModal.comment} 
          saving={resolveModal.saving} 
          onClose={closeResolveModal} 
          onResolve={confirmResolve} 
          onChangeComment={(cmt) => setResolveModal(prev => ({ ...prev, comment: cmt }))} 
        />
      </AnimatePresence>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
            Panel de Control
          </h1>
          <p className="text-slate-400 mt-2">Monitoreo en tiempo real de incidentes del campus.</p>
        </div>
        <button 
          onClick={fetchIncidents}
          className="flex items-center gap-2 px-4 py-2 glass-panel rounded-lg hover:bg-slate-800 transition-colors text-sm text-blue-300"
        >
          <RefreshCw className={loading ? 'animate-spin w-4 h-4' : 'w-4 h-4'} />
          Actualizar
        </button>
      </div>

      <DashboardStats activeIncidents={activeIncidents} />

      <div className="pt-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Incidentes Recientes
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => (
               <div key={i} className="glass-panel h-64 rounded-xl animate-pulse"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map((inc, i) => (
              <IncidentCard 
                key={inc.id} 
                incident={inc} 
                index={i} 
                userRole={userRole}
                currentUserId={currentUserId}
                onUpdateStatus={handleUpdateStatus}
                onResolveStart={openResolveModal}
                onDelete={handleDelete}
                onEdit={openEditModal}
              />
            ))}
            {incidents.length === 0 && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center glass-panel rounded-2xl border-dashed border-2 border-slate-600">
                <div className="bg-slate-800 p-6 rounded-full mb-6">
                  <CheckCircle2 className="w-16 h-16 text-green-400 opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Todo en orden</h3>
                <p className="text-slate-400 max-w-md text-center">
                  Actualmente no hay ningún incidente reportado en el campus. Si ves algún problema, usa el botón de "Reportar Incidente".
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
