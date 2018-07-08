'use strict';
const router = require('express').Router(),
  middleware = require('../../middleware');

let home = (req, res) => res.render('home');
let getStarted = (req, res) => res.render('get-started')

// HOME
router.get('/', middleware.activeRemovePageLeave, home);
router.get('/get-started', getStarted);

module.exports = router;
