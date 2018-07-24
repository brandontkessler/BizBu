'use strict';
const path = require('path'),
  router = require('express').Router(),
  { authLI, authLIcbMiddleware, authLIcb, logout } = require(path.join(__dirname, 'social')),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'app', 'logger'))

// LinkedIn routes
router.get('/auth/linkedin', authLI)
router.get('/auth/linkedin/callback', authLIcbMiddleware, authLIcb)

// LOGOUT
router.get('/logout', middleware.activeRemoveLogout, logout)

module.exports = router
