'use strict';
const path = require('path'),
  router = require('express').Router(),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  local = require(path.join(__dirname, 'local'))
  // { authLI, authLIcbMiddleware, authLIcb } = require(path.join(__dirname, 'social'))

// LinkedIn routes
// router.get('/auth/linkedin', authLI)
// router.get('/auth/linkedin/callback', authLIcbMiddleware, authLIcb)

// Sign Up
router.route('/signup')
  .get(local.signup.get)
  .post(
    middleware.isNotLoggedIn,
    middleware.userDoesNotExist,
    middleware.confirmPassword,
    local.signup.post
  )

// Log in
router.route('/login')
  .get(local.login.get)
  .post(
    middleware.isNotLoggedIn,
    middleware.userExists,
    middleware.correctPassword,
    local.login.authenticate(),
    local.login.post
  )

// LOGOUT
router.get('/logout', middleware.activeRemoveLogout, local.logout)

module.exports = router
