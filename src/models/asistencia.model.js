const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  estudiante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento',
    required: true,
  },
  fecha: { type: Date, default: Date.now },
  latitud: Number,
  longitud: Number,
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
