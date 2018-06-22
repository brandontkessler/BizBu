const User = require('../models/user'),
	  Company = require('../models/company');

let middlewareObject = {};

middlewareObject.isNotLoggedIn = function(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	req.flash('error', `You're already logged in!`);
	res.redirect("/login");
};

middlewareObject.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', `You must be logged in!`);
	res.redirect("/login");
};

middlewareObject.isProfileOwner = function(req, res, next){
	if(req.user._id.toString() === req.params.id){
		return next();
	}
	req.flash('error', `That's not your profile!`);
	res.redirect("/user_profile/" + req.user._id);
};

middlewareObject.isCompanyAdmin = function(req, res, next){
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotAdmin = foundCompany.admin.every(userId => !userId.equals(req.params.id));
		if(!isNotAdmin){
			return next()
		}
		req.flash('error', `You're not an admin! You can't do that!`);
		res.redirect('back')
	})
};

middlewareObject.isCompanyMember = function(req, res, next){
	Company.findById(req.params.companyId, (err, foundCompany) => {
		let isNotMember = foundCompany.member.every(userId => !userId.equals(req.params.id));
		if(!isNotMember){
			return next()
		}
		req.flash('error', `You're not a member`);
		res.redirect('back')
	})
};

middlewareObject.isCompanyAdminOrMember = function(req, res, next){
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
middlewareObject.atLeastOneOption = function(req, res, next){
	if(!req.body.member){
		console.log("You didn't select anything to delete");
		return res.redirect('/user_profile/' + req.user.id + '/company_dashboard/' + req.params.companyId + '/team/remove')
	}
	next()
}

module.exports = middlewareObject;
