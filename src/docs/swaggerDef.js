const swaggerJsDoc = require('swagger-jsdoc');


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Image Management API',
      version: '1.0.0',
      description: 'A simple Express Image Management API',
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  apis: ['src/routes/v1/*.js','src/docs/*.yml'], // Path to the API docs
};

const openapiSpecification = swaggerJsDoc(swaggerOptions);

module.exports={
  openapiSpecification
}
