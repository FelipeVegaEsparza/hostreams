import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/tickets/admin/all', config);
        setTickets(res.data);
      } catch (err) {
        toast.error('Error al cargar los tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllTickets();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Abierto': return 'bg-green-500/20 text-green-300';
      case 'En Progreso': return 'bg-yellow-500/20 text-yellow-300';
      case 'Cerrado': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-12">Gestión de Tickets de Soporte</h1>
        <div className="glass-card rounded-2xl p-8">
          {loading ? (
            <p>Cargando tickets...</p>
          ) : tickets.length === 0 ? (
            <p>No hay tickets de soporte.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="p-4">Asunto</th>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Fecha Creación</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 font-medium text-white">{ticket.asunto}</td>
                      <td className="p-4 text-gray-300">{ticket.User?.nombre || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(ticket.estado)}`}>
                          {ticket.estado}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{new Date(ticket.fecha_creacion).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <Link to={`/soporte/${ticket.id}`} className="bg-blue-600/30 text-blue-300 py-1 px-3 rounded-md text-xs hover:bg-blue-600/50 transition-colors">
                          Ver / Responder
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;
