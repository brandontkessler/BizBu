'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers')),
  { activeRemoveLogout, activeRemovePageLeave } = require(path.join(__dirname, 'active-member')),
  { isCompanyAdmin, isCompanyMember, isCompanyAdminOrMember, atLeastOneOption } = require(path.join(__dirname, 'company')),
  { isNotLoggedIn, isLoggedIn, isProfileOwner } = require(path.join(__dirname, 'authorization')),
  { userDoesNotExist, confirmPassword, userExists, correctPassword } = require(path.join(__dirname, 'auth'))


module.exports = {
	isNotLoggedIn,
	isLoggedIn,
	isProfileOwner,
	isCompanyAdmin,
	isCompanyMember,
	isCompanyAdminOrMember,
	atLeastOneOption,
	activeRemoveLogout,
	activeRemovePageLeave,
  userDoesNotExist,
  confirmPassword,
  userExists,
  correctPassword
}
