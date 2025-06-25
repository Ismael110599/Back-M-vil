const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Asistencia y Usuarios',
      version: '1.0.0',
      description: 'Documentación de la API para asistencia, eventos y usuarios.',
      contact: {
        name: 'Anonimo',
        email: 'anonimo@anonimo.com',
      },
    },
    servers: [
      {
        url: 'http://54.210.246.199', // Cambia si usas otro puerto
      },
    ],
  },
  apis: ['./src/routes/*.js'], // <- Aquí lee tus rutas para documentación
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
