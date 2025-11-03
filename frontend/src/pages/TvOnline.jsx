import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import SubscriptionModal from '../components/SubscriptionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faBroadcastTower, faFilm, faGlobe, faCogs, faPlay } from '@fortawesome/free-solid-svg-icons';

const Feature = ({ icon, title, text }) => (
  <div className="glass-card rounded-2xl p-6 flex">
    <FontAwesomeIcon icon={icon} className="text-blue-400 text-3xl w-12 h-12 mr-6 mt-1" />
    <div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{text}</p>
    </div>
  </div>
);

const TvOnline = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTvPlans = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/plans?categoria=TV');
        setPlans(response.data);
      } catch (error) {
        console.error('Error al obtener los planes de TV:', error);
      }
    };
    fetchTvPlans();
  }, []);

  const handleOpenModal = (plan) => {
    setSelectedPlan({ ...plan, moneda_preferida: currency });
    setIsModalOpen(true);
  };

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features; // Ya es un array
    try {
      let parsed = JSON.parse(features);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not parse plan features:", features, error);
      return [];
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {isModalOpen && <SubscriptionModal plan={selectedPlan} onClose={() => setIsModalOpen(false)} />}

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center p-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/banner3.webp)` }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
        <div className="relative z-10 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider text-glow">
            TV Online Sin Límites
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            Transmite tu canal de video en vivo o bajo demanda a todo el mundo, con la mejor tecnología y sin complicaciones.
          </p>
        </div>
      </div>

      {/* Features Grid Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">La Plataforma Definitiva para Video</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Feature icon={faBroadcastTower} title="Streaming en Vivo (Live)" text="Transmite en directo desde tu computadora usando OBS, vMix o hardware compatible. Ideal para eventos, noticias y programas." />
            <Feature icon={faFilm} title="Video Bajo Demanda (VOD)" text="Crea una videoteca para que tu audiencia vea tus contenidos en cualquier momento, como un servicio de streaming profesional." />
            <Feature icon={faTv} title="Canal 24/7 (Playout)" text="Automatiza la transmisión de tu canal. Sube tus videos, arma una programación y deja que nuestro sistema lo emita 24/7." />
            <Feature icon={faGlobe} title="Alcance Global con CDN" text="Tu contenido se distribuye a través de una red de servidores global (CDN) para una entrega rápida y estable en cualquier país." />
            <Feature icon={faPlay} title="Reproductor de Video HTML5" text="Te entregamos un reproductor de video compatible con todos los dispositivos y que puedes insertar fácilmente en tu sitio web." />
            <Feature icon={faCogs} title="Streaming Adaptativo" text="La calidad del video se ajusta automáticamente a la velocidad de internet del espectador, garantizando una experiencia sin cortes." />
          </div>
        </div>
      </section>

      {/* VDOPanel Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 sm:mb-16 text-white">Transmite con la potencia de VDOPanel</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <img src="/vdopanel.webp" alt="VDOPanel" className="rounded-lg shadow-xl border border-gray-700 transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="md:w-1/2 text-center md:text-left space-y-6 md:border-l-4 border-blue-500 md:pl-8">
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                En Hostreams llevamos tu señal de televisión a otro nivel gracias a VDOPanel, la plataforma líder en streaming de video profesional para emisoras y proyectos digitales.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Somos partners estratégicos de VDOPanel, lo que nos permite ofrecer una experiencia completa, estable y optimizada, con herramientas avanzadas para la gestión y emisión de contenido audiovisual.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Con VDOPanel podrás emitir en vivo o reproducir programación grabada, crear listas automáticas, insertar comerciales, personalizar tu reproductor y analizar estadísticas en tiempo real.
                Todo desde un entorno intuitivo, moderno y accesible desde cualquier dispositivo.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Esta tecnología está incluida en todos nuestros planes de TV online, garantizando una transmisión fluida, de alta calidad y sin interrupciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Planes de TV Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.id} className="glass-card rounded-2xl p-8 flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-3xl font-extrabold text-white mb-4">{plan.nombre}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{plan.descripcion}</p>
                  <ul className="list-none text-gray-300 mb-8 space-y-3">
                    {parseFeatures(plan.caracteristicas).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center mt-auto">
                  <p className="text-4xl font-bold text-white mb-6">
                    {currency === 'CLP' ? `$${plan.precio_clp}` : `\$${plan.precio_usd}`}
                    <span className="text-lg text-gray-400"> {currency} / {plan.periodo}</span>
                  </p>
                  <div className="flex flex-col space-y-3">
                    {plan.example_url && (
                      <a
                        href={plan.example_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-600 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Ver un Ejemplo
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Contratar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TvOnline;