import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/admin/subscriptions`, config); // Asumiendo esta ruta en el backend
        setSubscriptions(response.data);
      } catch (error) {
        toast.error('Error al cargar suscripciones.');
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  if (loading) {
    return <div className="text-center text-white">Cargando suscripciones...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Suscripciones</h1>
        {subscriptions.length === 0 ? (
          <p>No hay suscripciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Usuario ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Plan ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Método Pago</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Monto</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Moneda</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Fecha Inicio</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Fecha Renovación</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Proyecto</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-sm">{sub.id}</td>
                    <td className="py-3 px-4 text-sm">{sub.usuario_id}</td>
                    <td className="py-3 px-4 text-sm">{sub.plan_id}</td>
                    <td className="py-3 px-4 text-sm">{sub.metodo_pago}</td>
                    <td className="py-3 px-4 text-sm">{sub.monto}</td>
                    <td className="py-3 px-4 text-sm">{sub.moneda}</td>
                    <td className="py-3 px-4 text-sm">{sub.estado}</td>
                    <td className="py-3 px-4 text-sm">{new Date(sub.fecha_inicio).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{new Date(sub.fecha_renovacion).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{sub.nombre_proyecto || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm flex space-x-2">
                      <button 
                        // onClick={() => handleEdit(sub)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Editar
                      </button>
                      <button 
                        // onClick={() => handleDelete(sub.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
