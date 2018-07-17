'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'));

const routeType = 'user-profile'

let getUserProfile = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err) errorHandler(err, req, res, routeType, 'getUserProfile')
		res.render('user-profiles', { user: user })
	})
}

module.exports = {
  getUserProfile
}
