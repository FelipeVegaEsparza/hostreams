import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManualPaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtener todos los datos pasados desde PaymentSelection
  const { plan, preferredCurrency: initialPreferredCurrency, nombreProyecto: initialNombreProyecto, subscriptionToRenew } = location.state || {};

  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState(initialPreferredCurrency || 'CLP'); // Usar la moneda preferida pasada
  const [comprobante, setComprobante] = useState(null);
  const [nombreProyecto, setNombreProyecto] = useState(initialNombreProyecto || ''); // Pre-llenar nombreProyecto
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      // Usar la moneda preferida pasada o la del plan para calcular el monto
      const amountToSet = (initialPreferredCurrency || plan.moneda_preferida) === 'CLP' ? plan.precio_clp : plan.precio_usd;
      setMonto(amountToSet);
      setMoneda(initialPreferredCurrency || plan.moneda_preferida);
    } else {
      toast.info('Selecciona un plan antes de registrar un pago manual.');
      navigate('/plans');
    }
  }, [plan, navigate, initialPreferredCurrency]); // Añadir initialPreferredCurrency a las dependencias

  const handleFileChange = (e) => {
    setComprobante(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!comprobante) {
      toast.error('Por favor, sube el comprobante de pago.');
      setLoading(false);
      return;
    }

    if (!nombreProyecto.trim()) { // Validar que el nombre del proyecto no esté vacío
      toast.error('Por favor, ingresa el nombre de tu proyecto (Radio/TV).');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('planId', plan.id);
    formData.append('monto', monto);
    formData.append('moneda', moneda);
    formData.append('comprobante', comprobante);
    formData.append('nombre_proyecto', nombreProyecto); // Añadir nombre_proyecto

    const token = localStorage.getItem('token');
    if (!token) {
      toast.warn('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/manual-payment/create', formData, config);
      toast.success(res.data.msg);
      navigate('/my-account');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al registrar el pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-4">Pago por Transferencia</h1>
          <p className="text-center text-gray-300 mb-6">Sube tu comprobante para confirmar la suscripción al plan <span className="font-bold text-blue-400">{plan?.nombre}</span>.</p>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6 text-center">
            <p className="text-gray-400">Monto a pagar</p>
            <p className="text-3xl font-bold text-white">{monto} <span className="text-xl">{moneda}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="nombreProyecto">
                Nombre de tu Proyecto (Radio/TV)
              </label>
              <input
                type="text"
                id="nombreProyecto"
                name="nombreProyecto"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                placeholder="Ej: Mi Radio Online, TV Stream HD"
                required
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="comprobante">
                Adjuntar Comprobante
              </label>
              <input
                type="file"
                id="comprobante"
                name="comprobante"
                onChange={handleFileChange}
                required
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-300"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Confirmar Pago'}
            </button>
          </form>          <p className="text-center text-gray-400 text-sm mt-6">
            ¿Necesitas ayuda? <Link to="/contact" className="text-blue-400 hover:underline">Contáctanos</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentForm;
