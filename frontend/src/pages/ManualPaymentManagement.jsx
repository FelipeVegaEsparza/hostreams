import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ComprobanteModal from '../components/ComprobanteModal'; // Importar ComprobanteModal

const ManualPaymentManagement = () => {
  const [manualPayments, setManualPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [isComprobanteModalOpen, setIsComprobanteModalOpen] = useState(false);
  const [currentComprobanteUrl, setCurrentComprobanteUrl] = useState('');

  const fetchManualPayments = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/manual-payment', config); // Cambiar a /api/manual-payment
      setManualPayments(response.data);
    } catch (error) {
      toast.error('Error al cargar pagos manuales.');
      console.error('Error fetching manual payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchManualPayments();
    }
  }, [token]);

  const handleApprove = async (paymentId) => {
    if (window.confirm('¿Estás seguro de que quieres aprobar este pago?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const url = `/api/manual-payment/approve/${paymentId}`;
        console.log('handleApprove: Enviando PUT a URL:', url);
        await axios.put(import.meta.env.VITE_API_BASE_URL + `api/manual-payment/${id}/status`, { estado: 'aprobado' }, config);
        toast.success('Pago aprobado exitosamente!');
        fetchManualPayments();
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Error al aprobar pago.');
        console.error('Error approving payment:', error);
      }
    }
  };

  const handleReject = async (paymentId) => {
    if (window.confirm('¿Estás seguro de que quieres rechazar este pago?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const url = `/api/manual-payment/approve/${paymentId}`;
        console.log('handleReject: Enviando PUT a URL:', url);
        await axios.put(import.meta.env.VITE_API_BASE_URL + `api/manual-payment/${id}/status`, { estado: 'rechazado' }, config);
        toast.success('Pago rechazado exitosamente!');
        fetchManualPayments();
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Error al rechazar pago.');
        console.error('Error rejecting payment:', error);
      }
    }
  };

  const openComprobanteModal = (url) => {
    setCurrentComprobanteUrl(url);
    setIsComprobanteModalOpen(true);
  };

  const closeComprobanteModal = () => {
    setIsComprobanteModalOpen(false);
    setCurrentComprobanteUrl('');
  };

  if (loading) {
    return <div className="text-center text-white">Cargando pagos manuales...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Pagos Manuales</h1>
        {manualPayments.length === 0 ? (
          <p>No hay pagos manuales pendientes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Usuario ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Plan ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Monto</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Moneda</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Comprobante</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Fecha Pago</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {manualPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-sm">{payment.id}</td>
                    <td className="py-3 px-4 text-sm">{payment.usuario_id}</td>
                    <td className="py-3 px-4 text-sm">{payment.planId}</td>
                    <td className="py-3 px-4 text-sm">{payment.monto}</td>
                    <td className="py-3 px-4 text-sm">{payment.moneda}</td>
                    <td className="py-3 px-4 text-sm">{payment.estado}</td>
                    <td className="py-3 px-4 text-sm">
                      {payment.comprobante ? (
                        <button 
                          onClick={() => {
                            console.log('URL del comprobante a abrir:', payment.comprobante);
                            openComprobanteModal(payment.comprobante);
                          }}
                          className="text-blue-400 hover:underline focus:outline-none"
                        >
                          Ver Comprobante
                        </button>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">{new Date(payment.fecha_pago).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm flex space-x-2">
                      {payment.estado === 'pendiente' && (
                        <>
                          <button 
                            onClick={() => handleApprove(payment.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleReject(payment.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isComprobanteModalOpen && (
          <ComprobanteModal 
            comprobanteUrl={currentComprobanteUrl} 
            onClose={closeComprobanteModal} 
          />
        )}
      </div>
    </div>
  );
};

export default ManualPaymentManagement;
