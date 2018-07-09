'use strict';
const passport = require('passport'),
  config = require('../config'),
  { User } = require('../models'),
  logger = require('../logger'),
  FacebookStrategy = require('passport-facebook').Strategy,
  LinkedinStrategy = require('passport-linkedin').Strategy;

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done){
  	User.findOne({'_id': id}, function(err, user) {
  		done(err, user);
  	})
  });

  let facebookAuth = async (accessToken, refreshToken, profile, done) => {
  	try{
  		let user = await User.findOne({ email : profile.emails[0].value });
  		if(!user){
  			// IF USER DOES NOT EXIST, CREATE ONE WITH FB
  			let newUser = new User({
  				'email' : profile.emails[0].value,
  				'created' : new Date(),
  				'name' : profile.displayName,
  				'pic' : profile.photos[0].value,
  				'facebook.id' : profile.id,
  				'facebook.accessToken' : accessToken,
          'hideChat' : false
  			});

  			await newUser.save()
  			return done(null, newUser)
  		} else {
  			// IF USER DOES EXIST, CHECK IF DONE WITH FB
  			let fbUser =  await User.findOne({ 'facebook.id' : profile.id });
  			if(fbUser) return done(null, fbUser);

  			// IF NOT, USER IS LINKEDIN, CREATE FB DATA
  			user.facebook.id = profile.id;
  			user.facebook.accessToken = accessToken;

  			await user.save()
  			return done(null, user)
  		}
  	} catch(e) {
      logger.log('error', `Facebook auth error: ${e}`)
  		return done(e);
  	}
  }

  let linkedinAuth = async (token, tokenSecret, profile, done) => {
  	try{
  		let user = await User.findOne({ email : profile.emails[0].value });
  		if(!user){
  			// IF USER DOES NOT EXIST, CREATE ONE WITH LINKEDIN
  			let newUser = new User({
  				'email' : profile.emails[0].value,
  				'created' : new Date(),
  				'name' : profile.displayName,
  				'pic' : profile._json.pictureUrl,
  				'linkedin.id' : profile.id,
  				'linkedin.token' : token,
          'hideChat' : false
  			});

  			await newUser.save()
  			return done(null, newUser)
  		} else {
  			// IF USER DOES EXIST, CHECK IF DONE WITH LINKEDIN
  			let linkedinUser =  await User.findOne({ 'linkedin.id' : profile.id });
  			if(linkedinUser) return done(null, linkedinUser);

  			// IF NOT, USER IS FB, CREATE LINKEDIN DATA
  			user.linkedin.id = profile.id;
  			user.linkedin.token = token;

  			await user.save()
  			return done(null, user)
  		}
  	} catch(e) {
      logger.log('error', `Linkedin auth error: ${e}`)
  		return done(e)
  	}
  }

  passport.use(new FacebookStrategy(config.fb, facebookAuth));
  passport.use(new LinkedinStrategy(config.linkedin, linkedinAuth));
}
