const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (solo admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['contrasena'] } // Excluir la contraseña por seguridad
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Actualizar un usuario (solo admin)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, pais, moneda_preferida } = req.body;

  try {
    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.rol = rol || user.rol;
    user.pais = pais || user.pais;
    user.moneda_preferida = moneda_preferida || user.moneda_preferida;

    await user.save();

    res.json({ msg: 'Usuario actualizado correctamente', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Eliminar un usuario (solo admin)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await user.destroy();

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// Cambiar la contraseña de un usuario (solo admin)
exports.changeUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
