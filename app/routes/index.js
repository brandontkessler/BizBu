'use strict';
const homeRoutes = require('./home'),
  authRoutes = require('./auth'),
  userRoutes = require('./user-profile'),
  companyDashboardRoutes = require('./company-dashboards'),
  startupResourcesRoutes = require('./startup-resources');

module.exports = {
  homeRoutes,
  authRoutes,
  userRoutes,
  companyDashboardRoutes,
  startupResourcesRoutes
}
