"use strict";

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var cors = require('cors'); // Import routes


var authRoutes = require('./routes/authRoutes');

var userRoutes = require('./routes/userRoutes');

var postingRoutes = require('./routes/postingRoutes');

var roomRoutes = require('./routes/roomRoutes');

var buildingRoutes = require('./routes/buildingRoutes');

var notiRoutes = require('./routes/notiRoutes');

var postingCommentRoutes = require('./routes/postingCommentRoutes');

app.use(cors()); // Set up Swagger UI

var swaggerUi = require('swagger-ui-express');

var swaggerDocument = require('./swagger.json'); // Call setSwaggerUI to set up Swagger UI


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Body parser middleware

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); // Set up routes

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', postingRoutes);
app.use('/', roomRoutes);
app.use('/', buildingRoutes);
app.use('/', notiRoutes);
app.use('/', postingCommentRoutes); // Set up error handling middleware
// app.use(errorHandler);

module.exports = app;