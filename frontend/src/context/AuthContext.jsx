import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// Mantener el interceptor para adjuntar el token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        try {
          // Este efecto solo carga al usuario si hay un token en el storage
          // pero no hay un objeto de usuario en el estado (ej. en un refresh de página)
          const { data } = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/auth/me');
          setUser(data);
        } catch (error) {
          // Si el token es inválido, lo limpiamos
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          console.error('Fallo al cargar usuario desde token:', error);
        }
      }
      // Terminamos de cargar, incluso si no había token
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]); // Se ejecuta solo cuando el token cambia (login/logout)

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/auth/login', { email, password });
      // La respuesta del backend ahora incluye el usuario, lo usamos directamente
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success('Inicio de sesión exitoso!');
      return true;
    } catch (error) {
      console.error('Error durante el login:', error);
      toast.error(error.response?.data?.msg || 'Error al iniciar sesión.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/auth/register', userData);
      // La respuesta del backend ahora incluye el usuario
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success('Registro exitoso!');
      return true;
    } catch (error) {
      console.error('Error durante el registro:', error);
      toast.error(error.response?.data?.message || 'Error al registrar usuario.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.info('Sesión cerrada.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);