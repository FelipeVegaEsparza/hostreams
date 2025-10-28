import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// Configurar un interceptor de axios para adjuntar el token a todas las solicitudes
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Fetching user from URL:', import.meta.env.VITE_API_BASE_URL + 'api/auth/me');
          const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/auth/me'); // Obtener datos del usuario real
          setUser(response.data);
        } catch (error) {
          console.error('Error loading user:', error);
          console.error('Error details:', error.message, error.response?.data, error.config);
          setToken(null);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('Login URL:', import.meta.env.VITE_API_BASE_URL + 'api/auth/login');
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/auth/login', { email, password });
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // Usar el usuario real del backend
      toast.success('Inicio de sesión exitoso!');
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.message || 'Error al iniciar sesión.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Register URL:', import.meta.env.VITE_API_BASE_URL + 'api/auth/register');
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/auth/register', userData);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user); // Usar el usuario real del backend
      toast.success('Registro exitoso!');
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error(error.response?.data?.message || 'Error al registrar usuario.');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    toast.info('Sesión cerrada.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
