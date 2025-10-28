import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    image: null,
    imageUrl: '',
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/blog');
      setBlogPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Error al cargar las entradas del blog.');
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    const data = new FormData();
    data.append('title', formData.title);
    data.append('shortDescription', formData.shortDescription);
    data.append('longDescription', formData.longDescription);
    if (formData.image) {
      data.append('image', formData.image);
    }
    if (editingPost && !formData.image && formData.imageUrl) { // Keep existing image if no new one is uploaded
      data.append('imageUrl', formData.imageUrl);
    }

    try {
      if (editingPost) {
        await axios.put(import.meta.env.VITE_API_BASE_URL + `api/blog/${editingPost.id}`, data, config);
        toast.success('Entrada del blog actualizada exitosamente.');
      } else {
        await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/blog', data, config);
        toast.success('Entrada del blog creada exitosamente.');
      }
      setFormData({
        title: '',
        shortDescription: '',
        longDescription: '',
        image: null,
        imageUrl: '',
      });
      setEditingPost(null);
      fetchBlogPosts();
    } catch (error) {
      toast.error('Error al guardar la entrada del blog.');
      console.error('Error saving blog post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      shortDescription: post.shortDescription,
      longDescription: post.longDescription,
      image: null, // Reset image input
      imageUrl: post.imageUrl, // Store current image URL
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada del blog?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(import.meta.env.VITE_API_BASE_URL + `api/blog/${id}`, config);
        toast.success('Entrada del blog eliminada exitosamente.');
        fetchBlogPosts();
      } catch (error) {
        toast.error('Error al eliminar la entrada del blog.');
        console.error('Error deleting blog post:', error);
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Gestión de Blog</h1>

        <div className="glass-card rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">{editingPost ? 'Editar Entrada' : 'Crear Nueva Entrada'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-300">Descripción Corta</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="longDescription" className="block text-sm font-medium text-gray-300">Descripción Larga</label>
              <ReactQuill
                theme="snow"
                value={formData.longDescription}
                onChange={(content) => setFormData({ ...formData, longDescription: content })}
                className="mt-1 block w-full bg-gray-700 text-white rounded-md"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300">Imagen</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.imageUrl && !formData.image && (
                <p className="text-gray-400 text-sm mt-2">Imagen actual: <a href={`${formData.imageUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver Imagen</a></p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {editingPost ? 'Actualizar Entrada' : 'Crear Entrada'}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({
                    title: '',
                    shortDescription: '',
                    longDescription: '',
                    image: null,
                    imageUrl: '',
                  });
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 mt-2"
              >
                Cancelar Edición
              </button>
            )}
          </form>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Entradas del Blog Existentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción Corta</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Imagen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {blogPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{post.shortDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                          {post.imageUrl && (
                                            <a href={`${post.imageUrl}`} target="_blank" rel="noopener noreferrer">
                                              <img src={`${post.imageUrl}`} alt={post.title} className="h-10 w-10 object-cover rounded-full" />
                                            </a>
                                          )}                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;