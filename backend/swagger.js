const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Hotel Booking API',
    description: 'API Documentation for the Hotel Booking Management System',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http'],
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
