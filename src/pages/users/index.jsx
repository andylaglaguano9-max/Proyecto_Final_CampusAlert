import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserCog, Trash2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      toast.error('Error al cargar datos de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${userId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Rol actualizado');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al actualizar rol');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuario eliminado');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      Cargando usuarios...
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-8 h-8 text-purple-500" />
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 tracking-tight">Usuarios</h1>
      </div>
      <p className="text-slate-400 text-sm max-w-2xl">Administración de las cuentas registradas en la plataforma, asignación de roles y permisos.</p>

      {/* Estadísticas de Usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-lg group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
          <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Registrados</p>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
        </motion.div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <UserCog className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Gestión de Accesos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium border-b border-slate-700">Usuario</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700">Correo</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700">Rol</th>
                <th className="px-6 py-4 font-medium border-b border-slate-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.full_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      user.role === 'operador' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select 
                        className="bg-slate-900 border border-slate-600 text-sm rounded-lg px-2 py-1 text-slate-300 outline-none focus:border-purple-500 transition-colors"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="user">Usuario Normal</option>
                        <option value="student">Estudiante</option>
                        <option value="operador">Operador</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
