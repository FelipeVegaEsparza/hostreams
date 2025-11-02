import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const PaymentCancel = () => {
  return (
    <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-2xl w-full text-center transform transition-all duration-500 ease-in-out animate-fade-in">
        <div className="relative">
          <FaTimesCircle className="text-red-500 text-7xl mx-auto animate-bounce-in" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-100 rounded-full -z-10 animate-ping-once-red"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-6 mb-3">
          Tu pago ha sido rechazado
        </h1>
        <p className="text-gray-700 text-xl mb-6">
          La pasarela de pagos ha declinado la transacción. No se ha realizado ningún cargo a tu cuenta.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg text-left flex items-center">
          <FaExclamationTriangle className="text-2xl mr-4" />
          <div>
            <p className="font-semibold">¿Qué puedes hacer?</p>
            <p className="mt-1">
              Te recomendamos volver a la página de planes e intentar el proceso de pago nuevamente. Si el problema persiste, por favor, contacta a nuestro equipo de soporte.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/plans" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Ver Planes
          </Link>
          <Link to="/soporte" className="inline-block bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105">
            Contactar a Soporte
          </Link>
        </div>
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
        @keyframes ping-once-red {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping-once-red {
          animation: ping-once-red 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentCancel;
