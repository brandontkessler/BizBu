'use strict';
const path = require('path'),
  router = require('express').Router(),
  passport = require('passport'),
  { successHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'auth'

// FB ROUTES
let authFB = passport.authenticate('facebook', {
	scope : ['public_profile', 'email']
})

let authFBcbMiddleware = passport.authenticate('facebook', {
	failureRedirect: '/get-started',
	failureFlash: true
})

let authFBcb = (req, res) => {
  successHandler(req, res, routeType, 'authFBcb')
}

// LINKEDIN ROUTES
let authLI = passport.authenticate('linkedin', {
	scope: ['r_basicprofile', 'r_emailaddress']
})

// let authLIcbMiddleware = passport.authenticate('linkedin', {
//   	failureFlash: 'unable to login',
// 	  failureRedirect: '/get-started'
// })

let authLIcb = (req, res, next) => {
  passport.authenticate('linkedin', function(err, user, info){
    if (err) {
      req.flash('error', 'some error at auth')
      return res.redirect('/')
    }
    if (!user) {
      req.flash('error', 'failure at auth')
      return res.redirect('/')
    }

    req.logIn(user, function(err) {
      if (err) {
        req.flash('error', 'error at login')
        return res.redirect('/get-started')
      }

      return res.redirect('/homebase/user/' + user._id);
    })
  })(req, res, next)
  // successHandler(req, res, routeType, 'authLIcb')
}

// LOGOUT
let logout = (req, res) => {
	req.logout()
  successHandler(req, res, routeType, 'logout')
}

module.exports = {
  authFB,
  authFBcbMiddleware,
  authFBcb,
  authLI,
  // authLIcbMiddleware,
  authLIcb,
  logout
}
