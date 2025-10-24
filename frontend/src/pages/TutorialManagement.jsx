import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faSave, faTimes, faVideo, faList } from '@fortawesome/free-solid-svg-icons';

// Helper para extraer ID de video de YouTube
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

const TutorialManagement = () => {
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  // State para gestión de categorías
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);

  // State para gestión de tutoriales
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [tutorialForm, setTutorialForm] = useState({
    titulo: '',
    descripcion: '',
    video_url: '',
    categoria_id: '',
  });
  const [isTutorialEditing, setIsTutorialEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      const [categoriesRes, tutorialsRes] = await Promise.all([
        axios.get('/api/tutorial-categorias', config),
        axios.get('/api/tutoriales', config),
      ]);

      setCategories(categoriesRes.data);
      setTutorials(tutorialsRes.data);
    } catch (err) {
      toast.error('Error al cargar datos de tutoriales.');
    } finally {
      setLoading(false);
    }
  };

  // --- Gestión de Categorías ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      if (isCategoryEditing) {
        await axios.put(`/api/tutorial-categorias/${currentCategory.id}`, { nombre: categoryName }, config);
        toast.success('Categoría actualizada.');
      } else {
        await axios.post('/api/tutorial-categorias', { nombre: categoryName }, config);
        toast.success('Categoría creada.');
      }
      setCategoryName('');
      setIsCategoryEditing(false);
      setCurrentCategory(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al guardar categoría.');
    }
  };

  const editCategory = (category) => {
    setCategoryName(category.nombre);
    setCurrentCategory(category);
    setIsCategoryEditing(true);
  };

  const deleteCategory = async (id) => {
    if (window.confirm('¿Eliminar esta categoría? Los tutoriales asociados podrían quedar sin categoría.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/api/tutorial-categorias/${id}`, config);
        toast.success('Categoría eliminada.');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Error al eliminar categoría.');
      }
    }
  };

  // --- Gestión de Tutoriales ---
  const handleTutorialChange = (e) => {
    setTutorialForm({ ...tutorialForm, [e.target.name]: e.target.value });
  };

  const handleTutorialSubmit = async (e) => {
    e.preventDefault();
    if (!getYoutubeVideoId(tutorialForm.video_url)) {
      toast.error('La URL del video debe ser un enlace válido de YouTube.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
      if (isTutorialEditing) {
        await axios.put(`/api/tutoriales/${currentTutorial.id}`, tutorialForm, config);
        toast.success('Tutorial actualizado.');
      } else {
        await axios.post('/api/tutoriales', tutorialForm, config);
        toast.success('Tutorial creado.');
      }
      setTutorialForm({ titulo: '', descripcion: '', video_url: '', categoria_id: '' });
      setIsTutorialEditing(false);
      setCurrentTutorial(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al guardar tutorial.');
    }
  };

  const editTutorial = (tutorial) => {
    setCurrentTutorial(tutorial);
    setIsTutorialEditing(true);
    setTutorialForm({
      titulo: tutorial.titulo,
      descripcion: tutorial.descripcion,
      video_url: tutorial.video_url,
      categoria_id: tutorial.categoria_id,
    });
  };

  const deleteTutorial = async (id) => {
    if (window.confirm('¿Eliminar este tutorial? Esta acción no se puede deshacer.')) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`/api/tutoriales/${id}`, config);
        toast.success('Tutorial eliminado.');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Error al eliminar tutorial.');
      }
    }
  };

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex justify-center items-center">Cargando gestión de tutoriales...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-12">Gestión de Tutoriales</h1>

        {/* Gestión de Categorías */}
        <div className="glass-card rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FontAwesomeIcon icon={faList} className="mr-3" /> Gestión de Categorías
          </h2>
          <form onSubmit={handleCategorySubmit} className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Nombre de la Categoría"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="flex-grow bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white"
              required
            />
            <button type="submit" className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              <FontAwesomeIcon icon={isCategoryEditing ? faSave : faPlus} className="mr-2" />
              {isCategoryEditing ? 'Actualizar' : 'Crear'}
            </button>
            {isCategoryEditing && (
              <button type="button" onClick={() => { setIsCategoryEditing(false); setCurrentCategory(null); setCategoryName(''); }} className="bg-gray-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-gray-700 transition-colors">
                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
              </button>
            )}
          </form>

          {categories.length === 0 ? (
            <p className="text-gray-400">No hay categorías creadas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Nombre</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">{cat.id}</td>
                      <td className="p-4 font-medium">{cat.nombre}</td>
                      <td className="p-4 flex justify-end space-x-2">
                        <button onClick={() => editCategory(cat)} className="bg-yellow-500/20 text-yellow-300 py-1 px-3 rounded-md text-xs hover:bg-yellow-500/40 transition-colors">
                          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="bg-red-500/20 text-red-300 py-1 px-3 rounded-md text-xs hover:bg-red-500/40 transition-colors">
                          <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Gestión de Tutoriales */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FontAwesomeIcon icon={faVideo} className="mr-3" /> Gestión de Tutoriales
          </h2>
          <form onSubmit={handleTutorialSubmit} className="space-y-4 mb-6">
            <input
              type="text"
              name="titulo"
              placeholder="Título del Tutorial"
              value={tutorialForm.titulo}
              onChange={handleTutorialChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white"
              required
            />
            <textarea
              name="descripcion"
              placeholder="Descripción del Tutorial"
              value={tutorialForm.descripcion}
              onChange={handleTutorialChange}
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white resize-none"
            ></textarea>
            <input
              type="url"
              name="video_url"
              placeholder="URL de YouTube (ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
              value={tutorialForm.video_url}
              onChange={handleTutorialChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white"
              required
            />
            <select
              name="categoria_id"
              value={tutorialForm.categoria_id}
              onChange={handleTutorialChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white"
              required
            >
              <option value="">Selecciona una Categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button type="submit" className="bg-blue-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                <FontAwesomeIcon icon={isTutorialEditing ? faSave : faPlus} className="mr-2" />
                {isTutorialEditing ? 'Actualizar Tutorial' : 'Crear Tutorial'}
              </button>
              {isTutorialEditing && (
                <button type="button" onClick={() => { setIsTutorialEditing(false); setCurrentTutorial(null); setTutorialForm({ titulo: '', descripcion: '', video_url: '', categoria_id: '' }); }} className="bg-gray-600 text-white py-2 px-5 rounded-lg font-bold hover:bg-gray-700 transition-colors">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </button>
              )}
            </div>
          </form>

          {tutorials.length === 0 ? (
            <p className="text-gray-400">No hay tutoriales creados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="p-4">Título</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">URL Video</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorials.map((tut) => (
                    <tr key={tut.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4 font-medium">{tut.titulo}</td>
                      <td className="p-4 text-gray-300">{tut.TutorialCategoria?.nombre || 'N/A'}</td>
                      <td className="p-4 text-blue-400 hover:underline"><a href={tut.video_url} target="_blank" rel="noopener noreferrer">Ver Video</a></td>
                      <td className="p-4 flex justify-end space-x-2">
                        <button onClick={() => editTutorial(tut)} className="bg-yellow-500/20 text-yellow-300 py-1 px-3 rounded-md text-xs hover:bg-yellow-500/40 transition-colors">
                          <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
                        </button>
                        <button onClick={() => deleteTutorial(tut.id)} className="bg-red-500/20 text-red-300 py-1 px-3 rounded-md text-xs hover:bg-red-500/40 transition-colors">
                          <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Eliminar
                        </button>
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

export default TutorialManagement;
