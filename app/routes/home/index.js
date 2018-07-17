'use strict';
const path = require('path'),
  router = require('express').Router(),
  middleware = require(path.join(process.cwd(), 'app', 'middleware'))

let home = (req, res) => res.render('home')
let getStarted = (req, res) => res.render('home/get-started')

// HOME
router.get('/', middleware.activeRemovePageLeave, home)
router.get('/get-started', getStarted)

module.exports = router
