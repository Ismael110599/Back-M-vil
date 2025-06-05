const Asistencia = require('../models/asistencia.model');
const Evento = require('../models/model.evento');
const { isWithinRange } = require('../utils/geo.util');

exports.marcarAsistencia = async (req, res) => {
  try {
    const { eventoId, lat, lng } = req.body;
    const evento = await Evento.findById(eventoId);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });

    const enRango = isWithinRange(
      { latitude: lat, longitude: lng },
      {
        latitude: evento.ubicacion.latitud,
        longitude: evento.ubicacion.longitud
      }
    );

    if (!enRango) {
      return res.status(403).json({ mensaje: 'Fuera del rango permitido' });
    }

    const asistencia = new Asistencia({
      estudiante: req.user.id,
      evento: evento._id,
      latitud: lat,
      longitud: lng
    });

    await asistencia.save();
    res.json({ mensaje: 'Asistencia registrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
