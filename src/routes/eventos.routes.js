const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controllers');
const authMiddleware = require('../middlewares/auth');

router.post('/crear', authMiddleware(['docente', 'admin']), eventoController.crearEvento);

router.get('/', eventoController.obtenerEventos);

router.put('/:id', authMiddleware(['docente', 'admin']), eventoController.actualizarEvento);

router.delete('/:id', authMiddleware(['docente', 'admin']), eventoController.eliminarEvento);

module.exports = router;
