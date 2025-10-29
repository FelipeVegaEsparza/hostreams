import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Importar useLocation

const PaymentSelection = ({ plan: propPlan }) => { // Eliminar onClose
  const { user, login, register, loading: authLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Usar useLocation
  const { subscriptionToRenew } = location.state || {}; // Obtener subscriptionToRenew del estado de la navegación

  // Determinar el plan actual: si es una renovación, usar el plan de la suscripción a renovar
  const currentPlan = subscriptionToRenew ? subscriptionToRenew.Plan : propPlan;
  const [preferredCurrency, setPreferredCurrency] = useState(currentPlan?.moneda_preferida || 'CLP');


  useEffect(() => {
    if (currentPlan?.moneda_preferida) {
      setPreferredCurrency(currentPlan.moneda_preferida);
    }
    if (subscriptionToRenew) {
      // Si es una renovación, pre-llenar el nombre del proyecto
      setNombreProyecto(subscriptionToRenew.nombre_proyecto || '');
      // También podríamos pre-seleccionar el monto y la moneda del plan de la suscripción a renovar
      // setMonto(currentPlan.moneda_preferida === 'CLP' ? currentPlan.precio_clp : currentPlan.precio_usd);
      // setPreferredCurrency(currentPlan.moneda_preferida);
    }
  }, [currentPlan, subscriptionToRenew]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      const success = await register({ nombre: name, email, contrasena: password, pais: country, moneda_preferida: preferredCurrency });
      if (success) {
        toast.success('Registro exitoso. Procediendo al pago.');
      }
    } else {
      const success = await login(email, password);
      if (success) {
        toast.success('Inicio de sesión exitoso. Procediendo al pago.');
      }
    }
  };

  const handlePaymentSubmit = async () => {
    if (!subscriptionToRenew && !nombreProyecto.trim()) { // Validar solo si es nueva suscripción
      toast.error('Por favor, ingresa el nombre de tu proyecto (Radio/TV).');
      return;
    }
    if (!paymentMethod) {
      toast.error('Por favor, selecciona un método de pago.');
      return;
    }
    setPaymentLoading(true);

    if (paymentMethod === 'manual') {
      navigate('/manual-payment', { state: { plan: currentPlan, preferredCurrency, nombreProyecto, subscriptionToRenew } });
      return;
    } else if (paymentMethod === 'flow') {
      try {
        const flowPayload = {
          planId: currentPlan.id,
          amount: preferredCurrency === 'CLP' ? currentPlan.precio_clp : currentPlan.precio_usd,
          email: user.email, // User's email from AuthContext
          subject: `Pago de suscripción Hostreams - Plan ${currentPlan.nombre}`,
          nombre_proyecto: nombreProyecto,
          currency: preferredCurrency,
        };

        console.log('Flow.cl payment payload to backend:', flowPayload);

        const flowResponse = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/flow/create-payment', flowPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Flow.cl create-payment response:', flowResponse.data);

        if (flowResponse.data && flowResponse.data.url) {
          window.location.href = flowResponse.data.url; // Redirect to Flow payment page
        } else {
          toast.error('Error al iniciar el pago con Flow.cl: URL de pago no recibida.');
        }
      } catch (error) {
        console.error('Error al iniciar el pago con Flow.cl:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Error al iniciar el pago con Flow.cl.');
      } finally {
        setPaymentLoading(false);
      }
      return;
    }

    try {
      const payload = {
        planId: currentPlan.id,
        paymentMethod,
        amount: preferredCurrency === 'CLP' ? currentPlan.precio_clp : currentPlan.precio_usd,
        currency: preferredCurrency,
        nombre_proyecto: nombreProyecto,
      };

      if (subscriptionToRenew) {
        payload.subscriptionToRenewId = subscriptionToRenew.id;
      }

      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/admin/subscriptions', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(response.data.message || 'Suscripción creada/renovada exitosamente!');
      // onClose(); // This might be called after successful subscription creation, depending on flow
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago o crear/renovar la suscripción.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center text-white">Cargando usuario...</div>;
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Confirmar Suscripción</h2>

      {currentPlan && (
        <div className="mb-6 p-4 bg-gray-700 rounded-md">
          <h3 className="text-2xl font-semibold mb-2">Plan: {currentPlan.nombre}</h3>
          <p className="text-gray-300 mb-1">{currentPlan.descripcion}</p>
          <p className="text-xl font-bold">
            Precio: {preferredCurrency === 'CLP' ? `$${Math.floor(currentPlan.precio_clp)}` : `\$${Math.floor(currentPlan.precio_usd)}`} {preferredCurrency} / {currentPlan.periodo}
          </p>
        </div>
      )}

      {!user ? (
        <div className="bg-gray-700 p-6 rounded-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">{isRegistering ? 'Regístrate' : 'Inicia Sesión'} para Continuar</h3>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegistering && (
              <input
                type="text"
                placeholder="Nombre Completo"
                className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegistering && (
              <input
                type="text"
                placeholder="País"
                className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            )}
            {isRegistering && (
              <select
                className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                required
              >
                <option value="CLP">CLP - Peso Chileno</option>
                <option value="USD">USD - Dólar Estadounidense</option>
              </select>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors duration-300"
            >
              {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-300">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-400 hover:underline ml-1"
            >
              {isRegistering ? 'Inicia Sesión' : 'Regístrate aquí'}
            </button>
          </p>
        </div>
      ) : (
        <div className="bg-gray-700 p-6 rounded-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">Hola, {user.name || user.email}!</h3>
          <p className="text-center text-gray-300 mb-6">Selecciona tu método de pago para el plan {currentPlan?.nombre}.</p>

          <div className="mb-6">
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
              required={!subscriptionToRenew} // Solo requerido si no es una renovación
              className="w-full p-3 rounded bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center bg-gray-900 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-3 text-lg">PayPal</span>
            </label>

            <label className="flex items-center bg-gray-900 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="flow"
                checked={paymentMethod === 'flow'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-3 text-lg">Flow.cl</span>
            </label>
            <label className="flex items-center bg-gray-900 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="manual"
                checked={paymentMethod === 'manual'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-3 text-lg">Transferencia Electrónica Manual</span>
            </label>
          </div>

          {paymentMethod !== 'mercadopago' && (
            <button
              onClick={handlePaymentSubmit}
              disabled={paymentLoading || !paymentMethod}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded mt-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? 'Procesando...' : 'Pagar y Suscribirme'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSelection;