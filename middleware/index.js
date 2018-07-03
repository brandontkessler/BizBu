'use strict';
const User = require('../models/user'),
	Company = require('../models/company');

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
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.params.id));
		if(!isNotAdmin){
			return next()
		}
		req.flash('error', `You're not an admin! You can't do that!`);
		res.redirect('back')
	})
};

let isCompanyMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.params.id));
		if(!isNotMember){
			return next()
		}
		req.flash('error', `You're not a member`);
		res.redirect('back')
	})
};

let isCompanyAdminOrMember = (req, res, next) => {
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.params.id));
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.params.id));
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
		console.log("You didn't select anything to delete");
		return res.redirect('/user_profile/' + req.user.id + '/company_dashboard/' + req.params.companyId + '/team/remove')
	}
	next()
}

module.exports = {
	isNotLoggedIn,
	isLoggedIn,
	isProfileOwner,
	isCompanyAdmin,
	isCompanyMember,
	isCompanyAdminOrMember,
	atLeastOneOption
};
