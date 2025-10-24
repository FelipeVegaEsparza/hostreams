import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const initialFormState = {
    nombre: '',
    descripcion: '',
    precio_clp: '',
    precio_usd: '',
    periodo: 'mensual',
    caracteristicas: '',
    estado: 'activo',
    categoria: 'Radio',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get('/api/plans/all', config);
      setPlans(response.data);
    } catch (err) {
      toast.error('Error al cargar los planes.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      const planData = {
        ...formData,
        caracteristicas: formData.caracteristicas.split(',').map(item => item.trim()).filter(item => item !== ''),
        precio_clp: parseFloat(formData.precio_clp),
        precio_usd: parseFloat(formData.precio_usd),
      };

      if (isEditing) {
        await axios.put(`/api/plans/${currentPlan.id}`, planData, config);
        toast.success('Plan actualizado.');
      } else {
        await axios.post('/api/plans', planData, config);
        toast.success('Plan creado.');
      }
      setIsFormVisible(false);
      setFormData(initialFormState);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al guardar el plan.');
    }
  };

  const handleEditClick = (plan) => {
    setIsEditing(true);
    setCurrentPlan(plan);
    setFormData({
      nombre: plan.nombre,
      descripcion: plan.descripcion,
      precio_clp: plan.precio_clp,
      precio_usd: plan.precio_usd,
      periodo: plan.periodo,
      caracteristicas: Array.isArray(plan.caracteristicas) ? plan.caracteristicas.join(', ') : '',
      estado: plan.estado,
      categoria: plan.categoria,
    });
    setIsFormVisible(true);
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setCurrentPlan(null);
    setFormData(initialFormState);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setFormData(initialFormState);
  }

  const deletePlan = async (id) => {
    if (window.confirm('¿Eliminar este plan? Esta acción no se puede deshacer.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/api/plans/${id}`, config);
        toast.success('Plan eliminado.');
        fetchPlans();
      } catch (err) {
        toast.error('Error al eliminar el plan.');
      }
    }
  };

  const FormInput = ({ label, ...props }) => (
    <div>
      <label className="block text-gray-300 text-sm font-semibold mb-2">{label}</label>
      <input {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );

  const FormSelect = ({ label, children, ...props }) => (
    <div>
      <label className="block text-gray-300 text-sm font-semibold mb-2">{label}</label>
      <select {...props} className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
        {children}
      </select>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Gestión de Planes</h1>
          {!isFormVisible && (
            <button onClick={handleCreateClick} className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all duration-300">
              Crear Nuevo Plan
            </button>
          )}
        </div>

        {isFormVisible && (
          <div className="glass-card rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">{isEditing ? 'Editar Plan' : 'Crear Nuevo Plan'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Nombre" type="text" name="nombre" value={formData.nombre} onChange={onChange} required />
                <FormSelect label="Categoría" name="categoria" value={formData.categoria} onChange={onChange}>
                  <option value="Radio">Radio</option>
                  <option value="TV">TV</option>
                </FormSelect>
                <FormInput label="Descripción" type="text" name="descripcion" value={formData.descripcion} onChange={onChange} />
                <FormInput label="Precio CLP" type="number" name="precio_clp" value={formData.precio_clp} onChange={onChange} required />
                <FormInput label="Precio USD" type="number" name="precio_usd" value={formData.precio_usd} onChange={onChange} required />
                <FormSelect label="Periodo" name="periodo" value={formData.periodo} onChange={onChange}>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </FormSelect>
                <FormSelect label="Estado" name="estado" value={formData.estado} onChange={onChange}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </FormSelect>
              </div>
              <FormInput label="Características (separadas por comas)" type="text" name="caracteristicas" value={formData.caracteristicas} onChange={onChange} />
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={handleCancelClick} className="bg-gray-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-gray-700 transition-colors">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-blue-700 transition-colors">{isEditing ? 'Actualizar Plan' : 'Crear Plan'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Planes Existentes</h2>
          {loading ? <p>Cargando...</p> : plans.length === 0 ? <p>No hay planes creados.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="p-4">Nombre</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precios (CLP/USD)</th>
                    <th className="p-4">Periodo</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 font-medium">{plan.nombre}</td>
                      <td className="p-4">{plan.categoria}</td>
                      <td className="p-4">${Math.floor(plan.precio_clp)} / ${Math.floor(plan.precio_usd)}</td>
                      <td className="p-4">{plan.periodo}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${plan.estado === 'activo' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {plan.estado}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end space-x-2">
                        <button onClick={() => handleEditClick(plan)} className="bg-yellow-500/20 text-yellow-300 py-1 px-3 rounded-md text-xs hover:bg-yellow-500/40 transition-colors">Editar</button>
                        <button onClick={() => deletePlan(plan.id)} className="bg-red-500/20 text-red-300 py-1 px-3 rounded-md text-xs hover:bg-red-500/40 transition-colors">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanManagement;