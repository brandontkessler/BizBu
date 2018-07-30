'use strict';
const path = require('path'),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

let errorType = 'middleware'

let isNotLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
		return next()
	}
  errorHandler(errorType, req, res, 'isNotLoggedIn')
}

let isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next()
	}
	errorHandler(errorType, req, res, 'isLoggedIn')
}

let isProfileOwner = (req, res, next) => {
	if(req.user._id.toString() === req.params.id){
		return next()
	}
	errorHandler(errorType, req, res, 'isProfileOwner')
}

module.exports = {
  isNotLoggedIn,
  isLoggedIn,
  isProfileOwner
}
