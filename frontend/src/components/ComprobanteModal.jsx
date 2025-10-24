import React from 'react';

const ComprobanteModal = ({ comprobanteUrl, onClose }) => {
  if (!comprobanteUrl) return null;

  const normalizedUrl = comprobanteUrl.replace(/\\/g, '/'); // Reemplazar barras invertidas con barras inclinadas
  const finalUrl = `/${normalizedUrl}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-2xl max-w-3xl w-full animate-fade-in-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl z-10"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
        <div className="p-8 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold text-white mb-4">Comprobante de Pago</h2>
          {normalizedUrl.endsWith('.pdf') ? (
            <iframe src={finalUrl} className="w-full h-[70vh] border-0 rounded-lg"></iframe>
          ) : (
            <img src={finalUrl} alt="Comprobante de Pago" className="max-w-full h-auto rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprobanteModal;
