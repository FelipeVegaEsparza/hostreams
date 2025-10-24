import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faTools, faPalette, faHeadset, faCogs, faCheckCircle, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomDevelopment = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);

  const { nombre, email, mensaje } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/contact', formData);
      toast.success(res.data.msg);
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error al enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-card p-8 rounded-lg text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
      <FontAwesomeIcon icon={icon} className="text-blue-400 text-5xl mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-base leading-relaxed">{description}</p>
    </div>
  );

  const AdvantageItem = ({ children }) => (
    <li className="flex items-start text-gray-200 text-lg leading-relaxed">
      <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 w-6 h-6 mr-3 flex-shrink-0 mt-1" />
      <span>{children}</span>
    </li>
  );

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center p-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/banner1.webp)` }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>
        <div className="relative z-10 animate-fade-in-down max-w-4xl mx-auto"> {/* Added max-w-4xl mx-auto here */}
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider text-glow mb-4 text-shadow-lg">
            💻 Desarrollo Personalizado
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-400 mb-6">
            Soluciones hechas a tu medida
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed"> {/* Removed max-w-4xl mx-auto from here as it's now on the parent div */}
            Creamos experiencias digitales únicas para radios, TV y medios online.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-24 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <p className="text-gray-200 text-xl leading-loose mb-8 text-center">
            En Hostreams sabemos que cada proyecto tiene su propia identidad y necesidades específicas. Por eso ofrecemos nuestro servicio de desarrollo personalizado, una alternativa premium y opcional, disponible por un costo adicional y aparte de los planes regulares.
          </p>
          <p className="text-gray-200 text-xl leading-loose mb-12 text-center">
            Este servicio está pensado para emisoras, medios digitales y empresas que buscan un desarrollo a medida, totalmente adaptado a su imagen y forma de trabajo.
          </p>

          <h3 className="text-4xl font-extrabold text-blue-400 mb-12 text-center">Podemos diseñar y construir:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <FeatureCard
              icon={faPalette}
              title="Sitios web personalizados"
              description="Diseño exclusivo e integración total con tu streaming para radios y canales de TV."
            />
            <FeatureCard
              icon={faTools}
              title="Paneles de administración avanzados"
              description="Hechos a la medida de tu flujo de trabajo y tus necesidades de contenido."
            />
            <FeatureCard
              icon={faLightbulb}
              title="Aplicaciones PWA personalizadas"
              description="Con funciones especiales, identidad visual propia y herramientas interactivas."
            />
            <FeatureCard
              icon={faCogs}
              title="Integraciones técnicas específicas"
              description="Conectando sistemas de emisión, bases de datos u otras plataformas."
            />
          </div>

          <div className="bg-gray-800/70 p-10 rounded-lg shadow-inner mb-20">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">Nos encargamos de todo el proceso:</h3>
            <p className="text-gray-200 text-xl leading-loose text-center">
              diseño, desarrollo, optimización y puesta en marcha. Tú solo nos dices qué necesitas, y nosotros lo hacemos realidad.
            </p>
          </div>

          <h2 className="text-5xl font-extrabold text-blue-400 mb-12 text-center">🚀 Ventajas del desarrollo personalizado</h2>
          <ul className="list-none space-y-4 mb-20 max-w-3xl mx-auto">
            <AdvantageItem>Diseño exclusivo y profesional que refleja la identidad de tu marca.</AdvantageItem>
            <AdvantageItem>Mayor control y flexibilidad, con herramientas creadas específicamente para ti.</AdvantageItem>
            <AdvantageItem>Compatibilidad total con nuestros servicios de radio y TV online.</AdvantageItem>
            <AdvantageItem>Soporte técnico dedicado durante el desarrollo y la implementación.</AdvantageItem>
            <AdvantageItem>Disponible por costo adicional y sin afectar tu plan actual.</AdvantageItem>
          </ul>

          <h2 className="text-5xl font-extrabold text-blue-400 mb-12 text-center">✉️ ¿Tienes un proyecto en mente?</h2>
          <p className="text-gray-200 text-xl leading-loose mb-12 text-center">
            Cuéntanos tu idea y te ayudaremos a llevarla a cabo. Nuestro equipo analizará tus requerimientos y te enviará una propuesta personalizada.
          </p>

          {/* Contact Form */}
          <div className="glass-card p-10 rounded-lg shadow-2xl max-w-3xl mx-auto border border-blue-700">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="nombre" className="block text-gray-200 text-lg font-bold mb-3">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-4 px-5 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 placeholder-gray-400"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-200 text-lg font-bold mb-3">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-4 px-5 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 placeholder-gray-400"
                  placeholder="tu.correo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-gray-200 text-lg font-bold mb-3">Mensaje:</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={mensaje}
                  onChange={handleChange}
                  rows="7"
                  className="shadow-inner appearance-none border border-gray-600 rounded-lg w-full py-4 px-5 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 placeholder-gray-400"
                  placeholder="Describe tu proyecto o consulta..."
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 text-xl shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3" />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-3" />
                  )}
                  {loading ? 'Enviando...' : 'Enviar mi consulta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomDevelopment;
