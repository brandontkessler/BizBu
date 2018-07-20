'use strict';
const path = require('path'),
  { startups, messageStartup } = require(path.join(__dirname, 'startups')),
  { talent, messageTalent } = require(path.join(__dirname, 'talent')),
  { serviceProviders } = require(path.join(__dirname, 'service-providers'))

module.exports = {
  startups,
  messageStartup,
  talent,
  messageTalent,
  serviceProviders
}
