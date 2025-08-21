const cron = require('node-cron');
const Asistencia = require('../models/asistencia.model');

// Revisa cada minuto las asistencias pendientes y marca ausente si se superó el tiempo de gracia
cron.schedule('* * * * *', async () => {
  try {
    const limite = new Date(Date.now() - 10 * 60 * 1000);
    const pendientes = await Asistencia.find({
      estado: 'Pendiente',
      createdAt: { $lte: limite }
    });
    for (const asistencia of pendientes) {
      asistencia.estado = 'Ausente';
      await asistencia.save();
    }
  } catch (error) {
    console.error('Error en cron de asistencias:', error);
  }
});
