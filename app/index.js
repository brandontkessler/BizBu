'use strict';
const path = require('path'),
  { homeRoutes,
    authRoutes,
    homebaseRoutes,
    companyDashboardRoutes } = require(path.join(__dirname, 'routes')),
  { User, Company, Chat } = require(path.join(__dirname, 'models'))


module.exports = {
  chatIo: require(path.join(__dirname, 'socket')),
  config: require(path.join(__dirname, 'config')),
  logger: require(path.join(__dirname, 'logger')),
  session: require(path.join(__dirname, 'session')),
  homeRoutes,
  authRoutes,
  homebaseRoutes,
  companyDashboardRoutes,
  User,
  Company,
  Chat
}
