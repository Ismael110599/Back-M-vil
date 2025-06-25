/**
 * @swagger
 * tags:
 *   name: Asistencia
 *   description: API para gestionar la asistencia
 */

/**
 * @swagger
 * /asistencia/registrar:
 *   post:
 *     summary: Registrar asistencia (solo estudiantes)
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: '2025-06-25'
 *               claseId:
 *                 type: string
 *                 example: 'abc123'
 *             required:
 *               - fecha
 *               - claseId
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: 'Asistencia registrada correctamente'
 *       400:
 *         description: Solicitud inválida (faltan datos o formato incorrecto)
 *       401:
 *         description: No autorizado (token inválido o usuario sin permiso)
 *       500:
 *         description: Error interno del servidor
 */



const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistencia.controllers');
const authMiddleware = require('../middlewares/auth');

// Solo estudiantes
router.post('/registrar', authMiddleware(['estudiante']), asistenciaController.registrarAsistencia);

module.exports = router;
