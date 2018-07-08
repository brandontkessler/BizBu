'use strict';
const router = require('express').Router(),
  { getCompanyCreate, createCompany, getCompanyDashboard } = require('./dashboard'),
  team = require('./team'),
  bulletin = require('./bulletin'),
	middleware = require('../../middleware');

// ************************* COMPANY CREATION *************************
router.route('/create')
	.get(middleware.isLoggedIn,
    getCompanyCreate)
	.post(middleware.isLoggedIn,
    createCompany);

// ************************* COMPANY DASHBOARD *************************
router.get('/:companyId',
	middleware.isLoggedIn,
  middleware.isCompanyAdminOrMember,
  getCompanyDashboard);

// ************************* TEAM PAGE *************************
router.route('/:companyId/team')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.getTeam)
	.put(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.leaveTeam);

// ************************* TEAM INVITE PAGE *************************
router.route('/:companyId/team/invite')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.getInvitePage)
	.post(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    team.sendInvite);

// ************************* ACCEPT INVITE *************************
router.post('/:companyId/team/invite/accept',
	middleware.isLoggedIn, team.acceptInvite);

// ************************* DECLINE INVITE *************************
router.post('/:companyId/team/invite/decline',
	middleware.isLoggedIn, team.declineInvite);

// ************************* REMOVE MEMBER **************************************
router.route('/:companyId/team/remove')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
		team.removeMemberPage)
	.put(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    middleware.atLeastOneOption,
		team.removeMember);

// ************************* BULLETIN BOARD *************************
router.route('/:companyId/bulletin-board')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    bulletin.getBulletinBoard)
	.post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
		bulletin.postBulletin);

module.exports = router;
