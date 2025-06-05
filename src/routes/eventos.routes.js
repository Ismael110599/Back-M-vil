const express = require('express');
const router = express.Router();
// const auth = require('../middlewares/auth.middleware');
const { crearEvento } = require('../controllers/evento.controllers');

router.post('/', crearEvento);

module.exports = router;
