import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGothicPoetry } from '../context/GothicPoetryContext';
import { Skull, User, LogIn, LogOut, Sparkles, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useGothicPoetry();
  const navigate = useNavigate();

  // Mapear tema a nombres legibles y colores estéticos alineados a la estética Skull Rider
  const getThemeBadge = () => {
    switch (theme) {
      case 'theme-cripta':
        return { name: 'CRIPTA RIDER', color: 'bg-purple-950/20 text-purple-400 border-purple-900/40' };
      case 'theme-vampirico':
        return { name: 'CARMÍN RIDER', color: 'bg-[#b30000]/10 text-[#b30000] border-[#b30000]/30' };
      case 'theme-niebla':
      default:
        return { name: 'NEBLINA RIDER', color: 'bg-zinc-900/50 text-zinc-400 border-zinc-800/60' };
    }
  };

  const badge = getThemeBadge();

  return (
    <nav className="goth-transition sticky top-0 z-50 w-full bg-[#1c1c1c] border-b border-white/10 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-none font-skull-nav">
      {/* Logotipo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <Skull className="w-6 h-6 text-[#b30000] group-hover:text-white transition-all duration-300" />
          <span className="font-skull-title text-2xl font-extrabold tracking-widest text-white">
            ALTBASEMENT
          </span>
        </Link>
        
        {/* Badge de Tema Literario actual */}
        <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-none text-xs font-bold border tracking-widest ${badge.color}`}>
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>{badge.name}</span>
        </div>
      </div>

      {/* Navegación y Acciones */}
      <div className="flex items-center gap-6 text-sm tracking-widest uppercase">
        <Link 
          to="/" 
          className="text-neutral-300 hover:text-[#b30000] transition-colors duration-200 font-medium flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-neutral-400" />
          Catálogo
        </Link>

        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="text-neutral-300 hover:text-[#b30000] transition-colors duration-200 font-medium flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-neutral-400" />
              <span>ADEPTO: <strong className="text-[#b30000]">{user.username}</strong></span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-1.5 text-xs bg-zinc-900 text-zinc-400 hover:text-white hover:bg-[#b30000] border border-zinc-800 hover:border-[#b30000] px-4 py-2 rounded-none transition-all duration-200 cursor-pointer font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-neutral-300 hover:text-[#b30000] transition-colors duration-200"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Link>
            <Link
              to="/register"
              className="goth-transition bg-[#b30000] text-white border border-[#b30000] hover:bg-transparent hover:text-[#b30000] px-4 py-2 rounded-none font-bold transition-all duration-200"
            >
              Unirse al Culto
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
