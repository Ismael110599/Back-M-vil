const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth');

// Obtener todas las metricas
router.get('/metrics', auth(['admin','docente']), controller.getMetrics);
// Actualizar o crear una metrica
router.post('/metrics', auth(['admin','docente']), controller.updateMetric);

module.exports = router;
