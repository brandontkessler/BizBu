'use strict';
const path = require('path'),
  router = require('express').Router(),
  // { authFB, authFBcbMiddleware, authFBcb,
  { authLI, authLIcbMiddleware, authLIcb, logout } = require(path.join(__dirname, 'social')),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'app', 'logger'))

// FB routes
// router.get('/auth/facebook', authFB)
// router.get('/auth/facebook/callback', authFBcbMiddleware, authFBcb)

// LinkedIn routes
router.get('/auth/linkedin', authLI, (req, res) => console.log('failed auth'))
router.get('/auth/linkedin/callback', authLIcb)

// LOGOUT
router.get('/logout', middleware.activeRemoveLogout, logout)

module.exports = router
