//Import libraries
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
//CRUD Operations Mongo
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const covidOperationsRoute = require('./routes/covid-operations');
//Import Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//Call vars of .env
dotenv.config();

//Enable Cors
app.use(cors());

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('connected to db!');
});

//Swagger defintions
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Covid API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'apiKey',
          in: 'header',
          name: 'auth-token',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(swaggerOptions);

//Middlewares
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

//Route Middelwares
app.use('/api/user', authRoute);
app.use('/api/covid', covidOperationsRoute);

//Listen port
app.listen(3000, () => console.log('Server up and running'));
