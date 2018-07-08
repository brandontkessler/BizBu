'use strict';
const router = require('express').Router(),
  passport = require('passport');

// FB ROUTES
let authFB = passport.authenticate('facebook', {
	scope : ['public_profile', 'email']
});

let authFBcbMiddleware = passport.authenticate('facebook', {
	failureRedirect: '/login',
	failureFlash: true
})

let authFBcb = (req, res) => {
	req.flash('success', 'Facebook login successful')
	res.redirect('/user_profile/' + req.user._id)
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
	req.flash('success', 'LinkedIn login successful')
	res.redirect('/user_profile/' + req.user._id)
}

// LOGOUT
let logout = (req, res) => {
	req.logout();
	req.flash("success", "See ya later");
	res.redirect('/');
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
