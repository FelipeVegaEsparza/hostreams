import React from 'react';

const Payments = ({ payments }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'aprobado':
        return 'text-green-400';
      case 'rechazado':
        return 'text-red-400';
      case 'pendiente':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Historial de Pagos</h2>
      {payments && payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{Math.floor(payment.monto)} {payment.moneda} <span className="text-sm text-gray-400">- {payment.metodo}</span></p>
                <p className="text-sm text-gray-400">{new Date(payment.fecha_pago).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getStatusClass(payment.estado)}`}>{payment.estado}</p>
                {payment.comprobante && <a href={`${import.meta.env.VITE_API_BASE_URL}uploads/${payment.comprobante.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Ver Comprobante</a>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No has realizado pagos.</p>
      )}
    </div>
  );
};

export default Payments;
