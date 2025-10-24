import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warn('Debes iniciar sesión para ver tu cuenta.');
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('/api/auth/me', config);
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
  }, [navigate]);

  const InfoRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-blue-400">Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center text-center p-4">
        <div>
          <p className="text-xl text-red-400 mb-4">No se pudieron cargar los datos de la cuenta.</p>
          <Link to="/login" className="text-blue-400 hover:underline">Volver a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'activa':
      case 'aprobado':
        return 'text-green-400';
      case 'cancelada':
      case 'rechazado':
        return 'text-red-400';
      case 'pendiente':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const isSubscriptionDueForRenewal = (renewalDate) => {
    if (!renewalDate) return false;
    const today = new Date();
    const renew = new Date(renewalDate);
    const diffTime = renew.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Mostrar botón de renovación si faltan 7 días o menos, o si ya expiró
    return diffDays <= 7;
  };

  const handleRenewSubscription = (subscription) => {
    // Redirigir a la nueva página de pagos mensuales, pasando la suscripción a renovar
    navigate('/monthly-payment', { state: { subscriptionToRenew: subscription } });
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Mi Cuenta</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Información Personal</h2>
              <dl className="divide-y divide-gray-700">
                <InfoRow label="Nombre" value={userData.nombre} />
                <InfoRow label="Email" value={userData.email} />
                <InfoRow label="País" value={userData.pais} />
                <InfoRow label="Moneda Preferida" value={userData.moneda_preferida} />
                <InfoRow label="Rol" value={userData.rol} />
                <InfoRow label="Fecha de Registro" value={new Date(userData.fecha_registro).toLocaleDateString()} />
              </dl>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Suscripciones</h2>
              {userData.Subscriptions && userData.Subscriptions.length > 0 ? (
                <div className="space-y-6">
                  {userData.Subscriptions.map((sub) => (
                    <div key={sub.id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><p className="text-sm text-gray-400">Plan</p><p className="font-semibold text-white">{sub.Plan ? sub.Plan.nombre : 'N/A'}</p></div>
                        {sub.nombre_proyecto && <div><p className="text-sm text-gray-400">Proyecto</p><p className="font-semibold text-white">{sub.nombre_proyecto}</p></div>}
                        <div><p className="text-sm text-gray-400">Monto</p><p className="font-semibold text-white">{Math.floor(sub.monto)} {sub.moneda}</p></div>
                        <div><p className="text-sm text-gray-400">Estado</p><p className={`font-bold ${getStatusClass(sub.estado)}`}>{sub.estado}</p></div>
                        <div><p className="text-sm text-gray-400">Renovación</p><p className="font-semibold text-white">{sub.fecha_renovacion ? new Date(sub.fecha_renovacion).toLocaleDateString() : 'N/A'}</p></div>
                        {sub.estado === 'activa' && isSubscriptionDueForRenewal(sub.fecha_renovacion) && (
                          <div className="col-span-2 md:col-span-4 mt-4 text-right">
                            <button
                              onClick={() => handleRenewSubscription(sub)}
                              className="bg-blue-600 text-white py-2 px-4 rounded-full font-bold text-sm shadow-lg hover:bg-blue-700 transition-all duration-300"
                            >
                              Renovar Suscripción
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No tienes suscripciones activas.</p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-8 text-center">
              <FontAwesomeIcon icon={faTicketAlt} className="text-blue-400 text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Soporte</h2>
              <p className="text-gray-400 mb-6">¿Necesitas ayuda? Crea un ticket de soporte y te ayudaremos.</p>
              <Link to="/soporte" className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
                Ir a Soporte
              </Link>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Historial de Pagos</h2>
          {userData.Payments && userData.Payments.length > 0 ? (
            <div className="space-y-4">
              {userData.Payments.map((payment) => (
                <div key={payment.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{Math.floor(payment.monto)} {payment.moneda} <span className="text-sm text-gray-400">- {payment.metodo}</span></p>
                    <p className="text-sm text-gray-400">{new Date(payment.fecha_pago).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getStatusClass(payment.estado)}`}>{payment.estado}</p>
                    {payment.comprobante && <a href={`/uploads/${payment.comprobante.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Ver Comprobante</a>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No has realizado pagos.</p>
          )}
        </div>

      </div>
    </div>
    );
  };
  
  export default MyAccount;                        