"use strict";
const restful = require("node-restful");
const mongoose = restful.mongoose;
const bcrypt   = require('bcrypt-nodejs');

var uSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    passwordHash: {
        type: String,
        required: true
    }
});

// Check if password is valid
uSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

// Create the model for users and expose it to our app
module.exports = restful.model('Users', uSchema, 'Users');
