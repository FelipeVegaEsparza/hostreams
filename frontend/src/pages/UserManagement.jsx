import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log('Fetching users with token:', token);
      const response = await axios.get('/api/admin/users', config); // Asumiendo esta ruta en el backend
      console.log('Users fetched successfully:', response.data);
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`/api/admin/users/${userId}`, config);
        toast.success('Usuario eliminado exitosamente!');
        fetchUsers(); // Volver a cargar la lista de usuarios
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Error al eliminar usuario.');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUserUpdated = () => {
    fetchUsers(); // Volver a cargar la lista de usuarios después de una actualización
  };

  if (loading) {
    return <div className="text-center text-white">Cargando usuarios...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
        {users.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Rol</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">País</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Moneda Preferida</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Fecha Registro</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-sm">{user.id}</td>
                    <td className="py-3 px-4 text-sm">{user.nombre}</td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4 text-sm">{user.rol}</td>
                    <td className="py-3 px-4 text-sm">{user.pais}</td>
                    <td className="py-3 px-4 text-sm">{user.moneda_preferida}</td>
                    <td className="py-3 px-4 text-sm">{new Date(user.fecha_registro).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm flex space-x-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isEditModalOpen && selectedUser && (
          <EditUserModal 
            user={selectedUser} 
            onClose={() => setIsEditModalOpen(false)}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </div>
    </div>
  );
};

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [name, setName] = useState(user.nombre);
  const [email, setEmail] = useState(user.email);
  const [rol, setRol] = useState(user.rol);
  const [country, setCountry] = useState(user.pais);
  const [preferredCurrency, setPreferredCurrency] = useState(user.moneda_preferida);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedUser = { nombre: name, email, rol, pais: country, moneda_preferida: preferredCurrency };
      await axios.put(`/api/admin/users/${user.id}`, updatedUser, config);
      toast.success('Usuario actualizado exitosamente!');
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error al actualizar usuario.');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 rounded-2xl max-w-md w-full p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-white">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Nombre</label>
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="rol" className="block text-gray-300 text-sm font-bold mb-2">Rol</label>
            <select
              id="rol"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-300 text-sm font-bold mb-2">País</label>
            <input
              type="text"
              id="country"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="preferredCurrency" className="block text-gray-300 text-sm font-bold mb-2">Moneda Preferida</label>
            <select
              id="preferredCurrency"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value)}
              required
            >
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
