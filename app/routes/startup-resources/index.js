'use strict';
const router = require('express').Router(),
  { User } = require('../../models'),
  middleware = require('../../middleware'),
  { myMessages, getStartupResourcesStartups,
    getStartupResourcesTalent, getStartupResourcesServiceProviders } = require('./nav-routes'),
  { sendMessage, deleteMessage, queryMessages,
    startMessageWithCompany, startMessageWithUser } = require('./message-routes');

// NAVIGATION
router.get('/my-messages',
  middleware.isLoggedIn,
  myMessages)

router.get('/startups',
  middleware.isLoggedIn,
  getStartupResourcesStartups)

router.get('/talent',
  middleware.isLoggedIn,
  getStartupResourcesTalent)

router.get('/service-providers',
  middleware.isLoggedIn,
  getStartupResourcesServiceProviders)


// MESSAGES
router.route('/send-message/:msgId')
  .post(middleware.isLoggedIn,
  sendMessage);

router.route('/delete-message/:msgId')
  .post(middleware.isLoggedIn,
  deleteMessage);

router.get('/my-messages/query/:msgId',
  middleware.isLoggedIn,
  queryMessages);

router.route('/startups/message/company/:companyId')
  .post(middleware.isLoggedIn,
  startMessageWithCompany);

router.route('/startups/message/user/:userId')
  .post(middleware.isLoggedIn,
  startMessageWithUser);

module.exports = router;
