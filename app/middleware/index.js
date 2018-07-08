'use strict';
const { User, Company } = require('../models');

let isNotLoggedIn = (req, res, next) => {
	if(!req.isAuthenticated()){
		return next();
	}
	req.flash('error', `You're already logged in!`);
	res.redirect("/get-started");
};

let isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', `You must be logged in!`);
	res.redirect("/get-started");
};

let isProfileOwner = (req, res, next) => {
	if(req.user._id.toString() === req.params.id){
		return next();
	}
	req.flash('error', `That's not your profile!`);
	res.redirect("/user_profile/" + req.user._id);
};

let isCompanyAdmin = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.user._id));
		if(!isNotAdmin){
			return next()
		}
		req.flash('error', `You're not an admin! You can't do that!`);
		res.redirect('back')
	})
};

let isCompanyMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.user._id));
		if(!isNotMember){
			return next()
		}
		req.flash('error', `You're not a member`);
		res.redirect('back')
	})
};

let isCompanyAdminOrMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.user._id));
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.user._id));
		if(!isNotMember || !isNotAdmin){
			return next()
		}
		req.flash('error', `You're not on the team for that company!`);
		res.redirect('back')
	})
};

// USED FOR REMOVING MEMBERS --- MUST SELECT AT LEAST ONE TO REMOVE TO TRIGGER ROUTE
let atLeastOneOption = (req, res, next) => {
	if(!req.body.member){
		req.flash('error', `You didn't select anything to delete`);
		return res.redirect('/user_profile/' + req.user._id + '/company_dashboard/' + req.params.companyId + '/team/remove')
	}
	next()
}

// REMOVE ACTIVE COMPANIES ANd USER ON LOGOUT
let activeRemoveLogout = async (req, res, next) => {
	let foundUser = await User.findById(req.user._id);
	foundUser.activeCompanies = [];
	await foundUser.save();

	let companies = req.user.activeCompanies;
	for (let company of companies){
		let foundCompany = await Company.findById(company)
		let index = foundCompany.activeUsers.indexOf(req.user._id);
		if (index > -1) {
			foundCompany.activeUsers.splice(index, 1);
			await foundCompany.save();
		}
	}

	next()
}

// REMOVE ACTIVE COMPANY AND USER ON PAGE LEAVE
let activeRemovePageLeave = async (req, res, next) => {
	try{
		if(!req.user){
			return next()
		}

		let foundUser = await User.findById(req.user._id);
		let companies = foundUser.activeCompanies;

		for (let companyId of companies){
			let company = await Company.findById(companyId)
			let userIndex = company.activeUsers.indexOf(req.user._id);

			if (userIndex !== -1) {
				let companyIndex = foundUser.activeCompanies.indexOf(companyId);
				if(companyIndex !== -1){
					foundUser.activeCompanies.splice(companyIndex, 1);
					await foundUser.save();
				}

				company.activeUsers.splice(userIndex, 1);
				await company.save();
			}
		}
		next()
	} catch(e){
		console.log(e)
	}
}

module.exports = {
	isNotLoggedIn,
	isLoggedIn,
	isProfileOwner,
	isCompanyAdmin,
	isCompanyMember,
	isCompanyAdminOrMember,
	atLeastOneOption,
	activeRemoveLogout,
	activeRemovePageLeave
};
