'use strict';
const express = require('express'),
	router = express.Router(),
	middleware = require('../middleware'),
	User = require('../models/user'),
	Company = require('../models/company');

// ************************* USER PROFILE *************************
router.get('/:id', middleware.isLoggedIn, middleware.isProfileOwner, (req, res) => {
	User
	.findById(req.user._id)
	.populate('companiesAdmin')
	.populate('companiesMember')
	.exec((err, user) => {
		res.render('user_profiles', { user: user });
	});
});

module.exports = router;
