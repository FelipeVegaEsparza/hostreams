import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.user && decodedToken.user.rol === 'admin') {
        isAdmin = true;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      localStorage.removeItem('token'); // Eliminar token inválido
    }
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
