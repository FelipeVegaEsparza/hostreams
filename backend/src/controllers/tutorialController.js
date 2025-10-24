const Tutorial = require('../models/Tutorial');
const TutorialCategoria = require('../models/TutorialCategoria');

// Helper para extraer ID de video de YouTube
const getYoutubeVideoId = (url) => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
};

// Obtener todos los tutoriales (público, opcionalmente filtrado por categoría)
exports.getTutorials = async (req, res) => {
  const { categoria_id } = req.query;
  const whereClause = {};
  if (categoria_id) {
    whereClause.categoria_id = categoria_id;
  }
  try {
    const tutorials = await Tutorial.findAll({
      where: whereClause,
      include: [{ model: TutorialCategoria, attributes: ['nombre'] }],
      order: [['fecha_creacion', 'DESC']],
    });
    res.json(tutorials);
  } catch (err) {
    console.error('Error al obtener tutoriales:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Obtener un tutorial por ID (público)
exports.getTutorialById = async (req, res) => {
  const { id } = req.params;
  try {
    const tutorial = await Tutorial.findByPk(id, {
      include: [{ model: TutorialCategoria, attributes: ['nombre'] }],
    });
    if (!tutorial) {
      return res.status(404).json({ msg: 'Tutorial no encontrado.' });
    }
    res.json(tutorial);
  } catch (err) {
    console.error('Error al obtener tutorial por ID:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Crear un nuevo tutorial (solo admin)
exports.createTutorial = async (req, res) => {
  const { titulo, descripcion, video_url, categoria_id } = req.body;
  if (!titulo || !video_url || !categoria_id) {
    return res.status(400).json({ msg: 'Título, URL del video y Categoría son requeridos.' });
  }
  if (!getYoutubeVideoId(video_url)) {
    return res.status(400).json({ msg: 'La URL del video debe ser un enlace válido de YouTube.' });
  }
  try {
    const newTutorial = await Tutorial.create({
      titulo,
      descripcion,
      video_url,
      categoria_id,
    });
    res.status(201).json(newTutorial);
  } catch (err) {
    console.error('Error al crear tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar un tutorial existente (solo admin)
exports.updateTutorial = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, video_url, categoria_id } = req.body;
  if (!titulo || !video_url || !categoria_id) {
    return res.status(400).json({ msg: 'Título, URL del video y Categoría son requeridos.' });
  }
  if (!getYoutubeVideoId(video_url)) {
    return res.status(400).json({ msg: 'La URL del video debe ser un enlace válido de YouTube.' });
  }
  try {
    let tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
      return res.status(404).json({ msg: 'Tutorial no encontrado.' });
    }
    tutorial.titulo = titulo;
    tutorial.descripcion = descripcion;
    tutorial.video_url = video_url;
    tutorial.categoria_id = categoria_id;
    await tutorial.save();
    res.json(tutorial);
  } catch (err) {
    console.error('Error al actualizar tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Eliminar un tutorial (solo admin)
exports.deleteTutorial = async (req, res) => {
  const { id } = req.params;
  try {
    const tutorial = await Tutorial.findByPk(id);
    if (!tutorial) {
      return res.status(404).json({ msg: 'Tutorial no encontrado.' });
    }
    await tutorial.destroy();
    res.json({ msg: 'Tutorial eliminado exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};
