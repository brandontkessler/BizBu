'use strict';
const path = require('path'),
  router = require('express').Router(),
  middleware = require(path.join(process.cwd(), 'app', 'middleware')),
  logger = require(path.join(process.cwd(), 'logger'))

let home = (req, res) => {
  logger.log(process.env.HOST)
  logger.log(process.env.NODE_ENV)
  res.render('home')
}
let getStarted = (req, res) => res.render('home/get-started')

// HOME
router.get('/', middleware.activeRemovePageLeave, home)
router.get('/get-started', getStarted)

module.exports = router
