import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  Skull, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  ShoppingBag, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, resumenRes] = await Promise.all([
        api.get('accounts/perfil/'),
        api.get('dashboard/resumen/')
      ]);
      setProfile(profileRes.data);
      setResumen(resumenRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setErrorMsg('No se pudieron recuperar las estadísticas sagradas del abismo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center font-skull-nav text-[#e2e8f0]">
        <div className="w-12 h-12 border-4 border-[#b30000] border-t-transparent animate-spin mb-4 rounded-none"></div>
        <p className="animate-pulse tracking-widest text-sm text-[#a1a1aa] uppercase font-bold">
          Invocando secretos del Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="goth-transition font-skull-body max-w-7xl mx-auto px-4 md:px-8 py-12 bg-[#111111]">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-10">
        <div>
          <h1 className="font-skull-title text-3xl font-black text-white flex items-center gap-3 tracking-widest uppercase">
            <Skull className="w-8 h-8 text-[#b30000]" />
            PANEL PRIVADO
          </h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-skull-nav">
            Bienvenido al sanctum del adepto <strong className="text-[#b30000]">{user?.username}</strong>.
          </p>
        </div>
        
        <button
          onClick={fetchDashboardData}
          className="goth-transition px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none border border-[#b30000] text-[#b30000] hover:bg-[#b30000] hover:text-white cursor-pointer flex items-center gap-2 font-skull-nav bg-transparent"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualizar Registros
        </button>
      </div>

      {errorMsg && (
        <div className="mb-8 p-4 bg-black border-l-4 border-[#b30000] text-neutral-300 text-xs rounded-none flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#b30000]" />
          <div>
            <p className="font-bold font-skull-nav tracking-wider uppercase">Error del Abismo</p>
            <p className="leading-relaxed mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO IZQUIERDO: Información del Perfil */}
        <section className="lg:col-span-1">
          <div className="goth-transition bg-[#1c1c1c] rounded-none p-6 border border-white/10 shadow-none flex flex-col gap-6">
            
            <div className="flex flex-col items-center border-b border-white/10 pb-6">
              <div className="w-20 h-20 bg-black border border-white/10 rounded-none flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="font-skull-title text-2xl font-bold text-white uppercase tracking-wider">
                {profile?.username || user?.username}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-widest mt-2 px-3 py-1 rounded-none border border-[#b30000]/30 text-[#b30000] bg-[#b30000]/10 font-skull-nav">
                Adepto de la Orden
              </span>
            </div>

            {/* Detalles de Perfil */}
            <div className="flex flex-col gap-4 text-sm font-skull-body">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-2 font-skull-nav">
                Escrituras de Identidad
              </h4>
              
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-500 mt-0.5" />
                <div>
                  <span className="text-[9px] text-neutral-500 block uppercase font-skull-nav tracking-wider">Correo del Culto</span>
                  <span className="text-neutral-200">{profile?.email || 'Desconocido'}</span>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-500 mt-0.5" />
                <div>
                  <span className="text-[9px] text-neutral-500 block uppercase font-skull-nav tracking-wider">Línea de Enlace</span>
                  <span className="text-neutral-200">{profile?.telefono || 'No registrado'}</span>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
                <div>
                  <span className="text-[9px] text-neutral-500 block uppercase font-skull-nav tracking-wider">Cripta o Residencia</span>
                  <span className="text-neutral-200 leading-normal">{profile?.direccion || 'No registrada'}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* LADO DERECHO: Estadísticas */}
        <section className="lg:col-span-2 flex flex-col gap-8">
          <h2 className="font-skull-title text-2xl font-bold text-white border-b border-white/10 pb-2 tracking-wider uppercase">
            Estado de las Reliquias & Órdenes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Venta Total */}
            <div className="goth-transition bg-[#1c1c1c] rounded-none p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4 font-skull-nav">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Total de Ventas
                </span>
                <div className="p-2 bg-black border border-white/10 text-neutral-400 rounded-none">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="font-skull-body text-3xl font-extrabold text-[#b30000]">
                ${parseFloat(resumen?.total_ventas || 0).toFixed(2)}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-skull-nav">
                Volumen comercial total registrado en el templo.
              </p>
            </div>

            {/* Total Productos Activos */}
            <div className="goth-transition bg-[#1c1c1c] rounded-none p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4 font-skull-nav">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Productos Activos
                </span>
                <div className="p-2 bg-black border border-white/10 text-neutral-400 rounded-none">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="font-skull-body text-3xl font-extrabold text-[#b30000]">
                {resumen?.total_productos || 0}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-skull-nav">
                Reliquias góticas catalogadas y visibles.
              </p>
            </div>

            {/* Órdenes Pagadas */}
            <div className="goth-transition bg-[#1c1c1c] rounded-none p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4 font-skull-nav">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Órdenes Concretadas
                </span>
                <div className="p-2 bg-black border border-white/10 text-neutral-400 rounded-none">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="font-skull-body text-3xl font-extrabold text-[#b30000]">
                {resumen?.ordenes_pagadas || 0}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-skull-nav">
                Pactos de compra pagados y despachados.
              </p>
            </div>

            {/* Órdenes Pendientes */}
            <div className="goth-transition bg-[#1c1c1c] rounded-none p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4 font-skull-nav">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Órdenes Pendientes
                </span>
                <div className="p-2 bg-black border border-white/10 text-neutral-400 rounded-none">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="font-skull-body text-3xl font-extrabold text-[#b30000]">
                {resumen?.ordenes_pendientes || 0}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-skull-nav">
                Pactos en espera de confirmación de pago.
              </p>
            </div>

          </div>

          {/* Sección Informativa */}
          <div className="bg-[#1c1c1c] rounded-none p-5 border border-white/10 flex flex-col gap-3">
            <h3 className="font-skull-title text-lg font-bold text-neutral-300 flex items-center gap-1.5 border-b border-white/10 pb-2 tracking-wider">
              <Skull className="w-4 h-4 text-[#b30000]" />
              DECRETOS DEL ADMINISTRADOR
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed font-light font-skull-body">
              Como adepto con acceso a las escrituras contables, puedes monitorizar el volumen de ventas y los pactos comerciales concretados. Mantén tus credenciales seguras. El abismo vigila cada transacción.
            </p>
          </div>
        </section>

      </div>

    </div>
  );
};

export default Dashboard;
