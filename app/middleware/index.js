'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
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

// REMOVE ACTIVE COMPANIES ANd USER ON LOGOUT
let activeRemoveLogout = async (req, res, next) => {
	try {
		let foundUser = await User.findById(req.user._id)
		foundUser.activeCompanies = []
		await foundUser.save()

		let companies = req.user.activeCompanies
		for (let company of companies){
			let foundCompany = await Company.findById(company)
			let index = foundCompany.activeUsers.indexOf(req.user._id)
			if (index > -1) {
				foundCompany.activeUsers.splice(index, 1)
				await foundCompany.save()
			}
		}
		next()
	} catch(e) {
		errorHandler(errorType, req, res, 'activeRemoveLogout')
	}
}

// REMOVE ACTIVE COMPANY AND USER ON PAGE LEAVE
let activeRemovePageLeave = async (req, res, next) => {
	try{
		if(!req.user){
			return next()
		}

		let foundUser = await User.findById(req.user._id)
		let companies = foundUser.activeCompanies

		for (let companyId of companies){
			let company = await Company.findById(companyId)
			let userIndex = company.activeUsers.indexOf(req.user._id)

			if (userIndex !== -1) {
				let companyIndex = foundUser.activeCompanies.indexOf(companyId)
				if(companyIndex !== -1){
					foundUser.activeCompanies.splice(companyIndex, 1)
					await foundUser.save()
				}

				company.activeUsers.splice(userIndex, 1)
				await company.save()
			}
		}
		next()
	} catch(e){
		errorHandler(errorType, req, res, 'activeRemovePageLeave')
	}
}

module.exports = {
	isNotLoggedIn,
	isLoggedIn,
	isProfileOwner,
	isCompanyAdmin,
	isCompanyMember,
	isCompanyAdminOrMember,
	atLeastOneOption,
	activeRemoveLogout,
	activeRemovePageLeave
}
