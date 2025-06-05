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
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evento', eventoSchema);
