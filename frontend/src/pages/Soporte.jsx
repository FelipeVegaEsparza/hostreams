import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

const TicketRow = ({ ticket }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Abierto': return 'bg-green-500/20 text-green-300';
      case 'En Progreso': return 'bg-yellow-500/20 text-yellow-300';
      case 'Cerrado': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const lastReplierIsAdmin = ticket.lastReplier?.rol === 'admin';

  return (
    <Link to={`/soporte/${ticket.id}`} className="block border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 items-center">
        <div className="col-span-2">
          <p className="font-bold text-white">{ticket.asunto}</p>
          <p className="text-sm text-gray-400">Ticket #{ticket.id}</p>
        </div>
        <div className="text-left md:text-center">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(ticket.estado)}`}>
            {ticket.estado}
          </span>
        </div>
        <div className="text-left md:text-right">
          {ticket.lastReplier && (
            <p className={`text-sm font-bold ${lastReplierIsAdmin ? 'text-blue-400' : 'text-gray-300'}`}>
              Última respuesta: {lastReplierIsAdmin ? 'Soporte' : 'Tú'}
            </p>
          )}
          <p className="text-xs text-gray-500">{new Date(ticket.fecha_creacion).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  );
};

const NewTicketModal = ({ onClose, onTicketCreated }) => {
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      const body = { asunto, mensaje };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/tickets`, body, config);
      toast.success('Ticket creado exitosamente.');
      onTicketCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al crear el ticket.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-2xl animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6">Nuevo Ticket de Soporte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Asunto</label>
            <input type="text" value={asunto} onChange={(e) => setAsunto(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Mensaje</label>
            <textarea rows="5" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white resize-none"></textarea>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-gray-700">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Soporte = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warn('Debes iniciar sesión para ver tus tickets.');
        navigate('/login');
        return;
      }
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/tickets`, config);
      setTickets(res.data);
    } catch (err) {
      toast.error('Error al cargar los tickets.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-128px)] py-20 px-4">
      {isModalOpen && <NewTicketModal onClose={() => setIsModalOpen(false)} onTicketCreated={fetchTickets} />}
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Mis Tickets de Soporte</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Ticket
          </button>
        </div>

        <div className="glass-card rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-gray-700 text-sm font-bold text-gray-400">
            <div className="col-span-2">Asunto</div>
            <div className="text-left md:text-center">Estado</div>
            <div className="text-left md:text-right">Última Actividad</div>
          </div>
          {loading ? (
            <div className="p-8 text-center">Cargando tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No has creado ningún ticket de soporte todavía.</div>
          ) : (
            <div>
              {tickets.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Soporte;