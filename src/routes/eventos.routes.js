const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controllers');
const authMiddleware = require('../middlewares/auth');

// Solo docentes
router.post('/crear', authMiddleware(['docente', 'admin']), eventoController.crearEvento);

// Público
router.get('/', eventoController.obtenerEventos);

// Actualizar evento
router.put('/:id', authMiddleware(['docente', 'admin']), eventoController.actualizarEvento);

// Eliminar evento
router.delete('/:id', authMiddleware(['docente', 'admin']), eventoController.eliminarEvento);


module.exports = router;
