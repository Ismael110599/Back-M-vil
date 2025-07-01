const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  ubicacion: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
  },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  rangoPermitido: { type: Number, default: 100 },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema);
