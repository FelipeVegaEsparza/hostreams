const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para la subida de imágenes del blog
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// @route   GET api/blog
// @desc    Obtener todas las entradas del blog
// @access  Public
router.get('/', blogController.getAllBlogPosts);

// @route   GET api/blog/:id
// @desc    Obtener una entrada del blog por ID
// @access  Public
router.get('/:id', blogController.getBlogPostById);

// @route   POST api/blog
// @desc    Crear una nueva entrada del blog (solo admin)
// @access  Private (Admin)
router.post('/', auth, admin, upload.single('image'), blogController.createBlogPost);

// @route   PUT api/blog/:id
// @desc    Actualizar una entrada del blog existente (solo admin)
// @access  Private (Admin)
router.put('/:id', auth, admin, upload.single('image'), blogController.updateBlogPost);

// @route   DELETE api/blog/:id
// @desc    Eliminar una entrada del blog (solo admin)
// @access  Private (Admin)
router.delete('/:id', auth, admin, blogController.deleteBlogPost);

module.exports = router;