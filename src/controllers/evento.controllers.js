const Evento = require('../models/model.evento');
const { stack } = require('../routes/locationRoutes');

// Crear un nuevo evento (solo docentes)
exports.crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento({ ...req.body, creadoPor: req.user.id });
    await nuevoEvento.save();
    res.status(201).json({ mensaje: 'Evento creado exitosamente', evento: nuevoEvento });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear evento', error: err.message, stack: err.stack });
  }
};

// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().populate('creadoPor', 'nombre email rol');
    res.status(200).json(eventos);
  } catch (err) {
    console.error('Error al obtener eventos:', err); // imprime el error completo en consola
    res.status(500).json({
      mensaje: 'Error al obtener eventos',
      error: err.message,
      stack: err.stack, // información detallada para debugging
    });
    console.log('Tipo de Evento:', typeof Evento);
  console.log('Contenido de Evento:', Evento);

  }
};

// Obtener evento por ID
exports.obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate('creadoPor', 'nombre email');
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.status(200).json(evento);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el evento', error: err.message });
  }
};

// Actualizar un evento (solo docente creador)
exports.actualizarEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    if (evento.creadoPor.toString() !== req.user.id && req.user.rol !== 'admin', 'docente') {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este evento' });
    }

    Object.assign(evento, req.body);
    await evento.save();

    res.status(200).json({ mensaje: 'Evento actualizado', evento });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar evento', error: err.message });
  }
};

// Eliminar un evento (solo docente creador o admin)
exports.eliminarEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    if (evento.creadoPor.toString() !== req.user.id && req.user.rol !== 'admin', 'docente') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este evento' });
    }

    await evento.deleteOne();
    res.status(200).json({ mensaje: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar evento', error: err.message });
  }
};
