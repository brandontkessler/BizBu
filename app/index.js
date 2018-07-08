'use strict';
const chatIo = require('./socket'),
  config = require('./config'),
  { homeRoutes, authRoutes, userRoutes, companyDashboardRoutes } = require('./routes'),
  { User, Company, Chat } = require('./models');

module.exports = {
  chatIo,
  config,
  homeRoutes,
  authRoutes,
  userRoutes,
  companyDashboardRoutes,
  User,
  Company,
  Chat
}
