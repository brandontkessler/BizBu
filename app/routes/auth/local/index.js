'use strict';
const path = require('path'),
  passport = require('passport'),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'auth'

// SIGNUP
let signup = {
  get: (req, res) => res.render('home/signup'),
  post: async (req, res) => {
  	let newUser = new User({
      name: req.body.name,
      email: req.body.username,
  		username: req.body.username,
      url: req.body.url,
      password: req.body.password
  	})

    try {
      await newUser.save()
      passport.authenticate('local')(req, res, function(){
        successHandler(req, res, routeType, 'postSignup')
      })
    } catch(e){
      if(e.name === 'BulkWriteError'){
        req.flash('error', 'A user with that email already exists')
        return res.redirect('/signup')
      }
      logger.log('error', e)
      req.flash('error', 'whoa this is an error');
      res.redirect('/signup');
    }
  }
}

// LOGIN
let login = {
  get: (req, res) => res.render('home/login'),
  authenticate: () => passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  post: (req, res) => {
    successHandler(req, res, routeType, 'postLogin')
  }
}

// LOGOUT
let logout = (req, res) => {
	req.logout()
  successHandler(req, res, routeType, 'logout')
}

module.exports = {
  signup,
  login,
  logout
}
