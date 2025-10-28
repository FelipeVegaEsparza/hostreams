import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const AdminStatusPanel = ({ ticket, onStatusChange }) => {
  const [newStatus, setNewStatus] = useState(ticket.estado);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      await axios.put(import.meta.env.VITE_API_BASE_URL + `api/tickets/admin/${ticket.id}/status`, { estado: newStatus }, config);
      onStatusChange(newStatus);
      toast.success('Estado del ticket actualizado.');
    } catch (err) {
      toast.error('Error al actualizar el estado.');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-bold text-yellow-300 mb-2">Panel de Administrador</h3>
      <div className="flex items-center space-x-4">
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white">
          <option value="Abierto">Abierto</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Cerrado">Cerrado</option>
        </select>
        <button onClick={handleStatusSave} disabled={isSaving || newStatus === ticket.estado} className="bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50">
          {isSaving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faFloppyDisk} />}
        </button>
      </div>
    </div>
  );
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.user?.rol === 'admin');

      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + `api/tickets/${id}`, config);
      setTicket(res.data);
    } catch (err) {
      toast.error('Error al cargar el ticket.');
      navigate('/soporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsReplying(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      await axios.post(import.meta.env.VITE_API_BASE_URL + `api/tickets/${id}/reply`, { mensaje: newMessage }, config);
      setNewMessage('');
      fetchTicket();
    } catch (err) {
      toast.error('Error al enviar la respuesta.');
    }
    setIsReplying(false);
  };

  const handleStatusChange = (newStatus) => {
    setTicket(prevTicket => ({ ...prevTicket, estado: newStatus }));
  };

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-[calc(100vh-128px)] flex justify-center items-center">Cargando ticket...</div>;
  }

  if (!ticket) {
    return <div className="bg-gray-900 text-white min-h-[calc(100vh-128px)] flex justify-center items-center">Ticket no encontrado.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-128px)] py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card rounded-2xl p-8">
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-white">{ticket.asunto}</h1>
            <p className="text-gray-400">Ticket #{ticket.id} - Estado: {ticket.estado}</p>
            <p className="text-sm text-gray-400">Cliente: {ticket.User.nombre} ({ticket.User.email})</p>
          </div>

          {isAdmin && <AdminStatusPanel ticket={ticket} onStatusChange={handleStatusChange} />}

          <div className="space-y-6 h-[50vh] overflow-y-auto pr-4 mt-6">
            {ticket.TicketMensajes.map(msg => (
              <div key={msg.id} className={`flex ${msg.User.rol === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-lg p-4 rounded-2xl ${msg.User.rol === 'admin' ? 'bg-gray-700' : 'bg-blue-600'}`}>
                  <p className="text-sm font-bold mb-1">{msg.User.nombre}</p>
                  <p>{msg.mensaje}</p>
                  <p className="text-xs text-gray-300 mt-2 text-right">{new Date(msg.fecha_envio).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <form onSubmit={handleReply}>
              <textarea
                rows="4"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none"
                required
              ></textarea>
              <div className="text-right mt-4">
                <button type="submit" disabled={isReplying} className="bg-blue-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
                  {isReplying ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <><FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Enviar Respuesta</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;