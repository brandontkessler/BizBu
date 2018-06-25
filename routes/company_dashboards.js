const 	express = require('express'),
				router = express.Router(),
				moment = require('moment'),
				middleware = require('../middleware'),
				User = require('../models/user'),
				Company = require('../models/company'),
				Bulletin = require('../models/bulletin');

// ************************* COMPANY CREATION *************************
router.route('/user_profile/:id/company_dashboard/create')
	.get(middleware.isLoggedIn, middleware.isProfileOwner, (req, res) => {
		res.render('user_profiles/create-company')
	})
	.post(middleware.isLoggedIn, middleware.isProfileOwner, async (req, res) => {
		try {
			// CREATE COMPANY
			let newCompany = new Company({
				name: req.body.company.name,
				created: new Date()
			})
			let createdCompany = await Company.create(newCompany);

			// CREATE BULLETIN
			let newBulletin = new Bulletin({
				'companyRef': createdCompany
			});
			let createdBulletin = await Bulletin.create(newBulletin);

			let user = await User.findById(req.user._id);

			newCompany.admin.push(req.user._id);
			newCompany.bulletin = createdBulletin;
			newCompany.notifications.unshift(`${user.name.split(' ')[0]} created ${req.body.company.name}`);

			await newCompany.save();
			user.companiesAdmin.push(newCompany);
			await user.save();

			req.flash('success', 'Welcome to your new company dashboard')
			return res.redirect('/user_profile/' + req.user._id + '/company_dashboard/' + newCompany._id);

		} catch(e) {
			req.flash('error', e.message)
			return res.redirect('back');
		}
	});

// ************************* COMPANY DASHBOARD *************************
router.get('/user_profile/:id/company_dashboard/:companyId',
	middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember,
	(req, res) => {
		Company.findById(req.params.companyId).exec((err, foundCompany) => {
			if(err){
				req.flash('error', `Can't find that company!`)
				return res.redirect('back');
			}
			res.render('company_dashboards', {company: foundCompany});
		});
});

// ************************* TEAM PAGE *************************
router.route('/user_profile/:id/company_dashboard/:companyId/team')
	.get(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember,
		(req, res) => {
			Company.findById(req.params.companyId).populate('admin').populate('member').exec((err, foundCompany) => {
				if(err){
					req.flash('error', err)
					return res.redirect('back');
				}
				res.render('company_dashboards/team', {company: foundCompany});
			})
	})
// ************************* LEAVE TEAM *************************
	.put(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember,
		async (req, res) => {
			try {
				let foundUser = await User.findById(req.user.id);
				let foundCompany = await Company.findById(req.params.companyId);

				// CHECK IF USER IS MEMBER
				let userIsMember = foundUser.companiesAdmin.every(companyId => companyId.toString() !== foundCompany._id.toString());
				if(userIsMember){
					let companyIndex = foundCompany.member.indexOf(foundUser._id);
					let userIndex = foundUser.companiesMember.indexOf(foundCompany._id);

					foundCompany.member.splice(companyIndex, 1);
					foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
					foundUser.companiesMember.splice(userIndex, 1);

					await foundCompany.save();
					await foundUser.save();

					req.flash('success', `You have left ${foundCompany.name}`);
					return res.redirect('/user_profile/' + foundUser._id)
				}

				// IF NOT MEMBER, THEN USER MUST BE ADMIN
				let companyIndex = foundCompany.admin.indexOf(foundUser._id);
				let userIndex = foundUser.companiesAdmin.indexOf(foundCompany._id);

				foundCompany.admin.splice(companyIndex, 1);
				foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
				foundUser.companiesAdmin.splice(userIndex, 1);

				await foundCompany.save();
				await foundUser.save();

				req.flash('success', `You have left ${foundCompany.name}`);
				return res.redirect('/user_profile/' + foundUser._id)
			} catch(e) {
				req.flash('error', e.message);
				return res.redirect('back');
			}
	});


// ************************* TEAM INVITE PAGE *************************
router.route('/user_profile/:id/company_dashboard/:companyId/team/invite')
	.get(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember,
		async (req, res) => {
			try {
				let foundCompany = await Company.findById(req.params.companyId);
				let allUsers = await User.find({});
				res.render('company_dashboards/invite', {users: allUsers, company: foundCompany});
			} catch(e) {
				req.flash('error', e.message);
				res.redirect('back');
			}
	})
	.post(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdmin,
		async (req, res) => {
			try {
				let foundUser = await User.findOne({ 'inviteCode': req.body.invitee });

				if(!foundUser){
					req.flash('error', `That user doesn't exist!`)
					return res.redirect('back');
				}

				let newInvite = req.body.invite;


				let uniqueAdmin = foundUser.companiesAdmin.every(companyId => !companyId.equals(newInvite.companyId));
				let uniqueMember = foundUser.companiesMember.every(companyId => !companyId.equals(newInvite.companyId));
				let uniqueInvite = foundUser.invites.every(invite => invite.companyId !== newInvite.companyId);

				if(!uniqueAdmin){
					req.flash('error', `That user's already an admin for this company!`)
					res.redirect('back')
				} else if (!uniqueMember){
					req.flash('error', `That user's already a team member for this company!`)
					res.redirect('back')
				} else if (!uniqueInvite){
					req.flash('error', `There's already an invite pending for the user`)
					res.redirect('back')
				} else {

					await foundUser.invites.push(newInvite);
					await foundUser.save();

					req.flash('success', `Your invite has been sent!`)
					return res.redirect('/user_profile/' + req.user.id + '/company_dashboard/' + req.params.companyId + '/team')
				}
			} catch(e) {
				req.flash('error', e.message);
				res.redirect('back');
			}
	});

// ************************* ACCEPT INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/accept',
	middleware.isLoggedIn, middleware.isProfileOwner, async (req, res) => {
		try {
			let foundUser = await User.findById(req.user.id);
			let foundCompany = await Company.findById(req.params.companyId);
			let inviteArray = foundUser.invites;

			for (invite of inviteArray) {
				if(!foundCompany._id.equals(invite.companyId)){
					continue;
				}
				if(invite.admin){
					foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
					foundUser.companiesAdmin.push(foundCompany);
					foundCompany.admin.push(req.user);
					foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);

					await foundUser.save();
					await foundCompany.save();

					req.flash('success', `You're now an admin for ${foundCompany.name}`)
					return res.redirect("/user_profile/" + req.user._id);
				} else {
					foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
					foundUser.companiesMember.push(foundCompany);
					foundCompany.member.push(req.user);
					foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);

					await foundUser.save();
					await foundCompany.save();

					req.flash('success', `You're now a member for ${foundCompany.name}`)
					return res.redirect("/user_profile/" + req.user.id);
				}
			}
		} catch(e) {
			req.flash('error', e.message);
			res.redirect('back');
		}
});

// ************************* REJECT INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/decline',
	middleware.isLoggedIn, middleware.isProfileOwner, async (req, res) => {
		try {
			let foundUser = await User.findById(req.user._id);
			let foundCompany = await Company.findById(req.params.companyId);

			foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
			foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has rejected the invite`);

			await foundUser.save();
			await foundCompany.save();

			req.flash('success', `You have rejected the invite!`);
			return res.redirect("/user_profile/" + req.user.id);
		} catch(e) {
			req.flash('error', e.message);
			return res.redirect('back');
		}
});

// ************************* REMOVE MEMBER **************************************
router.route('/user_profile/:id/company_dashboard/:companyId/team/remove')
	.get(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdmin,
		(req, res) => {
			Company.findById(req.params.companyId).populate('member').exec((err, foundCompany) => {
				if(err){
					req.flash('error', err)
					return res.redirect('back');
				}
				res.render('company_dashboards/remove-member', {company: foundCompany});
			});
	})
	.put(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdmin, middleware.atLeastOneOption,
		async (req, res) => {
			try {
				let membersToDelete = req.body.member;
				let foundCompany = await Company.findById(req.params.companyId);

				if(typeof membersToDelete === "string"){
					let foundUser = await User.findById(membersToDelete);

					foundCompany.member = foundCompany.member.filter(member => !member.equals(foundUser._id));
					foundUser.companiesMember = foundUser.companiesMember.filter(company => !company.equals(foundCompany._id));
					foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has been removed`);

					await foundCompany.save();
					await foundUser.save();

					req.flash('success', `${foundUser.name} has been removed from the team`);
					res.redirect('back')
				} else {
					foundCompany.notifications.unshift(`Members have been removed`);

					for (member of membersToDelete){
						let foundUser = await User.findById(member);

						foundCompany.member = foundCompany.member.filter(memberId => !memberId.equals(foundUser._id));
						foundUser.companiesMember = foundUser.companiesMember.filter(companyId => !companyId.equals(foundCompany._id));

						await foundCompany.save();
						await foundUser.save();

						req.flash('success', `The selected members have been removed from the team`);
						return res.redirect('back')
					}
				}
			} catch(e) {
				req.flash('error', e.mesage);
				return res.redirect('back');
			}
	});

// ************************* BULLETIN BOARD *************************
router.route('/user_profile/:id/company_dashboard/:companyId/bulletin-board')
	.get(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember, (req, res) => {
		Company.findById(req.params.companyId).populate('admin').populate('member').populate('bulletin').exec((err, foundCompany) => {
			if(err){
				req.flash('error', err.message)
				return res.redirect('back');
			}
			res.render('company_dashboards/bulletin-board', {company: foundCompany});
		})
	})
	.post(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember,
		async (req, res) => {
			try{
				let now = new Date();
				let bulletin = {
						message: req.body.bulletin.message,
						submittedBy: req.body.bulletin.submittedBy,
						name: req.body.bulletin.name,
						submittedOn: now,
						date: moment(now).format("M/D/YY"),
						time: moment(now).format("h:mma")
				}
				let foundBulletin = await Bulletin.findById(req.body.bulletinId);
				let foundCompany = await Company.findById(req.params.companyId);

				foundCompany.notifications.unshift(`${req.body.bulletin.name.split(' ')[0]} has posted a bulletin`);
				foundBulletin.bulletins.push(bulletin);

				await foundCompany.save();
				await foundBulletin.save();

				req.flash('success', 'Your bulletin has been posted');
				return res.redirect(`/user_profile/${req.params.id}/company_dashboard/${req.params.companyId}/bulletin-board`);

			} catch(e) {
				req.flash('error', e.message)
				return res.redirect('back');
			}
	});

module.exports = router;
