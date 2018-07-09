'use strict';
const dev = require('./development.json')

if(process.env.NODE_ENV === 'production'){
  module.exports = {
    host: process.env.HOST || "",
    dbURI: process.env.DB_URI,
    session: {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true
      }
    },
    inviteEncrypter: process.env.INVITE_ENCRYPTER,
    fb: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: process.env.HOST + "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"]
    },
    linkedin: {
      consumerKey: process.env.LINKED_CONSUMER_KEY,
      consumerSecret: process.env.LINKED_CONSUMER_SECRET,
      callbackURL: process.env.HOST + "/auth/linkedin/callback",
      profileFields: ["id", "first-name", "last-name", "email-address", "headline", "picture-url", "industry", "positions"]
    }
  }
} else {
  module.exports = dev;
}
