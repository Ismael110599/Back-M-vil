const Evento = require('../models/model.evento');
const { incrementMetric } = require("../utils/dashboard.metrics");

// Crear un nuevo evento (solo docentes)
exports.crearEvento = async (req, res) => {
  try {
    const {
      nombre,
      tipo,
      fechaInicio,
      fechaFin,
      lugar,
      descripcion,
      capacidadMaxima,
      coordenadas,
      politicasAsistencia
    } = req.body;


    // Validación básica
    if (
      !nombre ||
      !tipo ||
      !lugar ||
      !coordenadas?.latitud ||
      !coordenadas?.longitud ||
      !fechaInicio ||
      !fechaFin
    ) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios del evento' });
    }

    const nuevoEvento = new Evento({
      nombre,
      tipo,
      descripcion,
      lugar,
      capacidadMaxima,
      creadorId: req.user.id,
      coordenadas: {
        latitud: parseFloat(coordenadas.latitud),
        longitud: parseFloat(coordenadas.longitud),
        radio: coordenadas.radio || 100
      },
      politicasAsistencia,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin)
    });

    await nuevoEvento.save();
    await incrementMetric("eventos");

    res.status(201).json({
      mensaje: 'Evento creado exitosamente',
      evento: nuevoEvento
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al crear evento',
      error: err.message,
      stack: err.stack
    });
  }
};


// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find({ estado: 'activo' }).populate('creadorId', 'nombre email rol');
    res.status(200).json(eventos);
  } catch (err) {
    console.error('Error al obtener eventos:', err); // imprime el error completo en consola
    res.status(500).json({
      mensaje: 'Error al obtener eventos',
      error: err.message,
      stack: err.stack, // información detallada para debugging
    });

    }
};

// Obtener evento por ID
exports.obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findOne({ _id: req.params.id, estado: 'activo' }).populate('creadorId', 'nombre email');
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
    if (!evento || evento.estado !== 'activo') {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    // Verificar permisos
    if (evento.creadorId.toString() !== req.user.id && req.user.rol !== 'admin' && req.user.rol !== 'docente') {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este evento' });
    }

    const {
      nombre,
      tipo,
      fechaInicio,
      fechaFin,
      lugar,
      descripcion,
      capacidadMaxima,
      coordenadas,
      politicasAsistencia,
      estado
    } = req.body;

    // Actualizar solo campos válidos
    if (nombre !== undefined) evento.nombre = nombre;
    if (tipo !== undefined) evento.tipo = tipo;
    if (lugar !== undefined) evento.lugar = lugar;
    if (descripcion !== undefined) evento.descripcion = descripcion;
    if (capacidadMaxima !== undefined) evento.capacidadMaxima = capacidadMaxima;
    if (coordenadas?.latitud !== undefined) evento.coordenadas.latitud = parseFloat(coordenadas.latitud);
    if (coordenadas?.longitud !== undefined) evento.coordenadas.longitud = parseFloat(coordenadas.longitud);
    if (coordenadas?.radio !== undefined) evento.coordenadas.radio = parseFloat(coordenadas.radio);
    if (politicasAsistencia) {
      evento.politicasAsistencia = { ...evento.politicasAsistencia, ...politicasAsistencia };
    }
    if (fechaInicio !== undefined) evento.fechaInicio = new Date(fechaInicio);
    if (fechaFin !== undefined) evento.fechaFin = new Date(fechaFin);
    if (estado !== undefined) evento.estado = estado;

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
    if (!evento || evento.estado !== 'activo') return res.status(404).json({ mensaje: 'Evento no encontrado' });

    if (evento.creadorId.toString() !== req.user.id && req.user.rol !== 'admin' && req.user.rol !== 'docente') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este evento' });
    }

    evento.estado = 'cancelado';
    await evento.save();
    await incrementMetric("eventos", -1);
    res.status(200).json({ mensaje: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar evento', error: err.message });
  }
};
