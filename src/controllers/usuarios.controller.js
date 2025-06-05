const Usuario = require('../models/Model.user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;
    console.log('[Registro] Datos recibidos:', { nombre, correo, rol });

    const hashed = await bcrypt.hash(contrasena, 10);
    console.log('[Registro] Contraseña encriptada');

    const nuevoUsuario = new Usuario({ nombre, correo, contrasena: hashed, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error('[Registro] Error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.iniciarSesion = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValido) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
