'use strict';
const path = require('path'),
  { Company } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

let errorType = 'middleware'

let isCompanyAdmin = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.user._id))
		if(!isNotAdmin){
			return next()
		}
		errorHandler(errorType, req, res, 'isCompanyAdmin')
	})
}

let isCompanyMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.user._id))
		if(!isNotMember){
			return next()
		}
		errorHandler(errorType, req, res, 'isCompanyMember')
	})
}

let isCompanyAdminOrMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.user._id))
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.user._id))
		if(!isNotMember || !isNotAdmin){
			return next()
		}
    errorHandler(errorType, req, res, 'isCompanyAdminOrMember')
	})
}

// USED FOR REMOVING MEMBERS --- MUST SELECT AT LEAST ONE TO REMOVE TO TRIGGER ROUTE
let atLeastOneOption = (req, res, next) => {
	if(!req.body.member) errorHandler(errorType, req, res, 'atLeastOneOption')
	next()
}

module.exports = {
  isCompanyAdmin,
  isCompanyMember,
  isCompanyAdminOrMember,
  atLeastOneOption
}
