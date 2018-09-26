'use strict';
const path = require('path'),
  router = require('express').Router(),
  { getCompanyDashboard, postCompanyInfoToDashboard } = require(path.join(__dirname, 'dashboard')),
  team = require(path.join(__dirname, 'team')),
  { getChecklist, saveChecklist } = require(path.join(__dirname, 'checklist')),
  { getBulletinBoard, postBulletin, updateBulletin, deleteBulletin,
    bulletinComment } = require(path.join(__dirname, 'bulletin')),
	middleware = require(path.join(process.cwd(), 'app', 'middleware'))

// ************************* COMPANY DASHBOARD *************************
router.route('/:companyId')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getCompanyDashboard)

// ************************* TEAM PAGE *************************
router.route('/:companyId/team')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.getTeam)
	.put(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.leaveTeam)

// ************************* TEAM INVITE PAGE *************************
router.route('/:companyId/team/invite')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    team.getInvitePage)
	.post(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    team.sendInvite)

// ************************* ACCEPT INVITE *************************
router.post('/:companyId/team/invite/accept',
	middleware.isLoggedIn, team.acceptInvite)

// ************************* DECLINE INVITE *************************
router.post('/:companyId/team/invite/decline',
	middleware.isLoggedIn, team.declineInvite)

// ************************* REMOVE MEMBER **************************************
router.route('/:companyId/team/remove')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
		team.removeMemberPage)
	.put(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    middleware.atLeastOneOption,
		team.removeMember)

// ************************* CHECKLIST *************************
router.route('/:companyId/checklist')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getChecklist)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    saveChecklist)

// ************************* BULLETIN BOARD *************************
router.route('/:companyId/bulletin-board')
	.get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getBulletinBoard)
	.post(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
		postBulletin)
  .put(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    updateBulletin)
  .delete(middleware.isLoggedIn,
    middleware.isCompanyAdmin,
    deleteBulletin)

router.post('/:companyId/bulletin-board/comment',
  middleware.isLoggedIn,
  middleware.isCompanyAdminOrMember,
  bulletinComment)

module.exports = router
