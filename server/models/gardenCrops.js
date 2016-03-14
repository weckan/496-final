"use strict";
// Dependencies
const restful = require('node-restful');
const mongoose = restful.mongoose;

// Export model
module.exports = restful.model('gardenCrops',
  new mongoose.Schema({
    name : String,
    notes : [String],
  }), 'gardenCrops'
);
