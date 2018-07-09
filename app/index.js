'use strict';
const
  { homeRoutes, authRoutes, userRoutes, companyDashboardRoutes } = require('./routes'),
  { User, Company, Chat } = require('./models');

module.exports = {
  chatIo: require('./socket'),
  config: require('./config'),
  logger: require('./logger'),
  homeRoutes,
  authRoutes,
  userRoutes,
  companyDashboardRoutes,
  User,
  Company,
  Chat
}
