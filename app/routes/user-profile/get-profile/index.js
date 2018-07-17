'use strict';
const { User, Company } = require('../../../models'),
  { errorHandler } = require('../../../helpers');

const routeType = 'user-profile';

let getUserProfile = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err) errorHandler(err, req, res, routeType, 'getUserProfile');
		res.render('user-profiles', { user: user });
	});
};

module.exports = {
  getUserProfile
};
