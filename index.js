const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
//Import Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('connected to db!');
});

//Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Covid API',
      version: '1.0.0',
    },
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
app.use('/api/posts', postRoute);

//Listen port
app.listen(3000, () => console.log('Server up and running'));
