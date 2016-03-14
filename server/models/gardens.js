"use strict";
// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

var gardenSchema = new mongoose.Schema({
  name: String,
  description: String,
  gardenCrops: Array,
  owner: String,
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  }
});

// Export model
module.exports = restful.model('Gardens', gardenSchema, 'Gardens');
