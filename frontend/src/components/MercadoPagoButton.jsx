import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { toast } from 'react-toastify';

const MercadoPagoButton = ({ planId, amount, email, subject }) => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    // Inicializa MercadoPago con tu clave pública
    // Asegúrate de que VITE_MERCADOPAGO_PUBLIC_KEY esté definida en tu .env.local o .env
    if (import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY) {
      initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
    } else {
      console.error("VITE_MERCADOPAGO_PUBLIC_KEY no está definida.");
      toast.error("Error de configuración: Clave pública de MercadoPago no encontrada.");
    }
  }, []);

  const createPreference = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/mercadopago/create-preference', {
        planId,
        amount,
        email,
        subject,
      });
      return response.data.id;
    } catch (error) {
      console.error('Error al crear preferencia de MercadoPago:', error);
      toast.error('Error al iniciar el pago con MercadoPago.');
      return null;
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
      // Redirigir al usuario a la URL de inicio de pago de MercadoPago
      // La URL de inicio de pago se obtiene de la respuesta del backend (init_point)
      // En este ejemplo, el backend ya devuelve init_point, así que lo usamos directamente
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/mercadopago/create-preference', {
        planId,
        amount,
        email,
        subject,
      });
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      }
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
    >
      Pagar con MercadoPago
    </button>
  );
};

export default MercadoPagoButton;
