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
  hora: {
    type: Date,
    default: Date.now,
  },
  coordenadas: {
    latitud: {
      type: Number,
      required: true,
    },
    longitud: {
      type: Number,
      required: true,
    },
  },
  dentroDelRango: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true // Opcional: agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
