'use strict';
let msg, redirect;

module.exports = (req, route) => {
  switch (route) {
    case 'authFBcb':
      msg = 'Facebook login hooray!';
      redirect = `/user-profile/${req.user._id}`;
      break;
    case 'authLIcb':
      msg = 'Linkedin login woooo!';
      redirect = `/user-profile/${req.user._id}`;
      break;
    case 'logout':
      msg = 'How dare you';
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
