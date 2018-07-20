'use strict';
const path = require('path'),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'startup-resources'

let serviceProviders = (req, res) => {
  User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
    if(err) errorHandler(err, req, res, routeType, 'serviceProviders')
    res.render('homebase/startup-resources/service-providers', { user, page: 'service-providers' })
  })
}

module.exports = {
  serviceProviders
}
