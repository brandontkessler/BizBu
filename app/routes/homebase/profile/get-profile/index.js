'use strict';
const path = require('path'),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'user'

let getUserProfile = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err) errorHandler(err, req, res, routeType, 'getUserProfile')
		res.render(`homebase/profile`, { user, page: 'profile' })
	})
}

module.exports = {
  getUserProfile
}
