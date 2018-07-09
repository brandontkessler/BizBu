'use strict';
const router = require('express').Router(),
	middleware = require('../../middleware'),
	{ User, Company } = require('../../models'),
	logger = require('../../logger');

let getUserProfile = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err){
			logger.log('error', `routes/user-profile - getUserProfile: ${err}`);
			req.flash('error', err);
			return res.redirect('back');
		}
		res.render('user_profiles', { user: user });
	});
};

router.get('/:id',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.activeRemovePageLeave,
  getUserProfile);

module.exports = router;
