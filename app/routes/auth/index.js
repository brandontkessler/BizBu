'use strict';
const path = require('path'),
  router = require('express').Router(),
  { authFB, authFBcbMiddleware, authFBcb,
    authLI, authLIcbMiddleware, authLIcb, logout } = require(path.join(__dirname, 'social')),
	middleware = require(path.join(process.cwd(), 'app', 'middleware'))

// FB routes
router.get('/auth/facebook', authFB)
router.get('/auth/facebook/callback', authFBcbMiddleware, authFBcb)

// LinkedIn routes
router.get('/auth/linkedin', authLI)
router.get('/auth/linkedin/callback', authLIcbMiddleware, authLIcb)

// LOGOUT
router.get('/logout', middleware.activeRemoveLogout, logout)

module.exports = router
