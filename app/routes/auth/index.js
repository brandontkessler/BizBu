'use strict';
const path = require('path'),
  router = require('express').Router(),
  passport = require('passport'),
	middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'app', 'logger')),
  { successHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'auth'

// LinkedIn routes
router.get('/auth/linkedin',
  passport.authenticate('linkedin'), (req, res) => {
    // redirect to LinkedIn
  })

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    	failureFlash: 'unable to login',
  	  failureRedirect: '/login'
  }), (req, res, next) => {
  successHandler(req, res, routeType, 'authLIcb')
})

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
