'use strict';
let msg, redirect;

module.exports = (req, route) => {
  switch (route) {
    case 'authFBcb':
      msg = 'Facebook login hooray';
      redirect = `/user_profile/${req.user._id}`;
      break;
    case 'authLIcb':
      msg = 'Linkedin login successful';
      redirect = `/user_profile/${req.user._id}`;
      break;
    case 'logout':
      msg = 'Thanks for coming';
      redirect = '/';
      break;
    default:
      console.log('error at authFactory')
  }
  return {
    msg,
    redirect
  }
}
