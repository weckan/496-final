"use strict";
// Dependencies
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

// Models
const GardenCrops = require('../models/gardenCrops');
const Gardens = require('../models/gardens');
const Users = require('../models/users');

// Routes
Gardens.methods(['get', 'put', 'post', 'delete']);
Gardens.before('post', validateAPIKey);
Gardens.before('put', validateAPIKey);
Gardens.before('delete', validateAPIKey);
Gardens.register(router, '/gardens');

GardenCrops.methods(['get', 'put', 'post', 'delete']);
GardenCrops.before('post', validateAPIKey);
GardenCrops.before('put', validateAPIKey);
GardenCrops.before('delete', validateAPIKey);
GardenCrops.route('gardens', {
    detail: true,
    handler: function(req, res, next) {
      GardenCrops.findOne({_id :req.params.id}, (err, cat) => {
        Gardens.find({gardenCrops : cat.name}, (err,bus) => {
          res.send(bus);
        });

      });
    }
});
GardenCrops.register(router, '/gardenCrops');

Users.methods(['get', 'post', 'put', 'delete']);
Users.before('post', generateHash);
Users.before('put', generateHash);
Users.route('authenticate.post', function(req, res, next) {
    console.log('users/authenticate.post');
    var userInfo = new Users(req.body);
    Users.findOne({ 'username': userInfo.username }, function(err, user) {
      if (err) {
        console.log(err);
        res.json({success: false, message: err})
      }
      
      if (!user) {
        var message = 'Authentication failed. User not found.';
        res.json({success: false, message: message})
        console.log(message);
        return;
      }
      else if (user) {
        if (!user.validPassword(userInfo.passwordHash)) {
          res.json({success: false, message: 'Authentication failed. Wrong password.'})
          return;
        } 
        else {
          var token = jwt.sign({ username: user.username }, "cs496", { expiresIn: '24h'});
         
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
          return;
        }
      }
    })
  });
  
Users.after('delete', function(req, res, next) {
  next();
});
Users.register(router, '/users');

function generateHash(req, res, next) {
  req.body.passwordHash = bcrypt.hashSync(req.body.passwordHash, bcrypt.genSaltSync(8), null);
  next(); 
};

function validateAPIKey(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, "cs496", function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }
      else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    // if there is no token, return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

// Return router
module.exports = router;
