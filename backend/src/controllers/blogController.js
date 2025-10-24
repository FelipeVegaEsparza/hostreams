const Blog = require('../models/Blog');

// Obtener todas las entradas del blog
exports.getAllBlogPosts = async (req, res) => {
  try {
    const posts = await Blog.findAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las entradas del blog', error: error.message });
  }
};

// Obtener una entrada del blog por ID
exports.getBlogPostById = async (req, res) => {
  try {
    const post = await Blog.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Entrada del blog no encontrada' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la entrada del blog', error: error.message });
  }
};

// Crear una nueva entrada del blog
exports.createBlogPost = async (req, res) => {
  try {
    const { title, shortDescription, longDescription } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Asumiendo que multer guarda en /uploads

    const newPost = await Blog.create({
      title,
      shortDescription,
      longDescription,
      imageUrl,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la entrada del blog', error: error.message });
  }
};

// Actualizar una entrada del blog existente
exports.updateBlogPost = async (req, res) => {
  try {
    const { title, shortDescription, longDescription } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl; // Si se sube nueva imagen, usarla, sino mantener la existente o la que viene en el body

    const [updated] = await Blog.update({
      title,
      shortDescription,
      longDescription,
      imageUrl,
    }, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedPost = await Blog.findByPk(req.params.id);
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: 'Entrada del blog no encontrada para actualizar' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la entrada del blog', error: error.message });
  }
};

// Eliminar una entrada del blog
exports.deleteBlogPost = async (req, res) => {
  try {
    const deleted = await Blog.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: 'Entrada del blog eliminada' });
    } else {
      res.status(404).json({ message: 'Entrada del blog no encontrada para eliminar' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la entrada del blog', error: error.message });
  }
};
