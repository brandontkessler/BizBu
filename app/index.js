'use strict';
const path = require('path'),
  { homeRoutes,
    authRoutes,
    userRoutes,
    companyDashboardRoutes,
    startupResourcesRoutes } = require(path.join(__dirname, 'routes')),
  { User, Company, Chat } = require(path.join(__dirname, 'models'))

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
