import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GothicPoetryProvider, useGothicPoetry } from './context/GothicPoetryContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function AppContent() {
  const { theme } = useGothicPoetry();

  // Cambiar el color de fondo raíz según el tema activo para evitar flashes
  return (
    <div className={`min-h-screen goth-transition ${theme} bg-[#111111] text-[#e2e8f0] relative flex flex-col`}>
      
      {/* Neblinas o brillos temáticos difusos en el fondo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {theme === 'theme-vampirico' ? (
          <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] bg-rose-950/15 blur-[130px] rounded-full animate-fog"></div>
        ) : theme === 'theme-cripta' ? (
          <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] bg-purple-950/15 blur-[130px] rounded-full animate-fog"></div>
        ) : (
          <div className="absolute top-[-10%] left-[20%] w-[60%] h-[50%] bg-sky-950/8 blur-[130px] rounded-full animate-fog"></div>
        )}
      </div>

      {/* Contenido principal de la aplicación */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <footer className="py-8 text-center border-t border-white/5 text-xs text-neutral-600 mt-auto font-goth-body">
          <p className="tracking-widest font-goth-title font-semibold text-neutral-400">
            ALTBASEMENT
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            Pacto mercantil desacoplado bajo el influjo de las tinieblas literarias.
          </p>
        </footer>
      </div>

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GothicPoetryProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GothicPoetryProvider>
    </AuthProvider>
  );
}

export default App;
