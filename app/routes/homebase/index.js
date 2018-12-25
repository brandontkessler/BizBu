'use strict';
const path = require('path'),
  router = require('express').Router(),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  { getUserProfile, makeMePublic, hideMe } = require(path.join(__dirname, 'profile')),
  { getUserInvites } = require(path.join(__dirname, 'invites')),
  { getCreateCompany, createCompany } = require(path.join(__dirname, 'create')),
  { myCompanies } = require(path.join(__dirname, 'my-companies'))

// ************************* USER *************************
// profile routes
router.get('/:id/profile',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  middleware.activeRemovePageLeave,
  getUserProfile)

router.get('/:id/make-me-public',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  makeMePublic)

router.get('/:id/hide-me',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  hideMe)

// ************************* INVITES *************************
router.get('/:id/invites',
  middleware.isLoggedIn,
  middleware.isProfileOwner,
  getUserInvites)

// ************************* COMPANY *************************
router.get('/my-companies',
  middleware.isLoggedIn,
  myCompanies)

router.route('/create')
	.get(middleware.isLoggedIn,
    getCreateCompany)
	.post(middleware.isLoggedIn,
    createCompany)

module.exports = router
