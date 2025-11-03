import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import SubscriptionModal from '../components/SubscriptionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faServer, faUsers, faMobileAlt, faChartBar, faHeadphones } from '@fortawesome/free-solid-svg-icons';

const Feature = ({ icon, title, text }) => (
  <div className="glass-card rounded-2xl p-6 flex">
    <FontAwesomeIcon icon={icon} className="text-blue-400 text-3xl w-12 h-12 mr-6 mt-1" />
    <div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{text}</p>
    </div>
  </div>
);

const RadioOnline = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRadioPlans = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/plans?categoria=Radio');
        setPlans(response.data);
      } catch (error) {
        console.error('Error al obtener los planes de radio:', error);
      }
    };
    fetchRadioPlans();
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
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(/banner2.webp)` }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
        <div className="relative z-10 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider text-glow">
            Radio Online Profesional
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            Tu estación de radio en internet con la máxima calidad de audio, estabilidad 24/7 y todas las herramientas para crecer.
          </p>
        </div>
      </div>

      {/* Features Grid Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Todo para tu Emisora</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Feature icon={faHeadphones} title="Calidad de Audio Superior" text="Streaming en formato AAC+ de alta eficiencia para un sonido nítido y claro con bajo consumo de datos para tus oyentes." />
            <Feature icon={faServer} title="AutoDJ Inteligente" text="Sube tu música, programas y pautas comerciales. Crea listas de reproducción y deja que el sistema transmita por ti 24/7." />
            <Feature icon={faUsers} title="Estadísticas Detalladas" text="Conoce a tu audiencia: oyentes en tiempo real, picos de audiencia, tiempo de escucha, ubicación geográfica y más." />
            <Feature icon={faMobileAlt} title="App PWA para Móviles y PC" text="Entregamos una app instalable con el logo de tu radio para Android, iOS y computadoras. Tus oyentes a un clic de distancia." />
            <Feature icon={faPlayCircle} title="Reproductor Web HTML5" text="Un reproductor moderno y personalizable para integrar en tu sitio web, compatible con todos los navegadores." />
            <Feature icon={faChartBar} title="Escalabilidad Garantizada" text="Nuestros planes crecen contigo. Aumenta la cantidad de oyentes y la calidad de transmisión cuando lo necesites." />
          </div>
        </div>
      </section>

      {/* SonicPanel Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-blue-900 to-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 sm:mb-16 text-white">Tecnología SonicPanel para tu radio online</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <img src="/sonicpanel.webp" alt="SonicPanel" className="rounded-lg shadow-xl border border-gray-700 transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="md:w-1/2 text-center md:text-left space-y-6 md:border-l-4 border-blue-500 md:pl-8">
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                En Hostreams impulsamos tu emisora con la potencia y estabilidad de SonicPanel, una de las plataformas de radiostreaming más avanzadas y confiables del mundo.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Somos partners estratégicos de SonicPanel, lo que nos permite ofrecerte una integración directa, con todas sus funciones premium y un soporte técnico optimizado para cada cliente.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Con SonicPanel podrás administrar tus cuentas de radio, gestionar DJs, programar retransmisiones, emitir en vivo o de forma automática, y obtener estadísticas en tiempo real sobre tu audiencia.
              </p>
              <p className="text-gray-200 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Esta tecnología está disponible en todos nuestros planes de radio online, garantizando un rendimiento profesional, transmisión continua 24/7 y una experiencia fluida tanto para emisores como para oyentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Planes de Radio Online</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                    {currency === 'CLP' ? `$${Math.floor(plan.precio_clp)}` : `\$${Math.floor(plan.precio_usd)}`}
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

export default RadioOnline;