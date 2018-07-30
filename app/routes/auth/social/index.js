'use strict';
const path = require('path'),
  router = require('express').Router(),
  passport = require('passport'),
  { successHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'auth'

// LINKEDIN ROUTES
let authLI = passport.authenticate('linkedin', {
	scope: ['r_basicprofile', 'r_emailaddress']
})

let authLIcbMiddleware = passport.authenticate('linkedin', {
  	failureFlash: 'unable to login',
	  failureRedirect: '/get-started'
})

let authLIcb = (req, res, next) => {
  successHandler(req, res, routeType, 'authLIcb')
}


module.exports = {
  authLI,
  authLIcbMiddleware,
  authLIcb
}
