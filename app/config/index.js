'use strict';
const path = require('path')

if(process.env.NODE_ENV === 'production'){
  module.exports = {
    port: process.env.PORT,
    host: process.env.HOST || "",
    dbURI: process.env.DB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    inviteEncrypter: process.env.INVITE_ENCRYPTER,
    fb: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: `/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    linkedin: {
      clientID: process.env.LINKED_CLIENT_ID,
      clientSecret: process.env.LINKED_CLIENT_SECRET,
      callbackURL: `getoutofoffice.herokuapp.com/auth/linkedin/callback`,
      profileFields: ["id", "first-name", "last-name", "email-address", "headline", "picture-url", "industry", "positions", "public-profile-url"],
      state: true
    }
  }
} else {
  module.exports = require(path.join(__dirname, 'development.json'))
}
