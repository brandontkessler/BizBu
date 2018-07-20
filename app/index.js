'use strict';
const path = require('path'),
  { homeRoutes,
    authRoutes,
    homebaseRoutes,
    companyDashboardRoutes } = require(path.join(__dirname, 'routes')),
  { User, Company, Chat } = require(path.join(__dirname, 'models'))

module.exports = {
  chatIo: require('./socket'),
  config: require('./config'),
  logger: require('./logger'),
  homeRoutes,
  authRoutes,
  homebaseRoutes,
  companyDashboardRoutes,
  User,
  Company,
  Chat
}
