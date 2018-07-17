'use strict';
const router = require('express').Router(),
	middleware = require('../../middleware'),
	{ getUserProfile } = require('./get-profile'),
	{ makeMePublic, hideMe } = require('./public-profile');

router.get('/:id',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.activeRemovePageLeave,
  getUserProfile);

router.get('/:id/make-me-public',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
  makeMePublic);

router.get('/:id/hide-me',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
  hideMe);

module.exports = router;
