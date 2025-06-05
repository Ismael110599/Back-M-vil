require('dotenv').config(); // ✅ Cargar variables de entorno primero
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Rutas API
const eventoRoutes = require('./src/routes/eventos.routes');
const usuarioRoutes = require('./src/routes/usuarios.routes');
const asistenciaRoutes = require('./src/routes/asistencia.routes');

const app = express();

// 🔌 Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// view engine setup (puedes quitar si no usas EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares generales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 📌 Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/asistencia', asistenciaRoutes);

// Capturar 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  res.status(err.status || 500);

  // Si es petición a la API, responde JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      error: err.message || 'Error interno del servidor'
    });
  }

  // Si es petición web, renderiza vista
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.render('error');
});

module.exports = app;
