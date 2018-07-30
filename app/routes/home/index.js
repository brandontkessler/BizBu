'use strict';
const path = require('path'),
  router = require('express').Router(),
  middleware = require(path.join(process.cwd(), 'app', 'middleware'))

let home = (req, res) => res.render('home')
let privacyPolicy = (req, res) => res.render('home/privacy-policy')

// HOME
router.get('/', middleware.activeRemovePageLeave, home)
router.get('/privacy-policy', privacyPolicy)


module.exports = router
