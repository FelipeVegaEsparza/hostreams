import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  const { nombre, email, mensaje } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + 'api/contact', formData);
      toast.success(res.data.msg);
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al enviar el mensaje.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-128px)] py-12 sm:py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-wider text-glow mb-4">Contáctanos</h1>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            ¿Tienes preguntas sobre nuestros planes, necesitas ayuda con tu servicio o quieres una solución a medida? Completa el formulario y nuestro equipo se pondrá en contacto contigo a la brevedad.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="nombre">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={nombre}
                  onChange={onChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                  Tu Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="mensaje">
                Tu Mensaje
              </label>
              <textarea
                name="mensaje"
                id="mensaje"
                rows="6"
                value={mensaje}
                onChange={onChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-blue-600 text-white py-3 px-10 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3" />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-3" />
                )}
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
