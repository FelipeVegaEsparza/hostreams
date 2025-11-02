import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faFileInvoiceDollar, faTicketAlt, faBookOpen, faCogs, faHandHoldingUsd, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const adminLinks = [
    { to: '/admin/plans', label: 'Gestionar Planes', description: 'Crear, editar y eliminar planes de suscripción.', icon: faFileInvoiceDollar },
    { to: '/admin/tickets', label: 'Gestionar Tickets', description: 'Ver y responder tickets de soporte de los clientes.', icon: faTicketAlt },
    { to: '/admin/tutoriales', label: 'Gestionar Tutoriales', description: 'Administrar videos tutoriales y sus categorías.', icon: faBookOpen },
    { to: '/admin/users', label: 'Ver Usuarios', description: 'Consultar la lista de usuarios registrados.', icon: faUsers },
    { to: '/admin/subscriptions', label: 'Revisar Suscripciones', description: 'Ver el estado de todas las suscripciones.', icon: faChartBar },
    { to: '/admin/manual-payments', label: 'Confirmar Pagos Manuales', description: 'Aprobar o rechazar pagos por transferencia.', icon: faHandHoldingUsd },
    { to: '/admin/blog', label: 'Gestionar Blog', description: 'Crear, editar y eliminar entradas del blog.', icon: faBookOpen },
    { to: '/admin/email-logs', label: 'Registro de Correos', description: 'Ver un historial de todos los correos enviados.', icon: faEnvelope },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Panel de Administración</h1>
        <div className="glass-card rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminLinks.map((link, index) => (
                              <Link 
                                key={index} 
                                to={link.to} 
                                className="block glass-card rounded-2xl p-6 hover:bg-blue-900/20 hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center"
                              >
                                <FontAwesomeIcon icon={link.icon} className="w-10 h-10 text-blue-400 mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">{link.label}</h2>
                                <p className="text-gray-400 text-sm">{link.description}</p>
                              </Link>            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;