const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['seminario', 'clase', 'conferencia'],
    required: [true, 'El tipo de evento es obligatorio']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria']
  },
  fechaFin: {
    type: Date,
    required: [true, 'La fecha de fin es obligatoria']
  },
  lugar: {
    type: String,
    required: [true, 'El lugar es obligatorio']
  },
  descripcion: String,
  capacidadMaxima: Number,
  creadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El creador del evento es obligatorio']
  },
  coordenadas: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true },
    radio: { type: Number, default: 100 }
  },
  politicasAsistencia: {
    tiempoGracia: { type: Number, default: 5 },
    maximoSalidas: { type: Number, default: 2 },
    tiempoLimiteSalida: { type: Number, default: 15 },
    verificacionContinua: { type: Boolean, default: false },
    requiereJustificacion: { type: Boolean, default: true }
  },
  estado: {
    type: String,
    enum: ['activo', 'finalizado', 'cancelado'],
    default: 'activo'
  },
  participantesRegistrados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  fechaCreacion: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema);
