require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar rutas
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/paypal');
const contactRoutes = require('./routes/contact');
const ticketRoutes = require('./routes/tickets');
const tutorialCategoryRoutes = require('./routes/tutorialCategory'); // Nueva ruta
const tutorialRoutes = require('./routes/tutorials'); // Nueva ruta
const manualPaymentRoutes = require('./routes/manualPayment'); // Importar rutas de pagos manuales
const userRoutes = require('./routes/users'); // Importar rutas de usuarios
const blogRoutes = require('./routes/blog'); // Importar rutas del blog
const flowRoutes = require('./routes/flow'); // Importar rutas de Flow.cl

app.use(express.json());
app.use(cors());

// Servir archivos estáticos (si es necesario, ej. para comprobantes de pago)
app.use('/uploads', express.static('uploads'));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API de Hostreams funcionando!');
});

// Usar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes); // Cambiar a /api/admin/users
app.use('/api/plans', planRoutes);
app.use('/api/admin/subscriptions', subscriptionRoutes); // Cambiar a /api/admin/subscriptions
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tutorial-categorias', tutorialCategoryRoutes); // Usar la nueva ruta
app.use('/api/tutoriales', tutorialRoutes); // Usar la nueva ruta
app.use('/api/manual-payment', manualPaymentRoutes); // Usar rutas de pagos manuales
app.use('/api/blog', blogRoutes); // Usar rutas del blog
app.use('/api/flow', flowRoutes); // Usar rutas de Flow.cl

// Sincronizar base de datos y luego iniciar el servidor
const syncDatabase = require('./config/sync');

async function startServer() {
  try {
    await syncDatabase(); // Esperar a que la base de datos se sincronice

    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1); // Salir con un código de error si falla la sincronización o el inicio del servidor
  }
}

startServer();