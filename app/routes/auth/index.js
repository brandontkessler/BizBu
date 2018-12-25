'use strict';
const path = require('path'),
  router = require('express').Router(),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  { authLI, authLIcbMiddleware, authLIcb } = require(path.join(__dirname, 'social')),
  { successHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

// LinkedIn routes
router.get('/auth/linkedin', authLI)
router.get('/auth/linkedin/callback', authLIcbMiddleware, authLIcb)

// login
router.get('/login', (req, res) => {
  res.render('home/login')
})

// LOGOUT
let logout = (req, res) => {
	req.logout()
  successHandler(req, res, 'auth', 'logout')
}

router.get('/logout', middleware.activeRemoveLogout, logout)

module.exports = router
