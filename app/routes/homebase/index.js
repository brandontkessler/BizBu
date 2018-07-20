'use strict';
const path = require('path'),
  router = require('express').Router(),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  { getUserProfile, makeMePublic, hideMe,
    getMessages, sendMessage, deleteMessage, queryMessages } = require(path.join(__dirname, 'user')),
  { myCompanies, getCompanyCreate, createCompany } = require(path.join(__dirname, 'company')),
  { startups, messageStartup,
    talent, messageTalent,
    serviceProviders} = require(path.join(__dirname, 'startup-resources'))

// ************************* USER *************************
// profile routes
router.get('/user/:id',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  middleware.activeRemovePageLeave,
  getUserProfile)

router.get('/user/:id/make-me-public',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  makeMePublic)

router.get('/user/:id/hide-me',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  hideMe)

// message routes
router.get('/user/:id/my-messages',
  middleware.isLoggedIn,
  getMessages)

router.route('/user/:id/send-message/:msgId')
  .post(middleware.isLoggedIn,
  sendMessage)

router.route('/user/:id/delete-message/:msgId')
  .post(middleware.isLoggedIn,
  deleteMessage)

router.get('/user/:id/my-messages/query/:msgId',
  middleware.isLoggedIn,
  queryMessages)

// ************************* COMPANY *************************
router.get('/company/my-companies',
  middleware.isLoggedIn,
  myCompanies)

router.route('/company/create')
	.get(middleware.isLoggedIn,
    getCompanyCreate)
	.post(middleware.isLoggedIn,
    createCompany)

// ********************* STARTUP-RESOURCES ********************
// startups
router.route('/startup-resources/startups')
  .get(middleware.isLoggedIn,
  startups)
router.route('/startup-resources/startups/:companyId/message')
  .post(middleware.isLoggedIn,
  messageStartup)

// talent
router.route('/startup-resources/talent')
  .get(middleware.isLoggedIn,
  talent)
router.route('/startup-resources/talent/:userId/message')
  .post(middleware.isLoggedIn,
  messageTalent)

// service-providers
router.route('/startup-resources/service-providers')
  .get(middleware.isLoggedIn,
  serviceProviders)

module.exports = router
