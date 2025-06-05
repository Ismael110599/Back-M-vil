const Evento = require('../models/model.evento');

exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, ubicacion, fechaInicio, fechaFin } = req.body;
    const evento = new Evento({
      titulo,
      descripcion,
      ubicacion,
      fechaInicio,
      fechaFin,
      creadoPor: req.user.id
    });
    await evento.save();
    res.status(201).json({ mensaje: 'Evento creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
