const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controllers');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Endpoints para gestionar eventos
 */

/**
 * @swagger
 * /eventos/crear:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/crear', authMiddleware(['docente', 'admin']), eventoController.crearEvento);

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Obtener todos los eventos públicos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 */
router.get('/', eventoController.obtenerEventos);

/**
 * @swagger
 * /eventos/{id}:
 *   put:
 *     summary: Actualizar un evento existente
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.put('/:id', authMiddleware(['docente', 'admin']), eventoController.actualizarEvento);

/**
 * @swagger
 * /eventos/{id}:
 *   delete:
 *     summary: Eliminar un evento por ID
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento a eliminar
 *     responses:
 *       200:
 *         description: Evento eliminado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/:id', authMiddleware(['docente', 'admin']), eventoController.eliminarEvento);

module.exports = router;
