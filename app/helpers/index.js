'use strict';
const path = require('path'),
  errorHandler = require(path.join(__dirname, 'error-handler')),
  successHandler = require(path.join(__dirname, 'success-handler')),
  validation = require(path.join(__dirname, 'validation'))

module.exports = {
  errorHandler,
  successHandler,
  validation
}
