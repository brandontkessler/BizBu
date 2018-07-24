'use strict';
const path = require('path'),
  mongoose = require('mongoose'),
  MongoStore = require('connect-mongo'),
  config = require(path.join(process.cwd(), 'app', 'config'))

if(process.env.NODE_ENV === 'production') {
  module.exports = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      httpOnly: true,
      secure: true
    }
  }
} else {
  module.exports = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }
}
