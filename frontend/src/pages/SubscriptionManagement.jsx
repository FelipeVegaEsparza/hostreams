import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Componente para el Modal de Edición
const EditSubscriptionModal = ({ subscription, onClose, onSave }) => {
  const [status, setStatus] = useState(subscription.estado);

  const handleSave = () => {
    onSave(subscription.id, status);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Suscripción #{subscription.id}</h2>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="activa">Activa</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/admin/subscriptions');
        setSubscriptions(response.data);
      } catch (error) {
        toast.error('Error al cargar suscripciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}api/admin/subscriptions/${id}/status`, { estado: newStatus });
      setSubscriptions(subscriptions.map(sub => (sub.id === id ? response.data : sub)));
      toast.success(`Suscripción #${id} actualizada.`);
      setEditingSubscription(null);
    } catch (error) {
      toast.error('Error al actualizar la suscripción.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Seguro que quieres eliminar la suscripción #${id}?`)) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}api/admin/subscriptions/${id}`);
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        toast.success(`Suscripción #${id} eliminada.`);
      } catch (error) {
        toast.error('Error al eliminar la suscripción.');
      }
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const statusMatch = statusFilter === 'all' || sub.estado === statusFilter;
      const paymentMethodMatch = paymentMethodFilter === 'all' || sub.metodo_pago === paymentMethodFilter;
      return statusMatch && paymentMethodMatch;
    });
  }, [subscriptions, statusFilter, paymentMethodFilter]);

  if (loading) {
    return <div className="text-center p-8">Cargando suscripciones...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] p-4 sm:p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Suscripciones</h1>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 p-4 bg-gray-800 rounded-lg">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-300 mb-1">Filtrar por Estado</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500">
              <option value="all">Todos</option>
              <option value="activa">Activa</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethodFilter" className="block text-sm font-medium text-gray-300 mb-1">Filtrar por Método de Pago</label>
            <select id="paymentMethodFilter" value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className="w-full sm:w-auto p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500">
              <option value="all">Todos</option>
              <option value="Flow">Flow</option>
              <option value="Paypal">Paypal</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>

        {filteredSubscriptions.length === 0 ? (
          <p className="text-center py-8">No hay suscripciones que coincidan con los filtros seleccionados.</p>
        ) : (
          <div className="shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full bg-gray-800 hidden md:table">
              <thead className="bg-gray-700">
                <tr>
                  {['ID', 'Usuario', 'Plan', 'Método Pago', 'Monto', 'Estado', 'Inicio', 'Renovación', 'Acciones'].map(head => <th key={head} className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">{head}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{sub.id}</td>
                    <td className="py-3 px-4 text-sm">{sub.User?.nombre || 'N/A'} ({sub.User?.email})</td>
                    <td className="py-3 px-4 text-sm">{sub.Plan?.nombre || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold`}>{sub.metodo_pago}</span></td>
                    <td className="py-3 px-4 text-sm">{sub.moneda} {sub.monto}</td>
                    <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.estado === 'activa' ? 'bg-green-500' : sub.estado === 'cancelada' ? 'bg-red-500' : 'bg-yellow-500'}`}>{sub.estado}</span></td>
                    <td className="py-3 px-4 text-sm">{new Date(sub.fecha_inicio).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{new Date(sub.fecha_renovacion).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm flex items-center space-x-2">
                      <button onClick={() => setEditingSubscription(sub)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">Editar</button>
                      <button onClick={() => handleDelete(sub.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden space-y-4">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">{sub.User?.nombre || 'N/A'}</div>
                    <div className="text-sm font-mono text-gray-400">ID: {sub.id}</div>
                  </div>
                  <div className="text-sm"><strong className="text-gray-400">Plan:</strong> {sub.Plan?.nombre || 'N/A'}</div>
                  <div className="text-sm"><strong className="text-gray-400">Monto:</strong> {sub.moneda} {sub.monto}</div>
                  <div className="text-sm"><strong className="text-gray-400">Renovación:</strong> {new Date(sub.fecha_renovacion).toLocaleDateString()}</div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sub.estado === 'activa' ? 'bg-green-500' : sub.estado === 'cancelada' ? 'bg-red-500' : 'bg-yellow-500'}`}>{sub.estado}</span>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditingSubscription(sub)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">Editar</button>
                      <button onClick={() => handleDelete(sub.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {editingSubscription && <EditSubscriptionModal subscription={editingSubscription} onClose={() => setEditingSubscription(null)} onSave={handleUpdateStatus} />}
    </div>
  );
};

export default SubscriptionManagement;
