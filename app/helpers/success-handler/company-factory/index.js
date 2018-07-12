'use strict';
let msg, redirect;

module.exports = (req, route, param) => {
  switch(route){
    case 'createCompany':
      msg = 'Welcome to your new company dashboard';
      redirect =`/company_dashboard/${param}`;
      break;
    case 'leaveTeam':
      msg = 'You have left the company';
      redirect = `/user_profile/${req.user._id}`
      break;
    case 'sendInvite':
      msg = 'Invite has been sent';
      redirect = `/company_dashboard/${req.params.companyId}/team`;
      break;
    case 'acceptInvite':
      msg = `Welcome to the team`;
      redirect = `/company_dashboard/${req.params.companyId}`;
      break;
    case 'declineInvite':
      msg = `Invite declined`;
      redirect = `/user_profile/${req.user.id}`
      break;
    case 'removeMember':
      msg = 'The member(s) have been removed';
      redirect = 'back';
      break;
    case 'bulletinRoutes':
      msg = 'Bulletin has been posted';
      redirect = `/company_dashboard/${req.params.companyId}/bulletin-board`;
      break;
    default:
      console.log('error at companyFactory');
  }
  return {
    msg,
    redirect
  }
}
