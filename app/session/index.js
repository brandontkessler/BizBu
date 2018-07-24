'use strict';
const path = require('path'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  config = require(path.join(process.cwd(), 'app', 'config')),
  db = require(path.join(process.cwd(), 'app', 'db'))


if(process.env.NODE_ENV === 'production') {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db.Mongoose.connection
    }),
    cookie: {
      httpOnly: true,
      secure: true
    }
  })
} else {
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
}
