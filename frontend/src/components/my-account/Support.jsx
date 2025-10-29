import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const Support = () => {
  return (
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
  );
};

export default Support;
