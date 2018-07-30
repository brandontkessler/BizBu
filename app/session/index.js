'use strict';
const path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.join(process.cwd(), 'app', 'config'))

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  }
} else {
  module.exports = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }
}
