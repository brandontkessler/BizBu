'use strict';
const
  { homeRoutes, authRoutes, userRoutes, companyDashboardRoutes, startupResourcesRoutes } = require('./routes'),
  { User, Company, Chat } = require('./models');

module.exports = {
  chatIo: require('./socket'),
  config: require('./config'),
  logger: require('./logger'),
  homeRoutes,
  authRoutes,
  userRoutes,
  companyDashboardRoutes,
  startupResourcesRoutes,
  User,
  Company,
  Chat
}
