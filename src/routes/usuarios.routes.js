const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion, actualizarUsuario } = require('../controllers/usuarios.controller');
const auth =  require('../middlewares/auth');

router.post('/registrar', registrarUsuario);

router.post('/login', iniciarSesion);

router.put('/:id', auth(['estudiante', 'docente', 'admin']), actualizarUsuario);

module.exports = router;
