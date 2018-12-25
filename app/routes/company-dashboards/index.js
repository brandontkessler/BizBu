'use strict';
const path = require('path'),
  router = require('express').Router(),
  { getCompanyDashboard, postCompanyInfoToDashboard } = require(path.join(__dirname, 'dashboard')),
  team = require(path.join(__dirname, 'team')),
  { getGeneral, getResearch, getProduct, getMarketing, getLegal, getFinancials,
    postGeneral, postResearch, postProduct, postMarketing, postLegal, postFinancials} = require(path.join(__dirname, 'checklist')),
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
router.route('/:companyId/checklist/general')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getGeneral)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postGeneral)

router.route('/:companyId/checklist/research')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getResearch)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postResearch)

router.route('/:companyId/checklist/product')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getProduct)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postProduct)

router.route('/:companyId/checklist/marketing')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getMarketing)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postMarketing)

router.route('/:companyId/checklist/legal')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getLegal)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postLegal)

router.route('/:companyId/checklist/financials')
  .get(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    getFinancials)
  .post(middleware.isLoggedIn,
    middleware.isCompanyAdminOrMember,
    postFinancials)

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
