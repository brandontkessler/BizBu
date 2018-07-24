'use strict';
let msg, redirect

module.exports = (req, route) => {
  switch (route) {
    case 'authFBcb':
      msg = 'Facebook login hooray!'
      redirect = `/homebase/user/${req.user._id}`
      break
    case 'authLIcb':
      msg = 'Linkedin login woooo!'
      redirect = `/homebase/user/${req.user._id}`
      break
    case 'logout':
      msg = 'How dare you'
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
