const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  iniciarSesion,
  actualizarUsuario,
  obtenerPerfil,
  verificarCorreo,
  listarDocentes,
  cambiarEstadoUsuario,
  buscarUsuarios,
  eliminarUsuario,
  obtenerEstadisticasUsuarios,
  editarPerfilCompleto,
  perfilDetallado
} = require('../controllers/usuarios.controller');
const auth =  require('../middlewares/auth');

router.post('/registrar', registrarUsuario);

router.post('/verificar-correo', verificarCorreo);

router.post('/login', iniciarSesion);

router.get('/perfil/:id', obtenerPerfil);


router.put('/:id', auth(['estudiante', 'docente', 'admin']), actualizarUsuario);

// Nuevas rutas de gestión de usuarios
router.get('/docentes', auth(['admin']), listarDocentes);
router.put('/:id/estado', auth(['admin']), cambiarEstadoUsuario);
router.get('/buscar', auth(['admin', 'docente']), buscarUsuarios);
router.delete('/:id', auth(['admin']), eliminarUsuario);
router.get('/estadisticas', auth(['admin']), obtenerEstadisticasUsuarios);
router.put('/:id/perfil-completo', auth(['admin', 'docente', 'estudiante']), editarPerfilCompleto);
router.get('/perfil/:id/detallado', auth(['admin', 'docente', 'estudiante']), perfilDetallado);

module.exports = router;
