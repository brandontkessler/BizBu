'use strict';
const authFactory = require('./auth-factory'),
  companyFactory = require('./company-factory');

let factoryData;

module.exports = (req, res, routeType, route, param) => {
  if (routeType === 'auth') {
    factoryData = authFactory(req, route)
  } else if (routeType === 'company-dashboards') {
    factoryData = companyFactory(req, route, param)
  }

  req.flash('success', factoryData.msg)
  return res.redirect(factoryData.redirect)
}
