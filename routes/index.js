const	express = require('express'),
			router = express.Router(),
			passport = require('passport'),
			middleware = require('../middleware'),
			User = require('../models/user');

// HOME PAGE
router.get('/', (req, res) => res.render('home'));

// SIGN UP ROUTES
router.get('/signup', (req, res) => res.render('signup'));
// router.post('/signup', middleware.isNotLoggedIn, (req, res) => {
// 	if(req.body.password !== req.body.confirm){
// 		req.flash('error', 'Passwords do not match!');
// 		return res.redirect('back');
// 	}
//
// 	let newUser = new User({
// 		username: req.body.username,
// 		password: req.body.password
// 	});
// 	newUser.save().then(() => {
// 		passport.authenticate('local')(req, res, function(){
// 			req.flash('success', `Welcome to your profile page. Create a company to get started!`);
// 			res.redirect('/user_profile/' + newUser._id);
// 		});
// 	}).catch((e) => {
// 		if(e.name === 'BulkWriteError'){
// 			req.flash('error', 'A user with that email already exists')
// 			return res.redirect('/signup')
// 		}
// 		console.log(e)
// 		req.flash('error', 'whoa this is an error');
// 		res.redirect('/signup');
// 	})
// });

// LOGIN ROUTES
router.get('/login', (req, res) => res.render('login'));
// router.post('/login', middleware.isNotLoggedIn, passport.authenticate('local',
// 	{
// 		failureRedirect: '/login',
// 		failureFlash: true
// 	}), (req, res) => {
// 		req.flash('success', `Welcome back!`);
// 		res.redirect('/user_profile/' + req.user._id)
// 	});

// FB routes
router.get('/auth/facebook', passport.authenticate('facebook', {
	scope : ['public_profile', 'email']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/login',
	failureFlash: true
}), (req, res) => {
	req.flash('success', 'Facebook login successful')
	res.redirect('/user_profile/' + req.user._id)
});

// LinkedIn routes
router.get('/auth/linkedin', passport.authenticate('linkedin', {
	scope: ['r_basicprofile', 'r_emailaddress']
}));

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
	failureRedirect: '/login',
	failureFlash: true
}), (req, res) => {
	req.flash('success', 'LinkedIn login successful')
	res.redirect('/user_profile/' + req.user._id)
});

// LOGOUT
router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success", "See ya later");
	res.redirect('/');
});

module.exports = router;
