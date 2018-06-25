const 	express = require('express'),
				router = express.Router(),
				moment = require('moment'),
				middleware = require('../middleware'),
				User = require('../models/user'),
				Company = require('../models/company'),
				Bulletin = require('../models/bulletin');


// ************************* COMPANY CREATION *************************
router.get('/user_profile/:id/company_dashboard/create', middleware.isLoggedIn, middleware.isProfileOwner, (req, res) => res.render('user_profiles/create-company'));
router.post('/user_profile/:id/company_dashboard/create', middleware.isLoggedIn, middleware.isProfileOwner, (req, res) => {
	User.findById(req.user.id, (err, user) => {
		if(err){
			req.flash('error', 'Unable to find user');
			return res.redirect('back');
		}
		let company = req.body.company;
		let newCompany = new Company({
			name: company.name,
			created: new Date()
		})
		Company.create(newCompany, (err, company) => {
			if(err) {
				req.flash('error', 'Unable to create that company')
				return res.redirect('back');
			}

			// CREATE THE BULLETIN BOARD ASSOCIATED WITH COMPANY
			let newBulletin = new Bulletin({
				'companyRef': company
			});
			Bulletin.create(newBulletin, (err, bulletin) => {
				if(err) {
					req.flash('error', 'Unable to create bulletin board')
					return res.redirect('back');
				}

				// THEN SAVE THE COMPANY INFORMATION
				company.admin.push(req.user._id);
				company.bulletin = bulletin;
				company.notifications.unshift(`${user.name.split(' ')[0]} created ${company.name}`);

				company.save(err => {
					user.companiesAdmin.push(company);
					user.save(err => {
						req.flash('success', 'Welcome to your new company dashboard')
						res.redirect('/user_profile/' + req.user._id + '/company_dashboard/' + company._id);
					});
				});
			});
		});
	});
});

// ************************* COMPANY DASHBOARD *************************
router.get('/user_profile/:id/company_dashboard/:companyId',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdminOrMember,
	(req, res) => {
		Company.findById(req.params.companyId).exec((err, foundCompany) => {
			if(err){
				req.flash('error', `Can't find that company!`)
				return res.redirect('back');
			}
			res.render('company_dashboards', {company: foundCompany});
		});
});

// TEAM PAGE
router.get('/user_profile/:id/company_dashboard/:companyId/team',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdminOrMember,
	(req, res) => {
		Company.findById(req.params.companyId).populate('admin').populate('member').exec((err, foundCompany) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			res.render('company_dashboards/team', {company: foundCompany});
		})
})

// ************************* TEAM INVITE PAGE *************************
router.get('/user_profile/:id/company_dashboard/:companyId/team/invite',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdminOrMember,
	(req, res) => {
		Company.findById(req.params.companyId, (err, foundCompany) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			User.find({}, (err, allUsers) => {
				if(err){
					req.flash('error', err)
					return res.redirect('back');
				}
				res.render('company_dashboards/invite', {users: allUsers, company: foundCompany});
			});
		});
});
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdmin,
	(req, res) => {
		User.find({'inviteCode': req.body.invitee}, (err, foundUser) => {
			if(err || foundUser.length === 0){
				req.flash('error', `That user doesn't exist!`)
				return res.redirect('back');
			}
			let newInvite = req.body.invite;
			let uniqueAdmin = foundUser[0].companiesAdmin.every(companyId => !companyId.equals(newInvite.companyId));
			let uniqueMember = foundUser[0].companiesMember.every(companyId => !companyId.equals(newInvite.companyId));
			let uniqueInvite = foundUser[0].invites.every(invite => invite.companyId !== newInvite.companyId);

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
				foundUser[0].invites.push(newInvite);
				foundUser[0].save(err => {
					req.flash('success', `Your invite has been sent!`)
					res.redirect('/user_profile/' + req.user.id + '/company_dashboard/' + req.params.companyId + '/team')
				});
			}
		});
});

// ************************* ACCEPT INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/accept',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	(req, res) => {
		User.findById(req.user.id, (err, foundUser) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			Company.findById(req.params.companyId, (err, foundCompany) => {
				if(err){
					req.flash('error', err)
					return res.redirect('back')
				}
				let inviteArray = foundUser.invites;
				for (let i=0; i < inviteArray.length; i++){
					if(!foundCompany._id.equals(inviteArray[i].companyId)){
						continue;
					}
					if(foundUser.invites[i].admin){
						foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
						foundUser.companiesAdmin.push(foundCompany);
						foundUser.save(err => {
							foundCompany.admin.push(req.user);
							foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);
							foundCompany.save(err => {
								req.flash('success', `You're now an admin for ${foundCompany.name}`)
								res.redirect("/user_profile/" + req.user.id);
							});
						});
					} else {
						foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
						foundUser.companiesMember.push(foundCompany);
						foundUser.save(err => {
							foundCompany.member.push(req.user);
							foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);
							foundCompany.save(err => {
								req.flash('success', `You're now a member for ${foundCompany.name}`)
								res.redirect("/user_profile/" + req.user.id);
							});
						});
					}
				}
			});
		});
});

// ************************* REJECT INVITE *************************
router.post('/user_profile/:id/company_dashboard/:companyId/team/invite/decline',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	(req, res) => {
		User.findById(req.user.id, (err, foundUser) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			Company.findById(req.params.companyId, (err, foundCompany) => {
				if(err){
					req.flash('error', err)
					return res.redirect('back');
				}
				foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
				foundUser.save(err => {
					foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has rejected the invite`);
					foundCompany.save().then(() => {
						req.flash('success', `You have rejected the invite!`);
						res.redirect("/user_profile/" + req.user.id);
					}).catch(e => {
						console.log(e);
						res.redirect('back')
					})
				});
			});
		});
});

// ************************* GET REMOVE MEMBER PAGE *************************
router.get('/user_profile/:id/company_dashboard/:companyId/team/remove',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdmin,
	(req, res) => {
		Company.findById(req.params.companyId).populate('member').exec((err, foundCompany) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			res.render('company_dashboards/remove-member', {company: foundCompany});
		});
});

// ************************* REMOVE MEMBER(S) *************************
router.put('/user_profile/:id/company_dashboard/:companyId/team/remove',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdmin,
	middleware.atLeastOneOption,
	(req, res) => {
		let membersToDelete = req.body.member;
		Company.findById(req.params.companyId, (err, foundCompany) => {
			if(err){
				req.flash('error', err)
				return res.redirect('back');
			}
			if(typeof membersToDelete === "string"){
				User.findById(membersToDelete, (err, foundUser) => {
					foundCompany.member = foundCompany.member.filter(member => !member.equals(foundUser._id));
					foundUser.companiesMember = foundUser.companiesMember.filter(company => !company.equals(foundCompany._id));
					foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has been removed`);
					foundCompany.save(err => {
						foundUser.save(err => {
							req.flash('success', `${foundUser.name} has been removed from the team`);
							res.redirect('back')
						});
					});
				});
			} else {
				foundCompany.notifications.unshift(`Multiple members have been removed`);
				membersToDelete.forEach(member => {
					User.findById(member, (err, foundUser) => {
						foundCompany.member = foundCompany.member.filter(memberId => !memberId.equals(foundUser._id));
						foundUser.companiesMember = foundUser.companiesMember.filter(companyId => !companyId.equals(foundCompany._id));
						foundCompany.save(err => {
							foundUser.save();
						});
					});
				});
				req.flash('success', `The selected members have been removed from the team`);
				res.redirect('back')
			}
	});
});

// ************************* LEAVE TEAM *************************
router.put('/user_profile/:id/company_dashboard/:companyId/team',
	middleware.isLoggedIn,
	middleware.isProfileOwner,
	middleware.isCompanyAdminOrMember,
	(req, res) => {
		User.findById(req.user.id, (err, foundUser) => {
			if(err){
				req.flash('error', err);
				return res.redirect('back');
			}
			Company.findById(req.params.companyId, (err, foundCompany) => {
				if(err){
					req.flash('error', err);
					return res.redirect('back')
				}
				if(!foundUser.companiesAdmin){
					let companyIndex = foundCompany.member.indexOf(foundUser._id);
					foundCompany.member.splice(companyIndex, 1);
					foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
					foundCompany.save(err => {
						let userIndex = foundUser.companiesMember.indexOf(foundCompany._id);
						foundUser.companiesMember.splice(userIndex, 1);
						foundUser.save(err => {
							req.flash('success', `You have left ${foundCompany.name}`);
							res.redirect('/user_profile/' + foundUser._id)
						});
					});
				} else {
					let userIsMember = foundUser.companiesAdmin.every(companyId => companyId.toString() !== foundCompany._id.toString());
			 		if(userIsMember){
			 			let companyIndex = foundCompany.member.indexOf(foundUser._id);
						foundCompany.member.splice(companyIndex, 1);
						foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
						foundCompany.save(err => {
							let userIndex = foundUser.companiesMember.indexOf(foundCompany._id);
							foundUser.companiesMember.splice(userIndex, 1);
							foundUser.save(err => {
								req.flash('success', `You have left ${foundCompany.name}`);
								res.redirect('/user_profile/' + foundUser._id)
							});
						});
			 		} else {
		 				let companyIndex = foundCompany.admin.indexOf(foundUser._id);
						foundCompany.admin.splice(companyIndex, 1);
						foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
						foundCompany.save(err => {
							let userIndex = foundUser.companiesAdmin.indexOf(foundCompany._id);
							foundUser.companiesAdmin.splice(userIndex, 1);
							foundUser.save(err => {
								req.flash('success', `You have left ${foundCompany.name}`);
								res.redirect('/user_profile/' + foundUser._id)
							});
						});
			 		}
				}
			})
		});
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
	.post(middleware.isLoggedIn, middleware.isProfileOwner, middleware.isCompanyAdminOrMember, (req, res) => {
		let now = new Date();
		let bulletin = {
				message: req.body.bulletin.message,
				submittedBy: req.body.bulletin.submittedBy,
				name: req.body.bulletin.name,
				submittedOn: now,
				date: moment(now).format("M/D/YY"),
				time: moment(now).format("h:mma")
		}
		Bulletin.findById(req.body.bulletinId, (err, foundBulletin) => {
			if(err){
				req.flash('error', err.message)
				return res.redirect('back');
			}
			Company.findById(req.params.companyId, (err, foundCompany) => {
				if(err){
					req.flash('error', err.message)
					return res.redirect('back')
				}
				foundCompany.notifications.unshift(`${req.body.bulletin.name.split(' ')[0]} has posted a bulletin`);
				foundCompany.save().then(() => {
					foundBulletin.bulletins.push(bulletin);
					foundBulletin.save(e => {
						req.flash('success', 'Your bulletin has been posted');
						return res.redirect(`/user_profile/${req.params.id}/company_dashboard/${req.params.companyId}/bulletin-board`);
					})
				});
			});
		});
	});

module.exports = router;
