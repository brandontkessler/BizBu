'use strict';
const path = require('path'),
  authFactory = require(path.join(__dirname, 'auth-factory')),
  companyFactory = require(path.join(__dirname, 'company-factory'))

let factoryData

module.exports = (req, res, routeType, route, param) => {
  if (routeType === 'auth') {
    factoryData = authFactory(req, route)
  } else if (routeType === 'company-dashboards') {
    factoryData = companyFactory(req, route, param)
  }

  req.flash('success', factoryData.msg)
  return res.redirect(factoryData.redirect)
}
