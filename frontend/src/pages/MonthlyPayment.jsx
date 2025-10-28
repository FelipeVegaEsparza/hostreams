import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MonthlyPayment = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token, loading: authLoading } = useAuth(); // Obtener loading del AuthContext

  useEffect(() => {
    const fetchUserData = async () => {
      // Solo intentar cargar datos si no estamos en proceso de autenticación y no hay token
      if (!authLoading && !token) {
        toast.warn('Debes iniciar sesión para ver tus pagos mensuales.');
        navigate('/login');
        return;
      }
      // Si authLoading es true, esperamos. Si hay token, procedemos.
      if (authLoading) return;

      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/auth/me`, config);
        setUserData(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          navigate('/login');
        } else {
          toast.error('Error al cargar los datos de tu cuenta.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate, authLoading]); // Añadir authLoading a las dependencias

  const isSubscriptionDueOrOverdue = (renewalDate) => {
    if (!renewalDate) return false;
    const today = new Date();
    const renew = new Date(renewalDate);
    const diffTime = renew.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Considerar vencida si faltan 0 días o menos (ya pasó la fecha)
    return diffDays <= 0;
  };

  const handleGeneratePayment = (subscription) => {
    // Redirigir a PaymentSelection, pasando la suscripción a renovar
    navigate('/payment-selection', { state: { subscriptionToRenew: subscription } });
  };

  if (loading || authLoading) { // Mostrar cargando si la página o la autenticación están cargando
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-blue-400">Cargando tus suscripciones...</p>
      </div>
    );
  }

  if (!userData || !userData.Subscriptions) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center text-center p-4">
        <div>
          <p className="text-xl text-red-400 mb-4">No se pudieron cargar tus suscripciones.</p>
          <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline">Volver a iniciar sesión</button>
        </div>
      </div>
    );
  }

  const activeSubscriptions = userData.Subscriptions.filter(sub => sub.estado === 'activa' || sub.estado === 'pendiente');

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Mis Pagos Mensuales</h1>
        
        {activeSubscriptions.length > 0 ? (
          <div className="space-y-6">
            {activeSubscriptions.map((sub) => {
              const isOverdue = isSubscriptionDueOrOverdue(sub.fecha_renovacion);
              const buttonText = isOverdue ? 'Generar Pago Atrasado' : 'Pagar Mensualidad';
              const buttonClass = isOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

              return (
                <div key={sub.id} className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0 md:w-2/3">
                    <h2 className="text-2xl font-bold text-white">Plan: {sub.Plan ? sub.Plan.nombre : 'N/A'}</h2>
                    {sub.nombre_proyecto && <p className="text-gray-300">Proyecto: {sub.nombre_proyecto}</p>}
                    <p className="text-gray-300">Monto: {Math.floor(sub.monto)} {sub.moneda}</p>
                    <p className="text-gray-300">Estado: <span className="font-semibold">{sub.estado}</span></p>
                    <p className="text-gray-300">Fecha de Renovación: <span className="font-semibold">{sub.fecha_renovacion ? new Date(sub.fecha_renovacion).toLocaleDateString() : 'N/A'}</span></p>
                  </div>
                  <div className="md:w-1/3 text-right">
                    <button
                      onClick={() => handleGeneratePayment(sub)}
                      className={`${buttonClass} text-white py-2 px-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300`}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-xl text-gray-400">No tienes suscripciones activas o pendientes de pago.</p>
            <Link to="/plans" className="text-blue-400 hover:underline mt-4 block">Explorar Planes</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyPayment;
