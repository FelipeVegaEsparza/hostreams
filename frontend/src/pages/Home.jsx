import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import SubscriptionModal from '../components/SubscriptionModal';

const FeatureCard = ({ icon, title, children }) => (
  <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center h-full">
    <div className="w-16 h-16 mb-4 text-blue-400">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{children}</p>
  </div>
);

const StepCard = ({ number, title, children }) => (
  <div className="relative z-10 flex flex-col items-center text-center p-6 md:p-0 mb-8 md:mb-0">
    <div className="w-16 h-16 flex items-center justify-center bg-blue-600/20 border-2 border-blue-500 rounded-full text-2xl font-bold text-blue-300 mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400 max-w-xs">{children}</p>
  </div>
);

const TestimonialCard = ({ author, children }) => (
  <div className="glass-card rounded-2xl p-8 text-center w-full flex-shrink-0">
    <p className="text-gray-300 italic text-lg mb-6">{children}</p>
    <p className="font-bold text-blue-400">- {author}</p>
  </div>
);

const Home = () => {
  const bannerImages = [
    `/banner1.webp`,
    `/banner2.webp`,
    `/banner3.webp`,
  ];
  const [currentBanner, setCurrentBanner] = useState(0);
  const [plans, setPlans] = useState([]);
  const [latestBlogPosts, setLatestBlogPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { currency } = useCurrency();

  const isNewPost = (createdAt) => {
    const postDate = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return postDate > sevenDaysAgo;
  };

  const testimonials = [
    { author: 'María P., Radio Comunitaria', text: '“Con Hostreams pusimos la radio de la municipalidad al aire en una semana. Soporte rápido y todo funcionando.”' },
    { author: 'Javier R., Director Técnico', text: '“Las apps PWA se instalaron en minutos y nuestros oyentes ya las usan. Excelente solución.”' },
    { author: 'Radio La Costa', text: '“Buena relación precio-calidad, y la asesoría para ZaraRadio nos ahorró tiempo y dolores de cabeza.”' },
    { author: 'Carlos S., Emisora Online', text: '“El panel de control es muy fácil de usar. En menos de un día ya estábamos programando nuestra música.”' },
    { author: 'Ana G., Podcast Producer', text: '“La calidad del streaming es impecable, sin cortes ni interrupciones. Muy profesionales.”' },
    { author: 'FM del Sol', text: '“Migramos desde otro proveedor y la diferencia es notable. El soporte técnico nos ayudó en todo momento.”' },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentBanner((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      clearInterval(bannerTimer);
      clearInterval(testimonialTimer);
    };
  }, [bannerImages.length, testimonials.length]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/plans');
        setPlans(response.data.slice(0, 2)); // Tomar solo los primeros 2 planes
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchLatestBlogPosts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL + 'api/blog');
        const sortedPosts = Array.isArray(response.data)
          ? response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setLatestBlogPosts(sortedPosts.slice(0, 3)); // Get latest 3 posts
      } catch (error) {
        console.error('Error al obtener las últimas entradas del blog:', error);
      }
    };
    fetchLatestBlogPosts();
  }, []);

  const handleOpenModal = (plan) => {
    setSelectedPlan({ ...plan, moneda_preferida: currency });
    setIsModalOpen(true);
  };

  const parseFeatures = (features) => {
    if (!features) return [];
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

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a7.5 7.5 0 0110.606 0" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.929 9.929a10.5 10.5 0 0114.142 0" />
        </svg>
      ),
      title: 'Streaming profesional',
      description: 'Emisión 24/7 con baja latencia y hasta 1000 oyentes simultáneos (según plan).',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Apps PWA para tu emisora',
      description: 'Apps instalables en Android, iPhone y PC con tu logo y colores.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Sitio web + reproductor',
      description: 'Landing o sitio tipo blog con reproductor integrado y panel de noticias.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Panel de control sencillo',
      description: 'Administra playlists, horarios y programación desde un panel intuitivo.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
        </svg>
      ),
      title: 'Hosting SSD y correo',
      description: 'Alojamiento rápido y correo corporativo opcional.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Soporte y asesoría',
      description: 'Configuración inicial, integración con ZaraRadio y guía para emitir en vivo.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      title: 'Escalabilidad',
      description: 'Planes pensados para crecer con tu audiencia.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Pago seguro',
      description: 'Acepta pagos recurrentes (suscripciones) y pasarelas compatibles.',
    },
  ];

  return (
    <div className="bg-gray-900 text-white">
      {isModalOpen && <SubscriptionModal plan={selectedPlan} onClose={() => setIsModalOpen(false)} />}

      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden p-4 text-center">
        <div className="hero-bg-slider">
          {bannerImages.map((img, index) => (
            <div
              key={index}
              className={`hero-bg-image ${index === currentBanner ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <div className="hero-bg-overlay"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-wider mb-4 sm:mb-6 animate-fade-in-down text-glow">
            Lanza, Transmite y Crece
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mb-8 sm:mb-12 leading-relaxed animate-fade-in">
            La plataforma todo-en-uno para radios online. Servicio de streaming con panel de control, apps PWA (Android/iOS/PC), hosting SSD y soporte técnico. Ideal para emisoras comunitarias, locales y proyectos comerciales. Sin complicaciones técnicas: te entregamos lo necesario para salir al aire.
          </p>
          <div className="animate-fade-in-up">
            <Link 
              to="/plans" 
              className="px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 text-white text-lg sm:text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">Todo lo que necesitas para transmitir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title}>
                {feature.description}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-white">Cómo funciona</h2>
          <div className="relative flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-500/30 transform -translate-y-1/2"></div>
            <StepCard number="1" title="Elige un plan">Selecciona el paquete que se ajuste a tu audiencia.</StepCard>
            <StepCard number="2" title="Configuramos todo">Panel, streaming, apps y sitio; te entregamos accesos y guía.</StepCard>
            <StepCard number="3" title="Entra al aire">Comienza a transmitir música, programas y contenidos en vivo.</StepCard>
          </div>
        </div>
      </section>

      {/* Players Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto text-center max-w-7xl">
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-blue-400 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Elige tu Player Favorito</h2>
            </div>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ofrecemos 6 diseños exclusivos de reproductores web y PWA totalmente personalizables. 
              Cada uno con su propio estilo único, optimizado para móviles y escritorio. 
              <span className="text-blue-400 font-semibold"> ¡Tú eliges el que mejor represente tu marca!</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div 
                key={num} 
                className="glass-card rounded-2xl overflow-hidden group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                style={{ animationDelay: `${num * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={`/p${num}.png`} 
                    alt={`Player ${num}`} 
                    className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Player {num}
                  </div>
                </div>
                <div className="p-6 bg-gray-800/50">
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Diseño Moderno</span>
                    <span className="text-gray-500">•</span>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Responsive</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center text-gray-300">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base">100% Personalizables</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base">Instalables como App</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base">Optimizados para SEO</span>
            </div>
          </div>

          <div className="mt-10">
            <Link 
              to="/plans" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span>Ver Planes y Elegir tu Player</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>



      {/* Control Panel Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto text-center max-w-6xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 sm:mb-16 text-white">Nuestro Panel de Control</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <img src="/dashboard.webp" alt="Hostreams Dashboard" className="rounded-xl border border-gray-700 shadow-xl transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="md:w-1/2 text-center md:text-left space-y-4 md:space-y-6 md:border-l-4 border-blue-500 md:pl-8">
              <h3 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-4">Un panel para administrar tu contenido</h3>
              <p className="text-gray-300 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                El dashboard de Hostreams te permite gestionar fácilmente toda la parte editorial de tu emisora: contenido del sitio web y la app PWA, publicaciones, noticias, banners y secciones informativas.
              </p>
              <p className="text-gray-300 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Desde aquí podrás mantener actualizada tu plataforma, subir imágenes, editar textos y programar publicaciones sin depender de conocimientos técnicos.
              </p>
              <p className="text-gray-300 sm:text-lg leading-relaxed sm:leading-loose max-w-prose">
                Todo lo que cambies en este panel se sincroniza automáticamente entre tu app y tu sitio web, manteniendo tu emisora siempre al día y con una imagen profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto text-center max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">Nuestro Blog</h2>
          {latestBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {latestBlogPosts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="glass-card rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 block relative">
                  {isNewPost(post.createdAt) && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">NUEVO ARTICULO</span>
                  )}
                  {post.imageUrl && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm">{post.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg mb-12">No hay entradas de blog disponibles en este momento.</p>
          )}
          <Link
            to="/blog"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
          >
            Visita nuestro Blog
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">Qué dicen nuestros clientes</h2>
          <div className="relative max-w-3xl mx-auto overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard author={testimonial.author}>
                    {testimonial.text}
                  </TestimonialCard>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 mx-2 rounded-full transition-colors duration-300 ${currentTestimonial === index ? 'bg-blue-500' : 'bg-gray-600'}`}>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;