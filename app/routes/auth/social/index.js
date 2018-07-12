'use strict';
const router = require('express').Router(),
  passport = require('passport'),
  { successHandler } = require('../../../helpers');

const routeType = 'auth';

// FB ROUTES
let authFB = passport.authenticate('facebook', {
	scope : ['public_profile', 'email']
});

let authFBcbMiddleware = passport.authenticate('facebook', {
	failureRedirect: '/login',
	failureFlash: true
})

let authFBcb = (req, res) => {
  successHandler(req, res, routeType, 'authFBcb')
}

// LINKEDIN ROUTES
let authLI = passport.authenticate('linkedin', {
	scope: ['r_basicprofile', 'r_emailaddress']
});

let authLIcbMiddleware = passport.authenticate('linkedin', {
	failureRedirect: '/login',
	failureFlash: true
})

let authLIcb = (req, res) => {
  successHandler(req, res, routeType, 'authLIcb')
}

// LOGOUT
let logout = (req, res) => {
	req.logout();
  successHandler(req, res, routeType, 'logout')
}

module.exports = {
  authFB,
  authFBcbMiddleware,
  authFBcb,
  authLI,
  authLIcbMiddleware,
  authLIcb,
  logout
};
