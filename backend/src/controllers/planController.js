const Plan = require('../models/Plan');

// Obtener planes activos, opcionalmente filtrados por categoría
exports.getPlans = async (req, res) => {
  try {
    const { categoria } = req.query;
    const whereClause = { estado: 'activo' };

    if (categoria) {
      whereClause.categoria = categoria;
    }

    const plans = await Plan.findAll({ where: whereClause });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Obtener TODOS los planes (para el admin)
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Obtener un plan por ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Crear un nuevo plan (solo admin)
exports.createPlan = async (req, res) => {
  const { nombre, descripcion, precio_clp, precio_usd, periodo, caracteristicas, estado, categoria } = req.body;
  try {
    const newPlan = await Plan.create({
      nombre,
      descripcion,
      precio_clp,
      precio_usd,
      periodo,
      caracteristicas, // El modelo ahora espera un JSON, no un string
      estado,
      categoria,
    });
    res.status(201).json(newPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar un plan existente (solo admin)
exports.updatePlan = async (req, res) => {
  const { nombre, descripcion, precio_clp, precio_usd, periodo, caracteristicas, estado, categoria } = req.body;
  try {
    let plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    plan.nombre = nombre;
    plan.descripcion = descripcion;
    plan.precio_clp = precio_clp;
    plan.precio_usd = precio_usd;
    plan.periodo = periodo;
    plan.caracteristicas = caracteristicas;
    plan.estado = estado;
    plan.categoria = categoria;

    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Eliminar un plan (solo admin)
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan no encontrado' });
    }

    await plan.destroy();
    res.json({ msg: 'Plan eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};