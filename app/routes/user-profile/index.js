'use strict';
const path = require('path'),
	router = require('express').Router(),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
	{ getUserProfile } = require(path.join(__dirname, 'get-profile')),
	{ makeMePublic, hideMe } = require(path.join(__dirname, 'public-profile'))

router.get('/:id',
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

module.exports = router
