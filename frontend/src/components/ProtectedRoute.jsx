import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex flex-col justify-center items-center font-goth-body text-[#e2e8f0]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-b-rose-600 border-t-transparent border-r-transparent border-l-transparent animate-spin [animation-direction:reverse]"></div>
        </div>
        <p className="animate-pulse tracking-widest text-sm text-[#a1a1aa] font-goth-title">
          Invocando perfil desde las sombras...
        </p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
