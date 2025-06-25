import swaggerAutogen from 'swagger-autogen';
import SwaggerAutogen from 'swagger-autogen';

const outfile = './swagger_output.json';
const endpointsFiles = ['./app.js'];

const doc = {
  info: {
    title: 'API de Geoasistencia',
    description: 'Documentación de la API de Geoasistencia',
  },
  host: 'localhost:80',
  schemes: ['http'],
}


swaggerAutogen()(outfile, endpointsFiles, doc);
