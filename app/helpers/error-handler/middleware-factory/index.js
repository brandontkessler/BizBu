'use strict';
const path = require('path'),
  logger = require(path.join(process.cwd(), 'app', 'logger'))
let msg, redirect

module.exports = (req, routeType) => {
  switch(routeType){
    case 'isNotLoggedIn':
      msg = `You're already logged in!`
      redirect = `/get-started`
      break
    case 'isLoggedIn':
      msg = 'You must be logged in!'
      redirect = `/get-started`
      break
    case 'confirmPassword':
      msg = 'Passwords do not match!'
      redirect = `/signup`
      break
    case 'isProfileOwner':
      msg = `That's not your profile!`
      redirect = `/homebase/user/${req.user._id}`
      break
    case 'isCompanyAdmin':
      msg = `You're not an admin! You can't do that!`
      redirect = 'back'
      break
    case 'isCompanyMember':
      msg = `You're not a member`
      redirect = 'back'
      break
    case 'isCompanyAdminOrMember':
      msg = `You're not on the team for that company!`
      redirect = 'back'
      break
    case 'atLeastOneOption':
      msg = `You didn't select anything to delete`
      redirect = `/company-dashboard/${req.params.companyId}/team/remove`
      break
    case 'correctPassword':
      msg = `Incorrect password`
      redirect = `back`
      break
    default:
      msg = `An error occurred`
      redirect = `back`
  }
  return {
    msg,
    redirect
  }
}
