'use strict';
const path = require('path'),
  homeRoutes = require(path.join(__dirname, 'home')),
  authRoutes = require(path.join(__dirname, 'auth')),
  homebaseRoutes = require(path.join(__dirname, 'homebase')),
  companyDashboardRoutes = require(path.join(__dirname, 'company-dashboards'))

module.exports = {
  homeRoutes,
  authRoutes,
  homebaseRoutes,
  companyDashboardRoutes
}
