'use strict';
const path = require('path'),
  passport = require('passport'),
  config = require(path.join(process.cwd(), 'app', 'config')),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  LinkedinStrategy = require('passport-linkedin-oauth2').Strategy

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done){
  	User.findOne({'_id': id}, function(err, user) {
  		done(err, user)
  	})
  });

  let linkedinAuth = async (accessToken, refreshToken, profile, done) => {
  	try{
  		let user = await User.findOne({ email : profile.emails[0].value })
  		if(!user){
  			// IF USER DOES NOT EXIST, CREATE ONE WITH LINKEDIN
  			let newUser = new User({
  				'email' : profile.emails[0].value,
  				'created' : new Date(),
  				'name' : `${profile.name.givenName} ${profile.name.familyName}`,
  				'pic' : profile._json.pictureUrl,
  				'linkedin.id' : profile.id,
  				'linkedin.accessToken' : accessToken,
          'linkedin.url' : profile._json.publicProfileUrl,
          'publicProfile' : false
  			})

  			await newUser.save()
  			return done(null, newUser)
  		} else {
  			// IF USER DOES EXIST, CHECK IF DONE WITH LINKEDIN
  			let linkedinUser =  await User.findOne({ 'linkedin.id' : profile.id })
  			return done(null, linkedinUser)
  		}
  	} catch(e) {
      logger.log('error', `Linkedin auth error: ${e}`)
  		return done(e)
  	}
  }

  passport.use(new LinkedinStrategy(config.linkedin, linkedinAuth))
}
