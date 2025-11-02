import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const planName = sessionStorage.getItem('selectedPlanName');

    if (planName) {
      // Usamos el nombre del plan guardado para mostrarlo en la UI
      setPaymentDetails({ subject: planName });
      // Limpiamos el sessionStorage para que no se reutilice
      sessionStorage.removeItem('selectedPlanName');
      setError(null);
    } else {
      // Opcional: manejar el caso donde alguien navega a la página directamente
      // Por ahora, simplemente mostramos el mensaje sin el nombre del plan.
      setPaymentDetails({ subject: 'tu nuevo plan' }); 
    }

    setLoading(false);
  }, []);

  const SkeletonLoader = () => (
    <div className="animate-pulse text-center">
      <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
      <div className="h-4 bg-gray-300 rounded w-full mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto mt-2"></div>
    </div>
  );

  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-2xl w-full text-center transform transition-all duration-500 ease-in-out animate-fade-in">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <>
            <FaCheckCircle className="text-red-500 text-6xl mx-auto mb-6 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Error en el Pago</h1>
            <p className="text-gray-600 text-lg">{error}</p>
          </>
        ) : (
          <>
            <div className="relative">
              <FaCheckCircle className="text-green-500 text-7xl mx-auto animate-bounce-in" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rounded-full -z-10 animate-ping-once"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-6 mb-3">
              ¡Gracias por tu compra, {user?.nombre || 'cliente'}!
            </h1>
            <p className="text-gray-700 text-xl mb-6">
              Hemos recibido la confirmación para tu plan: <span className="font-semibold text-blue-600">{paymentDetails?.subject || ''}</span>.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg text-left">
              <p className="font-semibold">Próximos Pasos</p>
              <p className="mt-1">
                Nuestro equipo de activación se pondrá en contacto contigo dentro de las próximas <span className="font-bold">24 horas</span> utilizando los datos que proporcionaste para finalizar la configuración de tu servicio.
              </p>
            </div>
            <Link to="/my-account" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              Ir a Mi Cuenta
            </Link>
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        @keyframes ping-once {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
