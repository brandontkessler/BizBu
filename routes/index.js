'use strict';
const	express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	middleware = require('../middleware'),
	User = require('../models/user');

// HOME PAGE
router.get('/', (req, res) => res.render('home'));

// Get Started page
router.get('/get-started', (req, res) => res.render('get-started'));

// FB routes
router.get('/auth/facebook', passport.authenticate('facebook', {
	scope : ['public_profile', 'email']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/login',
	failureFlash: true
}), (req, res) => {
	req.flash('success', 'Facebook login successful')
	res.redirect('/user_profile/' + req.user._id)
});

// LinkedIn routes
router.get('/auth/linkedin', passport.authenticate('linkedin', {
	scope: ['r_basicprofile', 'r_emailaddress']
}));

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
	failureRedirect: '/login',
	failureFlash: true
}), (req, res) => {
	req.flash('success', 'LinkedIn login successful')
	res.redirect('/user_profile/' + req.user._id)
});

// LOGOUT
router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success", "See ya later");
	res.redirect('/');
});

module.exports = router;
