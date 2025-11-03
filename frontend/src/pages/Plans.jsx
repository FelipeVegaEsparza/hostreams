import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'react-toastify';
import SubscriptionModal from '../components/SubscriptionModal';

const Plans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Radio');
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/plans`);
        if (Array.isArray(response.data)) {
          setAllPlans(response.data);
        } else {
          toast.error('Error al cargar los planes.');
          setAllPlans([]);
        }
      } catch (error) {
        toast.error('Error al conectar con el servidor.');
        setAllPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (plan) => {
    setSelectedPlan({ ...plan, moneda_preferida: currency });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    try {
      let parsed = JSON.parse(features);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not parse plan features:", features, error);
      return [];
    }
  };

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    try {
      let parsed = JSON.parse(features);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not parse plan features:", features, error);
      return [];
    }
  };

  const filteredPlans = allPlans.filter(p => p.categoria === category);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-xl text-blue-400">Cargando planes...</p>
      </div>
    );
  }

  const TabButton = ({ cat, children }) => (
    <button 
      onClick={() => setCategory(cat)} 
      className={`px-8 py-3 text-lg font-bold transition-colors duration-300 rounded-t-lg ${category === cat ? 'bg-gray-800/50 text-white' : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/20'}`}>
      {children}
    </button>
  );

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-12 sm:py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white">Nuestros Planes</h1>
        <p className="text-base sm:text-lg text-gray-300 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">Elige el plan que mejor se adapte a tus necesidades. Todos incluyen soporte técnico y actualizaciones.</p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:border-b border-gray-700 mb-8 sm:mb-10">
          <TabButton cat="Radio">Planes de Radio</TabButton>
          <TabButton cat="TV">Planes de TV</TabButton>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 border border-gray-700 rounded-full p-1 flex items-center space-x-1">
            <button 
              onClick={() => setCurrency('CLP')} 
              className={`px-5 sm:px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${currency === 'CLP' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
              CLP
            </button>
            <button 
              onClick={() => setCurrency('USD')} 
              className={`px-5 sm:px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
              USD
            </button>
          </div>
        </div>

        {filteredPlans.length === 0 && !loading ? (
           <div className="text-center py-10">
             <p className="text-xl text-gray-400">No hay planes de {category} disponibles en este momento.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col">
                <div className="flex-grow">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{plan.nombre}</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">{plan.descripcion}</p>
                  <ul className="list-none text-gray-300 mb-8 space-y-3">
                    {parseFeatures(plan.caracteristicas).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center mt-auto">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    {currency === 'CLP' ? `$${Math.floor(plan.precio_clp)}` : `\$${Math.floor(plan.precio_usd)}`}
                    <span className="text-base sm:text-lg text-gray-400"> {currency} / {plan.periodo}</span>
                  </p>
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Suscribirme
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <SubscriptionModal 
            plan={selectedPlan} 
            onClose={closeModal} 
          />
        )}
      </div>
    </div>
  );
};

export default Plans;