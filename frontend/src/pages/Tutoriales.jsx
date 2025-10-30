import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper para extraer ID de video de YouTube
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

const Tutoriales = () => {
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorialData = async () => {
      try {
        const [categoriesRes, tutorialsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_BASE_URL + '/api/tutorial-categorias'),
          axios.get(import.meta.env.VITE_API_BASE_URL + '/api/tutoriales'),
        ]);
        setCategories(categoriesRes.data);
        setTutorials(tutorialsRes.data);
      } catch (err) {
        toast.error('Error al cargar los tutoriales.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorialData();
  }, []);

  if (loading) {
    return <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] flex justify-center items-center">Cargando tutoriales...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">Tutoriales y Guías</h1>
        <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Aprende a usar nuestra plataforma con estas guías en video. Desde la configuración inicial hasta funciones avanzadas.
        </p>

        {categories.length === 0 && tutorials.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-xl text-gray-400">No hay tutoriales disponibles en este momento.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const tutorialsInCategory = tutorials.filter(tut => tut.categoria_id === category.id);
              if (tutorialsInCategory.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="text-3xl font-bold text-blue-400 mb-8 border-b border-gray-700 pb-4">{category.nombre}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorialsInCategory.map((tutorial) => {
                      const videoId = getYoutubeVideoId(tutorial.video_url);
                      return (
                        <div key={tutorial.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
                          {videoId && (
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={tutorial.titulo}
                              ></iframe>
                            </div>
                          )}
                          <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold text-white mb-2">{tutorial.titulo}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{tutorial.descripcion}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutoriales;
