import React from 'react';
import { useNavigate } from 'react-router-dom';

const Subscriptions = ({ subscriptions }) => {
  const navigate = useNavigate();

  const getStatusClass = (status) => {
    switch (status) {
      case 'activa':
        return 'text-green-400';
      case 'cancelada':
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
    return diffDays <= 7;
  };

  const handleRenewSubscription = (subscription) => {
    navigate('/monthly-payment', { state: { subscriptionToRenew: subscription } });
  };

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Suscripciones</h2>
      {subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-6">
          {subscriptions.map((sub) => (
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
  );
};

export default Subscriptions;
