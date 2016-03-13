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
Gardens.before('post', checkGeoLocation);
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
//Users.before('post', validateSuperUser);
//Users.before('put', validateSuperUser);
//Users.before('delete', validateSuperUser);
Users.before('post', generateHash);
Users.before('put', generateHash);
Users.route('authenticate.post', function(req, res, next) {
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

//function validateSuperUser(req, res, next) {
//  var token = req.body.token || req.query.token || req.headers['x-access-token'];
//  
//  // decode token
//  if (token) {
//    // verifies secret and checks exp
//    jwt.verify(token, "cs496", function(err, decoded) {
//      if (err) {
//        return res.json({
//          success: false,
//          message: 'Failed to authenticate token.'
//        });
//      }
//      else {
//        // if everything is good, save to request for use in other routes
//        req.decoded = decoded;
//        
//        Users.findOne({ 'username': decoded.username }, function(err, user) {
//          if (err) {
//            console.log(err);
//            res.json({success: false, message: err})
//          }
//          
//          if (!user) {
//            var message = 'Authentication failed. User not found.';
//            res.json({success: false, message: message})
//            console.log(message);
//            return;
//          }
//          else if (user) {
//            if (user.isSuperAdmin) {
//              next();
//            } 
//            else {
//              res.json({success: false, message: 'Cannot add/modify user. Current logged in user has no access.'})
//              return;
//            }
//          }
//        })
//      }
//    });
//  }
//  else {
//    // if there is no token, return an error
//    return res.status(403).send({
//      success: false,
//      message: 'No token provided.'
//    });
//  }
//};

// Google Geolocation Setup
var geoCoderProvider = 'google';
var geoCoder = require('node-geocoder')(geoCoderProvider);

function checkGeoLocation(req, res, next) {
  var gardenInfo = new Gardens(req.body);
  var completeAddress = gardenInfo.address + ',' + gardenInfo.city + ',' + gardenInfo.state + ',' + gardenInfo.zip;
  
  // If there is no location data, try to find it.
  if (gardenInfo.location.coordinates.length == 0) {
    geoCoder.geocode(completeAddress)
    .then(function(res) {
      // Get geolocation data if no location property was found or coordinates arr is empty
      if (!req.body.hasOwnProperty("location") || (req.body.location.hasOwnProperty("coordinates") && req.body.location.coordinates.length == 0)) {
        req.body["location"] = {type: 'Point', coordinates: []};
        req.body.location.coordinates.push(res[0].longitude);
        req.body.location.coordinates.push(res[0].latitude);
        next();
      }
      else {
        next();
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }
}

// Return router
module.exports = router;
