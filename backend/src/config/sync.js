const sequelize = require('./database');

// Importar todos los modelos para que Sequelize conozca las asociaciones
require('../models/User');
require('../models/Plan');
require('../models/Subscription');
require('../models/Payment');
require('../models/Ticket');
require('../models/TicketMensaje');
require('../models/TutorialCategoria');
require('../models/Tutorial');
require('../models/Blog');

const Plan = require('../models/Plan'); // Re-importar Plan para usarlo en el seeder
const TutorialCategoria = require('../models/TutorialCategoria');
const Tutorial = require('../models/Tutorial');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Con alter: true, Sequelize intentará realizar cambios en las tablas existentes para que coincidan con los modelos
    await sequelize.sync(); 
    console.log('Base de datos sincronizada.');

    // Seeder de Planes
    // Solo insertar datos si la tabla está vacía para evitar duplicados en cada reinicio
    const planCount = await Plan.count();
    if (planCount === 0) {
      await Plan.bulkCreate([
        {
          nombre: 'Radio Básica',
          descripcion: 'Ideal para radios comunitarias y proyectos que inician.',
          precio_clp: 9990,
          precio_usd: 12.00,
          periodo: 'mensual',
          caracteristicas: ['Hasta 500 oyentes', '128 kbps Calidad de Audio', 'AutoDJ Básico', 'Soporte por Ticket'],
          estado: 'activo',
          categoria: 'Radio',
        },
        {
          nombre: 'Radio Profesional',
          descripcion: 'Para emisoras establecidas que buscan crecer.',
          precio_clp: 19990,
          precio_usd: 25.00,
          periodo: 'mensual',
          caracteristicas: ['Hasta 2000 oyentes', '192 kbps Calidad HD', 'AutoDJ Avanzado', 'App PWA Incluida', 'Soporte Prioritario'],
          estado: 'activo',
          categoria: 'Radio',
        },
        {
          nombre: 'TV Básica',
          descripcion: 'Perfecto para canales de TV online y transmisiones en vivo puntuales.',
          precio_clp: 24990,
          precio_usd: 30.00,
          periodo: 'mensual',
          caracteristicas: ['Hasta 100 espectadores', '720p Calidad HD', '50 GB Almacenamiento VOD', 'Soporte por Ticket'],
          estado: 'activo',
          categoria: 'TV',
        },
        {
          nombre: 'TV Profesional',
          descripcion: 'Solución completa para canales de TV 24/7 y productoras.',
          precio_clp: 49990,
          precio_usd: 60.00,
          periodo: 'mensual',
          caracteristicas: ['Hasta 1000 espectadores', '1080p Calidad Full HD', '200 GB Almacenamiento VOD', 'Playout 24/7', 'Soporte Dedicado'],
          estado: 'activo',
          categoria: 'TV',
        },
      ]);
      console.log('Datos de planes de ejemplo insertados.');
    }

    // Importar modelos necesarios para el seeder de prueba
    const User = require('../models/User');
    const Subscription = require('../models/Subscription');
    const Payment = require('../models/Payment');
    const bcrypt = require('bcryptjs'); // Para hashear la contraseña del usuario de prueba

    // Seeder de Usuario de Prueba y Suscripciones
    const userCount = await User.count();
    if (userCount === 0) {
      // Crear usuario de prueba
      const hashedPassword = await bcrypt.hash('password123', 10);
      const testUser = await User.create({
        nombre: 'Usuario de Prueba',
        email: 'test@example.com',
        contrasena: hashedPassword,
        pais: 'Chile',
        moneda_preferida: 'CLP',
        rol: 'cliente',
      });
      console.log('Usuario de prueba creado: test@example.com / password123');

      // Obtener planes existentes
      const radioBasicaPlan = await Plan.findOne({ where: { nombre: 'Radio Básica' } });
      const tvProfesionalPlan = await Plan.findOne({ where: { nombre: 'TV Profesional' } });
      const radioProfesionalPlan = await Plan.findOne({ where: { nombre: 'Radio Profesional' } });

      if (radioBasicaPlan && tvProfesionalPlan && radioProfesionalPlan) {
        // Suscripción Activa (futura renovación)
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1); // Renueva el próximo mes
        const sub1 = await Subscription.create({
          usuario_id: testUser.id,
          plan_id: radioBasicaPlan.id,
          metodo_pago: 'paypal',
          monto: radioBasicaPlan.precio_clp,
          moneda: 'CLP',
          estado: 'activa',
          fecha_inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Inició hace un mes
          fecha_renovacion: futureDate,
          nombre_proyecto: 'Mi Radio FM Online',
        });
        await Payment.create({
          usuario_id: testUser.id,
          suscripcion_id: sub1.id,
          plan_id: radioBasicaPlan.id,
          metodo: 'paypal',
          monto: radioBasicaPlan.precio_clp,
          moneda: 'CLP',
          estado: 'aprobado',
          nombre_proyecto: 'Mi Radio FM Online',
        });
        console.log('Suscripción activa de prueba creada.');

        // Suscripción Vencida (pago atrasado)
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 2); // Venció hace un mes
        const sub2 = await Subscription.create({
          usuario_id: testUser.id,
          plan_id: tvProfesionalPlan.id,
          metodo_pago: 'mercadopago',
          monto: tvProfesionalPlan.precio_clp,
          moneda: 'CLP',
          estado: 'activa', // Aún activa pero vencida
          fecha_inicio: new Date(new Date().setMonth(new Date().getMonth() - 3)), // Inició hace tres meses
          fecha_renovacion: pastDate,
          nombre_proyecto: 'TV Canal Local HD',
        });
        await Payment.create({
          usuario_id: testUser.id,
          suscripcion_id: sub2.id,
          plan_id: tvProfesionalPlan.id,
          metodo: 'mercadopago',
          monto: tvProfesionalPlan.precio_clp,
          moneda: 'CLP',
          estado: 'aprobado',
          nombre_proyecto: 'TV Canal Local HD',
        });
        console.log('Suscripción vencida de prueba creada.');

        // Suscripción Activa sin nombre_proyecto (para compatibilidad)
        const futureDate2 = new Date();
        futureDate2.setMonth(futureDate2.getMonth() + 2); // Renueva en dos meses
        const sub3 = await Subscription.create({
          usuario_id: testUser.id,
          plan_id: radioProfesionalPlan.id,
          metodo_pago: 'flow',
          monto: radioProfesionalPlan.precio_clp,
          moneda: 'CLP',
          estado: 'activa',
          fecha_inicio: new Date(new Date().setMonth(new Date().getMonth() - 2)),
          fecha_renovacion: futureDate2,
          nombre_proyecto: null, // Sin nombre de proyecto
        });
        await Payment.create({
          usuario_id: testUser.id,
          suscripcion_id: sub3.id,
          plan_id: radioProfesionalPlan.id,
          metodo: 'flow',
          monto: radioProfesionalPlan.precio_clp,
          moneda: 'CLP',
          estado: 'aprobado',
          nombre_proyecto: null,
        });
        console.log('Suscripción activa sin nombre de proyecto de prueba creada.');
      } else {
        console.warn('No se encontraron planes para crear suscripciones de prueba.');
      }
    }

    // Seeder de Categorías de Tutoriales
    const tutorialCategoryCount = await TutorialCategoria.count();
    if (tutorialCategoryCount === 0) {
      const [cat1, cat2, cat3] = await TutorialCategoria.bulkCreate([
        { nombre: 'Primeros Pasos' },
        { nombre: 'Configuración Avanzada' },
        { nombre: 'Monetización' },
      ], { returning: true });
      console.log('Datos de categorías de tutoriales de ejemplo insertados.');

      // Seeder de Tutoriales
      const tutorialCount = await Tutorial.count();
      if (tutorialCount === 0) {
        await Tutorial.bulkCreate([
          {
            titulo: 'Cómo crear tu primera radio online',
            descripcion: 'Aprende los pasos básicos para poner tu radio en línea en minutos.',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            categoria_id: cat1.id,
          },
          {
            titulo: 'Configurar AutoDJ para tu emisora',
            descripcion: 'Automatiza tu programación musical con nuestro potente AutoDJ.',
            video_url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
            categoria_id: cat2.id,
          },
          {
            titulo: 'Integrar tu reproductor web',
            descripcion: 'Añade fácilmente nuestro reproductor HTML5 a tu sitio web.',
            video_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
            categoria_id: cat1.id,
          },
        ]);
        console.log('Datos de tutoriales de ejemplo insertados.');
      }
    }

  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  } finally {
    // await sequelize.close(); // Eliminar esta línea
    // console.log('Conexión a la base de datos cerrada (comentada para mantenerla abierta).'); // Eliminar esta línea
  }
}

// Exportar la función para que pueda ser llamada desde index.js
module.exports = syncDatabase;
