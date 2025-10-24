import React from 'react';
import PaymentSelection from '../pages/PaymentSelection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SubscriptionModal = ({ plan, onClose }) => {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-2xl max-w-4xl w-full animate-fade-in-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-10"
          aria-label="Cerrar modal"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="p-8 overflow-y-auto max-h-[90vh]"> {/* Added overflow-y-auto and max-h-[90vh] */}
          <PaymentSelection plan={plan} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
