import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    contrasena: '',
  });

  const { email, contrasena } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        email,
        contrasena,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(user);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Inicio de sesión exitoso.');
      navigate('/my-account');
    } catch (err) {
      console.error(err.response.data);
      toast.error(err.response.data.msg || 'Error en el inicio de sesión');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Iniciar Sesión</h1>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="contrasena">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                name="contrasena"
                value={contrasena}
                onChange={onChange}
                minLength="6"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tienes una cuenta? <Link to="/register" className="text-blue-400 hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
