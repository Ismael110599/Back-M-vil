const express = require('express');
const router = express.Router();
const auth =  require('../middlewares/auth');

router.post('/registrar', registrarUsuario);

router.post('/docente/enviar-codigo', enviarCodigoDocente);

router.post('/verificar-correo', verificarCorreo);

router.post('/login', iniciarSesion);

router.get('/perfil/:id', obtenerPerfil);

router.get('/docentes', auth(['admin']), listarDocentes);


router.put('/:id', auth(['estudiante', 'docente', 'admin']), actualizarUsuario);

module.exports = router;
