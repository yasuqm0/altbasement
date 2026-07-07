import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skull, Mail, Lock, User, UserPlus, AlertTriangle } from 'lucide-react';

const Register = () => {
  const { register, token } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos para el registro.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="goth-transition font-skull-body min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#111111]">
      <div className="goth-transition bg-[#1c1c1c] w-full max-w-md p-8 rounded-none border border-white/10 shadow-none">
        
        {/* Encabezado */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-black border border-white/10 rounded-none flex items-center justify-center mb-4">
            <Skull className="w-6 h-6 text-[#b30000]" />
          </div>
          <h2 className="font-skull-title text-3xl font-extrabold text-white tracking-widest uppercase">
            Registrarse
          </h2>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-skull-nav">
            Únete a la orden y obtén privilegios exclusivos.
          </p>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-black border-l-4 border-[#b30000] text-neutral-300 text-xs rounded-none flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#b30000]" />
            <p className="leading-relaxed font-skull-body">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre de Usuario */}
          <div className="flex flex-col gap-1.5 font-skull-nav">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#b30000]" />
              Nombre de Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="EJ. SOMBRAOSCURA"
              className="w-full bg-black/50 text-neutral-200 border border-white/10 rounded-none px-4 py-3 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000] goth-transition"
            />
          </div>

          {/* Correo Electrónico */}
          <div className="flex flex-col gap-1.5 font-skull-nav">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#b30000]" />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CORREO@EJEMPLO.COM"
              className="w-full bg-black/50 text-neutral-200 border border-white/10 rounded-none px-4 py-3 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000] goth-transition"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5 font-skull-nav">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#b30000]" />
              Contraseña (mínimo 6 carac.)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 text-neutral-200 border border-white/10 rounded-none px-4 py-3 text-xs tracking-wider focus:outline-none focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000] goth-transition"
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="flex flex-col gap-1.5 font-skull-nav">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#b30000]" />
              Confirmar Contraseña
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 text-neutral-200 border border-white/10 rounded-none px-4 py-3 text-xs tracking-wider focus:outline-none focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000] goth-transition"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-none text-sm font-bold tracking-widest text-white bg-[#b30000] hover:bg-[#990000] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 font-skull-nav"
          >
            {loading ? 'PACTANDO...' : 'UNIRSE AL CULTO'}
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        {/* Pie del Formulario */}
        <div className="text-center mt-8 pt-6 border-t border-white/10 text-xs text-neutral-500 font-skull-nav tracking-wider">
          <span className="uppercase">¿Ya perteneces al culto? </span>
          <Link 
            to="/login" 
            className="font-bold hover:underline text-[#b30000] uppercase"
          >
            Iniciar Sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
