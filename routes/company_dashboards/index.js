'use strict';
const router = require('express').Router(),
  team = require('./team-routes'),
  dashboard = require('./dashboard-routes'),
  remove = require('./remove-member-routes'),
  bulletin = require('./bulletin-routes'),
	middleware = require('../../middleware');

// ************************* COMPANY CREATION *************************
router.route('/user_profile/:id/company_dashboard/create')
	.get(middleware.isLoggedIn,
    middleware.isProfileOwner,
    dashboard.getCompanyCreate)
	.post(middleware.isLoggedIn,
    middleware.isProfileOwner,
    dashboard.createCompany);

// ************************* COMPANY DASHBOARD *************************
router.get('/user_profile/:id/company_dashboard/:companyId',
	middleware.isLoggedIn,
  middleware.isProfileOwner,
  middleware.isCompanyAdminOrMember,
  dashboard.getCompanyDashboard);

// ************************* TEAM PAGE *************************
router.route('/user_profile/:id/company_dashboard/:companyId/team')
	.get(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdminOrMember,
    team.getTeam)
	.put(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdminOrMember,
    team.leaveTeam);

// ************************* TEAM INVITE PAGE *************************
router.route('/user_profile/:id/company_dashboard/:companyId/team/invite')
	.get(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdminOrMember,
    team.getInvitePage)
	.post(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdmin,
    team.sendInvite);

// ************************* ACCEPT INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/accept',
	middleware.isLoggedIn, middleware.isProfileOwner, team.acceptInvite);

// ************************* DECLINE INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/decline',
	middleware.isLoggedIn, middleware.isProfileOwner, team.declineInvite);

// ************************* REMOVE MEMBER **************************************
router.route('/user_profile/:id/company_dashboard/:companyId/team/remove')
	.get(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdmin,
		remove.removeMemberPage)
	.put(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdmin,
    middleware.atLeastOneOption,
		remove.removeMember);

// ************************* BULLETIN BOARD *************************
router.route('/user_profile/:id/company_dashboard/:companyId/bulletin-board')
	.get(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdminOrMember,
    bulletin.getBulletinBoard)
	.post(middleware.isLoggedIn,
    middleware.isProfileOwner,
    middleware.isCompanyAdminOrMember,
		bulletin.postBulletin);

module.exports = router;
