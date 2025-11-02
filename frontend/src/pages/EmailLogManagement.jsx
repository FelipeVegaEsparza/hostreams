import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailLogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailLogs = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/admin/email-logs');
        setLogs(response.data);
      } catch (error) {
        toast.error('Error al cargar los registros de correos.');
        console.error('Error fetching email logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailLogs();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Cargando registros...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] p-4 sm:p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Registro de Correos Enviados</h1>
        {logs.length === 0 ? (
          <p className="text-center py-8">No hay registros de correos enviados.</p>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-gray-800">
              <thead className="bg-gray-700">
                <tr>
                  {['ID', 'Destinatario', 'Asunto', 'Estado', 'Error', 'Fecha'].map(head => <th key={head} className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">{head}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{log.id}</td>
                    <td className="py-3 px-4 text-sm">{log.recipient}</td>
                    <td className="py-3 px-4 text-sm">{log.subject}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.status === 'sent' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-red-400">{log.error_message || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">{new Date(log.sent_at).toLocaleString()}</td>
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

export default EmailLogManagement;
