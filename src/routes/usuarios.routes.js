const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion } = require('../controllers/usuarios.controller');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestión de cuentas de usuario
 */

/**
 * @swagger
 * /usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *             required:
 *               - nombre
 *               - correo
 *               - contrasena
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación o usuario ya existe
 */
router.post('/registro', registrarUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión con credenciales de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *             required:
 *               - correo
 *               - contrasena
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso (devuelve token u objeto de usuario)
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', iniciarSesion);

module.exports = router;
