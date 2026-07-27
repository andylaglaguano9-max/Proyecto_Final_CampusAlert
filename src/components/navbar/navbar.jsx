import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, FileWarning, LayoutDashboard, LogIn, Home, BarChart2, Users, Mail, User, ShieldCheck, Inbox } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setForceRender] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setForceRender(prev => prev + 1);
    window.addEventListener('user-updated', handleUpdate);
    return () => window.removeEventListener('user-updated', handleUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Inicio', path: '/', icon: Home, public: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, public: false },
    { name: 'Estadísticas', path: '/analytics', icon: BarChart2, public: true },
    { name: 'Reportar', path: '/reportar', icon: FileWarning, public: false },
    { name: 'Nosotros', path: '/about', icon: Users, public: true },
    { name: 'Contacto', path: '/contact', icon: Mail, public: true },
  ];

  let userRole = null;
  let userName = null;
  if (isAuthenticated) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      userRole = user?.role;
      userName = user?.full_name;
    } catch (e) { }
  }

  const visibleLinks = navLinks.filter(link => link.public || isAuthenticated);

  if (userRole === 'admin') {
    visibleLinks.push({ name: 'Usuarios', path: '/users', icon: Users, public: false });
    visibleLinks.push({ name: 'Auditoría', path: '/audit', icon: ShieldCheck, public: false });
    visibleLinks.push({ name: 'Mensajes', path: '/messages', icon: Inbox, public: false });
  }

  // Eliminar Perfil de los enlaces visibles (se moverá al menú desplegable)
  // if (isAuthenticated) {
  //   visibleLinks.push({ name: 'Perfil', path: '/profile', icon: User, public: false });
  // }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 shadow-2xl sticky top-4 z-50 mx-4 lg:mx-auto max-w-7xl rounded-2xl mt-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight hidden sm:block">CampusAlert <span className="text-cyan-400">AI</span></span>
            </Link>
          </div>

          {/* Center: Links */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-1">
              {visibleLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3 py-5 text-sm font-medium transition-colors flex items-center gap-2 group h-16"
                  >
                    <link.icon className={clsx("h-4 w-4", isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                    <span className={isActive ? "text-white" : "text-slate-300 group-hover:text-white"}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-t-full shadow-[0_-4px_12px_rgba(34,211,238,0.8)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Auth */}
          <div className="flex-1 flex justify-end items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-slate-800/50 px-3 py-2 rounded-xl transition-colors outline-none"
                >
                  <span className="text-sm font-medium text-slate-300 hidden sm:block">{userName || 'Usuario'}</span>
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-cyan-400 overflow-hidden ring-2 ring-transparent transition-all hover:ring-cyan-500/50">
                    {(() => {
                      try {
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (user?.profile_picture) {
                          return <img src={user.profile_picture} alt="Perfil" className="w-full h-full object-cover" />;
                        }
                      } catch(e) {}
                      return <User className="w-5 h-5" />;
                    })()}
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 overflow-hidden z-50 origin-top-right"
                    >
                      <Link 
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        Mi Perfil
                      </Link>
                      <div className="h-px bg-slate-800 my-1"></div>
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/50 hover:border-transparent text-blue-400 hover:text-white px-5 py-2 rounded-xl transition-all text-sm font-medium"
              >
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-900/90 flex flex-wrap justify-around py-2 rounded-b-2xl">
        {visibleLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={clsx(
              'px-2 py-2 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
              location.pathname === link.path
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
