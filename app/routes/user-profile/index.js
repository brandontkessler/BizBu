'use strict';
const router = require('express').Router(),
	middleware = require('../../middleware'),
	{ User, Company } = require('../../models'),
	{ errorHandler } = require('../../helpers');

const routeType = 'user-profile';

let getUserProfile = (req, res) => {
	let route = 'getUserProfile';
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err) errorHandler(err, req, res, routeType, route);
		res.render('user_profiles', { user: user });
	});
};

router.get('/:id',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.activeRemovePageLeave,
  getUserProfile);

module.exports = router;
