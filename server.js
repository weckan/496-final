"use strict";
// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
var cors = require("cors");

// Database connect
const database = require('./config/database');
mongoose.connect(database.url);
const db = mongoose.connection;
db.on('error', () => console.log ('error connecting to MongoDB'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  
  // Express
  const app = express();
  // app.use(expressSession({secret: 'mySecretKey'}));
  app.use(flash());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  
  // Routes
  app.use('/api', require('./routes/api'));
  app.use (express.static(__dirname+'/public'));
  
  // Start server
  var port = (process.env.NODE_ENV ? 3000 : 8080)
  app.listen(port);
  console.log('API is running on port ' + port);
});
