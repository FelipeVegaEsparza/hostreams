import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BlogDetail = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`/api/blog/${id}`);
        setBlogPost(response.data);
      } catch (err) {
        setError('Error al cargar la entrada del blog.');
        toast.error('Error al cargar la entrada del blog.');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white text-xl mt-8">Cargando entrada del blog...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
  }

  if (!blogPost) {
    return <div className="text-center text-gray-400 text-xl mt-8">Entrada del blog no encontrada.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
          {blogPost.imageUrl && (
            <img
              src={`${blogPost.imageUrl}`}
              alt={blogPost.title}
              className="w-full h-96 object-cover rounded-md mb-6"
            />
          )}
          <h1 className="text-4xl font-bold text-white mb-4">{blogPost.title}</h1>
          <p className="text-gray-400 text-sm mb-4">Publicado el: {new Date(blogPost.createdAt).toLocaleDateString()}</p>
          <div className="text-gray-300 text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: blogPost.longDescription }}>
          </div>
          <Link
            to="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Volver al Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;