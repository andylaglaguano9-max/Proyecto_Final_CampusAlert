import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos la ruta pública de estadísticas
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/incidents/stats`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const priorityData = [
    { name: 'Crítica', value: data.filter(d => d.priority === 'critical').length },
    { name: 'Alta', value: data.filter(d => d.priority === 'high').length },
    { name: 'Media', value: data.filter(d => d.priority === 'medium').length },
    { name: 'Leve', value: data.filter(d => d.priority === 'low').length }
  ].filter(p => p.value > 0); // Ocultar si no hay datos

  // Si no hay datos, mostrar algo por defecto
  const renderPriorityData = priorityData.length > 0 ? priorityData : [{ name: 'Sin Datos', value: 1 }];

  // Rose, Orange, Yellow, Emerald
  const COLORS = ['#f43f5e', '#f97316', '#eab308', '#10b981'];
  if (priorityData.length === 0) COLORS[0] = '#334155'; // Gris si no hay datos

  // Calcular tendencia mensual
  const getMonthlyData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const counts = new Array(12).fill(0);
    
    data.forEach(inc => {
      const date = new Date(inc.created_at);
      counts[date.getMonth()] += 1;
    });

    const result = months.map((m, i) => ({ name: m, incidentes: counts[i] }));
    return result;
  };

  const monthlyData = getMonthlyData();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-3 drop-shadow-md">
          Estadísticas del Campus
        </h1>
        <p className="text-slate-400 text-lg font-light">Análisis inteligente en tiempo real de reportes y gestión de incidencias.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
          <p className="text-slate-400 font-medium animate-pulse">Cargando estadísticas en tiempo real...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gráfico 1: Prioridad */}
          <motion.div 
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-slate-500 transition-all shadow-xl hover:shadow-2xl group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
          
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
            Incidentes por Prioridad
          </h2>
          
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={renderPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {renderPriorityData.map((entry, index) => {
                    // Match color to name
                    let color = '#334155';
                    if (entry.name === 'Crítica') color = '#f43f5e';
                    else if (entry.name === 'Alta') color = '#f97316';
                    else if (entry.name === 'Media') color = '#eab308';
                    else if (entry.name === 'Leve') color = '#10b981';

                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color} 
                        style={{ filter: `drop-shadow(0px 0px 8px ${color}80)` }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm font-medium text-slate-300 relative z-10">
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />Crítica</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />Alta</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]" />Media</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />Leve</span>
          </div>
        </motion.div>

        {/* Gráfico 2: Tendencia */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-slate-500 transition-all shadow-xl hover:shadow-2xl group"
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
          
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
            Tendencia Mensual
          </h2>
          
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)' }}
                />
                <Bar 
                  dataKey="incidentes" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      )}
    </motion.div>
  );
}
