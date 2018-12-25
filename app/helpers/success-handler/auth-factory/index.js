'use strict';
let msg, redirect

module.exports = (req, route) => {
  switch (route) {
    case 'authLIcb':
      msg = 'Login Successful'
      redirect = `/homebase/create`
      break
    case 'logout':
      msg = 'You have been logged out'
      redirect = '/'
      break
    default:
      console.log('error at authFactory')
  }
  return {
    msg,
    redirect
  }
}
