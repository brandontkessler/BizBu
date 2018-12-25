'use strict';
let msg, redirect

module.exports = (req, route, param) => {
  switch(route){
    case 'createCompany':
      msg = 'Welcome to your new company dashboard'
      redirect =`/company-dashboard/${param}`
      break
    case 'leaveTeam':
      msg = "You're out of there!"
      redirect = `/homebase/user/${req.user._id}`
      break
    case 'sendInvite':
      msg = 'Invite has been sent'
      redirect = `/company-dashboard/${req.params.companyId}/team/invite`
      break
    case 'acceptInvite':
      msg = `Welcome to the team`
      redirect = `/company-dashboard/${req.params.companyId}`
      break
    case 'declineInvite':
      msg = `Invite declined`
      redirect = `/homebase/user/${req.user.id}`
      break
    case 'removeMember':
      msg = 'The member(s) have been removed'
      redirect = 'back'
      break
    case 'bulletinRoutes':
      msg = 'Bulletin posted'
      redirect = `/company-dashboard/${req.params.companyId}/bulletin-board`
      break
    case 'checklistGeneral':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/general`
      break
    case 'checklistResearch':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/research`
      break
    case 'checklistProduct':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/product`
      break
    case 'checklistMarketing':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/marketing`
      break
    case 'checklistLegal':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/legal`
      break
    case 'checklistFinancials':
      msg = 'Checklist saved'
      redirect = `/company-dashboard/${req.params.companyId}/checklist/financials`
      break
    default:
      console.log('error at companyFactory')
  }
  return {
    msg,
    redirect
  }
}
