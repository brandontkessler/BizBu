'use strict';
const path = require('path'),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'homebase'

let myCompanies = (req, res) => {
  User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
    if(err) errorHandler(err, req, res, routeType, 'my-companies')
    res.render('homebase/my-companies', { user, page: 'my-companies'})
  })
}

module.exports = {
  myCompanies
}
