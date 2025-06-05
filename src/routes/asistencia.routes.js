const express = require('express');
const router = express.Router();
// const auth = require('../middlewares/auth.middleware');
const { marcarAsistencia } = require('../controllers/asistencia.controllers');

router.post('/marcar', marcarAsistencia);

module.exports = router;
