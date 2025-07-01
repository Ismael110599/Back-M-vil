const Evento = require('../models/model.evento');
const Asistencia = require('../models/asistencia.model');
const { incrementMetric } = require("../utils/dashboard.metrics");

exports.registrarAsistencia = async (req, res) => {
  const { eventoId, latitud, longitud } = req.body;
  const estudianteId = req.user.id;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    // Validar que el estudiante no haya registrado asistencia previamente
    const asistenciaExistente = await Asistencia.findOne({
      estudiante: estudianteId,
      evento: eventoId,
    });
    if (asistenciaExistente) {
      return res.status(400).json({
        mensaje: 'El estudiante ya registró asistencia para este evento',
      });
    }

    const distancia = calcularDistancia(
      evento.ubicacion.latitud,
      evento.ubicacion.longitud,
      latitud,
      longitud
    );

    const dentroDelRango = distancia <= evento.rangoPermitido;

    const ahora = Date.now();
    const inicioEvento = new Date(evento.fechaInicio).getTime();

    let estado = 'presente';
    let pendienteDesde;

    if (!dentroDelRango) {
      if (ahora - inicioEvento <= 10 * 60 * 1000) {
        estado = 'pendiente';
        pendienteDesde = new Date();
      } else {
        estado = 'ausente';
      }
    }

    const asistencia = new Asistencia({
      estudiante: estudianteId,
      evento: eventoId,
      coordenadas: { latitud, longitud },
      dentroDelRango,
      estado,
      pendienteDesde
    });

    await asistencia.save();
    await incrementMetric("asistencias");
    res.status(201).json({
      mensaje: dentroDelRango ? 'Asistencia registrada' : estado === 'pendiente' ? 'Asistencia en espera' : 'Fuera del rango',
      asistencia
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar asistencia', error: err.message });
  }
};

// Fórmula Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
