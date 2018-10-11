'use strict';
const path = require('path'),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'user'

let getUserInvites = (req, res) => {
	User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
		if(err) errorHandler(err, req, res, routeType, 'getUserInvites')
		res.render(`homebase/user/invites`, { user, page: 'invites' })
	})
}

module.exports = {
  getUserInvites
}
