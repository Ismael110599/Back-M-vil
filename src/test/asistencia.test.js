const assert = require('assert');

// ---- Mock dependencies ----
let fakeEvento;
class FakeAsistencia {
  constructor(data) {
    Object.assign(this, data);
    this.createdAt = data.createdAt || new Date(Date.now());
    this.save = async () => {
      this.saved = true;
      this._id = this._id || `a${FakeAsistencia.store.length + 1}`;
      if (!FakeAsistencia.store.includes(this)) {
        FakeAsistencia.store.push(this);
      }
    };
  }
  static store = [];
  static async findOne(query) {
    return FakeAsistencia.store.find(a =>
      a.estudiante === query.estudiante && a.evento === query.evento
    ) || null;
  }
  static async find(query) {
    if (query.estado === 'Pendiente' && query.createdAt?.$lte) {
      return FakeAsistencia.store.filter(a =>
        a.estado === 'Pendiente' && a.createdAt <= query.createdAt.$lte
      );
    }
    return [];
  }
}

const fakeEventoModel = {
  async findOne(query) {
    if (query._id === fakeEvento._id && fakeEvento.estado === 'activo') {
      return fakeEvento;
    }
    return null;
  },
  async findByIdAndUpdate(id, update) {
    if (id === fakeEvento._id) {
      fakeEvento.participantesRegistrados = fakeEvento.participantesRegistrados || [];
      const asistenciaId = update.$addToSet?.participantesRegistrados;
      if (asistenciaId && !fakeEvento.participantesRegistrados.includes(asistenciaId)) {
        fakeEvento.participantesRegistrados.push(asistenciaId);
      }
      return fakeEvento;
    }
    return null;
  }
};

const noopMetrics = { incrementMetric: async () => {}, incrementEventMetric: async () => {} };

const path = require('path');
require.cache[path.resolve(__dirname, '../models/model.evento.js')] = { exports: fakeEventoModel };
require.cache[path.resolve(__dirname, '../models/asistencia.model.js')] = { exports: FakeAsistencia };
require.cache[path.resolve(__dirname, '../utils/dashboard.metrics.js')] = { exports: { incrementMetric: noopMetrics.incrementMetric } };
require.cache[path.resolve(__dirname, '../utils/event.metrics.js')] = { exports: { incrementEventMetric: noopMetrics.incrementEventMetric } };

let scheduledTask;
const cronPath = require.resolve('node-cron');
require.cache[cronPath] = { exports: { schedule: (expr, fn) => { scheduledTask = fn; return { start() {}, stop() {} }; } } };

// Require controller and cron after mocks
const { registrarAsistencia } = require('../controllers/asistencia.controller');
require('../cron/asistenciaCron');

(async () => {
  const originalNow = Date.now;

  // Escenario A: Dentro del área
  FakeAsistencia.store = [];
  fakeEvento = {
    _id: 'evento1',
    estado: 'activo',
    coordenadas: { latitud: 0, longitud: 0, radio: 100 },
    fechaInicio: new Date('2024-01-01T00:00:00Z'),
    horaInicio: '10:00',
    participantesRegistrados: []
  };
  Date.now = () => new Date('2024-01-01T10:05:00Z').getTime();

  const reqA = { body: { eventoId: 'evento1', latitud: 0, longitud: 0 }, user: { id: 'est1' } };
  const resA = { status(c){ this.statusCode = c; return this; }, json(o){ this.body = o; } };
  await registrarAsistencia(reqA, resA);
  assert.strictEqual(resA.statusCode, 201);
  assert.strictEqual(resA.body.asistencia.estado, 'Presente');
  assert.ok(resA.body.mensaje.includes('Asistencia registrada correctamente'));
  assert.strictEqual(fakeEvento.participantesRegistrados.length, 1);
  assert.strictEqual(fakeEvento.participantesRegistrados[0], resA.body.asistencia._id);

  // Escenario B: Fuera del área dentro de 10 minutos
  FakeAsistencia.store = [];
  fakeEvento.participantesRegistrados = [];
  Date.now = () => new Date('2024-01-01T10:09:00Z').getTime();
  const reqB = { body: { eventoId: 'evento1', latitud: 0.002, longitud: 0 }, user: { id: 'est1' } };
  const resB = { status(c){ this.statusCode = c; return this; }, json(o){ this.body = o; } };
  await registrarAsistencia(reqB, resB);
  assert.strictEqual(resB.body.asistencia.estado, 'Pendiente');
  assert.ok(resB.body.mensaje.includes('fuera del área'));

  // Escenario C: Fuera del área y pasado 10 minutos
  FakeAsistencia.store = [];
  fakeEvento.participantesRegistrados = [];
  Date.now = () => new Date('2024-01-01T10:15:00Z').getTime();
  const reqC = { body: { eventoId: 'evento1', latitud: 0.002, longitud: 0 }, user: { id: 'est1' } };
  const resC = { status(c){ this.statusCode = c; return this; }, json(o){ this.body = o; } };
  await registrarAsistencia(reqC, resC);
  assert.strictEqual(resC.body.asistencia.estado, 'Ausente');
  assert.ok(resC.body.mensaje.includes('Ausente'));

  // Escenario D: Cron job convierte Pendiente a Ausente
  FakeAsistencia.store = [
    { _id: 'a1', estado: 'Pendiente', createdAt: new Date('2024-01-01T10:00:00Z'), save: async function(){ this.saved = true; } },
    { _id: 'a2', estado: 'Pendiente', createdAt: new Date('2024-01-01T10:08:00Z'), save: async function(){ this.saved = true; } }
  ];
  Date.now = () => new Date('2024-01-01T10:15:00Z').getTime();
  await scheduledTask();
  assert.strictEqual(FakeAsistencia.store[0].estado, 'Ausente');
  assert.strictEqual(FakeAsistencia.store[1].estado, 'Pendiente');

  Date.now = originalNow;
  console.log('✅ Pruebas de asistencia completadas');
  process.exit(0);
})();

