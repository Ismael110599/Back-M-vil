/**
 * @swagger
 * tags:
 *   name: Location
 *   description: API para gestionar la ubicación del usuario
 */

/**
 * @swagger
 * /api/location/update:
 *   post:
 *     summary: Actualizar la ubicación del usuario
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "123456"
 *                 description: ID del usuario a actualizar
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -0.180653
 *                 description: Latitud de la ubicación
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: -78.467834
 *                 description: Longitud de la ubicación
 *             required:
 *               - userId
 *               - latitude
 *               - longitude
 *     responses:
 *       200:
 *         description: Ubicación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ubicación actualizada exitosamente"
 *       400:
 *         description: Solicitud inválida (datos faltantes o erróneos)
 *       500:
 *         description: Error interno del servidor
 */


// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.Controller');

// POST /api/location/update
router.post('/update', locationController.updateUserLocation);

module.exports = router;
