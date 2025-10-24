const TutorialCategoria = require('../models/TutorialCategoria');

// Obtener todas las categorías de tutoriales
exports.getTutorialCategories = async (req, res) => {
  try {
    const categories = await TutorialCategoria.findAll();
    res.json(categories);
  } catch (err) {
    console.error('Error al obtener categorías de tutoriales:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Crear una nueva categoría de tutorial (solo admin)
exports.createTutorialCategory = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ msg: 'El nombre de la categoría es requerido.' });
  }
  try {
    const newCategory = await TutorialCategoria.create({ nombre });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error al crear categoría de tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar una categoría de tutorial (solo admin)
exports.updateTutorialCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ msg: 'El nombre de la categoría es requerido.' });
  }
  try {
    let category = await TutorialCategoria.findByPk(id);
    if (!category) {
      return res.status(404).json({ msg: 'Categoría no encontrada.' });
    }
    category.nombre = nombre;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error('Error al actualizar categoría de tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Eliminar una categoría de tutorial (solo admin)
exports.deleteTutorialCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await TutorialCategoria.findByPk(id);
    if (!category) {
      return res.status(404).json({ msg: 'Categoría no encontrada.' });
    }
    await category.destroy();
    res.json({ msg: 'Categoría eliminada exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar categoría de tutorial:', err.message);
    res.status(500).send('Error del servidor');
  }
};
