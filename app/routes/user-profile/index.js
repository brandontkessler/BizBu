'use strict';
const router = require('express').Router(),
	middleware = require('../../middleware'),
	User = require('../../models/user'),
	Company = require('../../models/company');

let getUserProfile = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		res.render('user_profiles', { user: user });
	});
};

router.get('/:id',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.activeRemovePageLeave,
  getUserProfile);

module.exports = router;
