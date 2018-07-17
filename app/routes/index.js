'use strict';
const path = require('path'),
  homeRoutes = require(path.join(__dirname, 'home')),
  authRoutes = require(path.join(__dirname, 'auth')),
  userRoutes = require(path.join(__dirname, 'user-profile')),
  companyDashboardRoutes = require(path.join(__dirname, 'company-dashboards')),
  startupResourcesRoutes = require(path.join(__dirname, 'startup-resources'))

module.exports = {
  homeRoutes,
  authRoutes,
  userRoutes,
  companyDashboardRoutes,
  startupResourcesRoutes
}
