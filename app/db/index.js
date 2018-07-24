'use strict';
const path = require('path'),
  config = require(path.join(process.cwd(), 'app', 'config')),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  Mongoose = require('mongoose').connect(config.dbURI)

module.exports = {
  Mongoose
}
