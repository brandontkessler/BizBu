'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

let errorType = 'middleware'

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
  activeRemoveLogout,
  activeRemovePageLeave
}
