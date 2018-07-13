'use strict';
const router = require('express').Router(),
  middleware = require('../../middleware');

router.get('/', (req, res) => {
    res.render('startup-resources')
  })


module.exports = router;
