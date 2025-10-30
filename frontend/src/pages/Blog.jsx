import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'blog');
        const sortedPosts = Array.isArray(response.data)
          ? response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setBlogPosts(sortedPosts);
      } catch (err) {
        setError('Error al cargar las entradas del blog.');
        toast.error('Error al cargar las entradas del blog.');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div className="text-center text-white text-xl mt-8">Cargando entradas del blog...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Nuestro Blog</h1>
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                {post.imageUrl && (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{post.shortDescription}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                  >
                    Leer Más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-8">No hay entradas de blog disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;