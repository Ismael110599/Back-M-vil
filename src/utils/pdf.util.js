const PDFDocument = require('pdfkit');

async function generateEventPDFBase64(evento, metrics = []) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer.toString('base64'));
      });

      doc.fontSize(18).text('Reporte de Evento', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Nombre: ${evento.nombre}`);
      doc.text(`Tipo: ${evento.tipo}`);
      if (evento.fechaInicio) doc.text(`Fecha Inicio: ${new Date(evento.fechaInicio).toLocaleString()}`);
      if (evento.fechaFin) doc.text(`Fecha Fin: ${new Date(evento.fechaFin).toLocaleString()}`);
      if (evento.horaInicio) doc.text(`Hora Inicio: ${evento.horaInicio}`);
      if (evento.horaFin) doc.text(`Hora Fin: ${evento.horaFin}`);
      doc.text(`Lugar: ${evento.lugar}`);
      if (evento.descripcion) doc.text(`Descripcion: ${evento.descripcion}`);
      doc.moveDown();

      if (metrics && Array.isArray(metrics) && metrics.length) {
        doc.text('Métricas Dashboard:', { underline: true });
        metrics.forEach(m => {
          doc.text(`${m.metric}: ${m.value}`);
        });
      } else if (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) {
        doc.text('Métricas Evento:', { underline: true });
        if (metrics.dentroDelRango !== undefined) {
          doc.text(`Dentro del rango: ${metrics.dentroDelRango}`);
        }
        if (metrics.fueraDelRango !== undefined) {
          doc.text(`Fuera del rango: ${metrics.fueraDelRango}`);
        }
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateEventPDFBase64 };
