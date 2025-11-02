import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserInfo from '../components/my-account/UserInfo';
import Subscriptions from '../components/my-account/Subscriptions';
import Payments from '../components/my-account/Payments';
import Support from '../components/my-account/Support';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warn('Debes iniciar sesión para ver tu cuenta.');
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/auth/me', config);
        setUserData(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          navigate('/login');
        } else {
          toast.error('Error al cargar los datos de tu cuenta.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-blue-400">Cargando tu cuenta...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center text-center p-4">
        <div>
          <p className="text-xl text-red-400 mb-4">No se pudieron cargar los datos de la cuenta.</p>
          <Link to="/login" className="text-blue-400 hover:underline">Volver a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-10 sm:py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-white">Mi Cuenta</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UserInfo userData={userData} />
            <Subscriptions subscriptions={userData.Subscriptions} />
          </div>

          <Support />
        </div>

        <Payments payments={userData.Payments} />
      </div>
    </div>
  );
};

export default MyAccount;                        