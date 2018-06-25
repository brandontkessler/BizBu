const 	express = require('express'),
				app = express(),
				session = require('express-session'),
				bodyParser = require('body-parser'),
				flash = require('connect-flash'),
				mongoose = require('mongoose'),
				passport = require('passport'),
				helmet = require('helmet'),
				// LocalStrategy = require('passport-local').Strategy,
				FacebookStrategy = require('passport-facebook').Strategy,
				LinkedinStrategy = require('passport-linkedin').Strategy,
				methodOverride = require('method-override'),
				User = require('./models/user');

require('dotenv').config();

// REQUIRED ROUTES
const	indexRoutes = require('./routes/index'),
			userProfiles = require('./routes/user_profiles'),
			companyDashboards = require('./routes/company_dashboards');

mongoose.connect('mongodb://localhost/bco');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(helmet());

// EXPRESS SESSION CONFIG
app.use(session(
	{
		secret: process.env.SECRET_HASH,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true
			// Uncomment for SSL
			// secure: true
		}
	}
));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 		User.findOne({ username: username }, function(err, user) {
//
// 			if(err) {
// 				console.log('localstraterror', err);
// 				return done(err);
// 			}
//
// 			if(!user) {
// 				console.log('user does not exist')
// 				return done(null, false, { message: 'Unable to log in' });
// 			}
//
// 			if (!user.comparePassword(password)) {
// 				console.log('passwords do not match')
// 			  return done(null, false, { message: 'Unable to log in' });
// 		 	}
//
// 			return done(null, user);
// 		});
// 	}
// ));

passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: "http://localhost:3000/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
	},
	async (accessToken, refreshToken, profile, done) => {
		try{
			let user = await User.findOne({ email : profile.emails[0].value });
			if(!user){
				// IF USER DOES NOT EXIST, CREATE ONE WITH FB
				let newUser = new User({
					'email' : profile.emails[0].value,
					'created' : new Date(),
					'name' : profile.displayName,
					'pic' : profile.photos[0].value,
					'facebook.id' : profile.id,
					'facebook.accessToken' : accessToken
				});

				await newUser.save()
				return done(null, newUser)
			} else {
				// IF USER DOES EXIST, CHECK IF DONE WITH FB
				let fbUser =  await User.findOne({ 'facebook.id' : profile.id });
				if(fbUser) return done(null, fbUser);

				// IF NOT, USER IS LINKEDIN, CREATE FB DATA
				user.facebook.id = profile.id;
				user.facebook.accessToken = accessToken;

				await user.save()
				return done(null, user)
			}
		} catch(e) {
			return done(e);
		}
	}
))

passport.use(new LinkedinStrategy({
		consumerKey: process.env.LINKEDIN_CLIENT_ID,
		consumerSecret: process.env.LINKEDIN_CLIENT_SECRET,
		callbackURL: 'http://localhost:3000/auth/linkedin/callback',
		profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url', 'industry', 'positions']
	},
	async (token, tokenSecret, profile, done) => {
		try{
			let user = await User.findOne({ email : profile.emails[0].value });
			if(!user){
				// IF USER DOES NOT EXIST, CREATE ONE WITH LINKEDIN
				let newUser = new User({
					'email' : profile.emails[0].value,
					'created' : new Date(),
					'name' : profile.displayName,
					'pic' : profile._json.pictureUrl,
					'linkedin.id' : profile.id,
					'linkedin.token' : token
				});

				await newUser.save()
				return done(null, newUser)
			} else {
				// IF USER DOES EXIST, CHECK IF DONE WITH LINKEDIN
				let linkedinUser =  await User.findOne({ 'linkedin.id' : profile.id });
				if(linkedinUser) return done(null, linkedinUser);

				// IF NOT, USER IS FB, CREATE LINKEDIN DATA
				user.linkedin.id = profile.id;
				user.linkedin.token = token;

				await user.save()
				return done(null, user)
			}
		} catch(e) {
			return done(e)
		}
	}
))

passport.serializeUser(function(user, done){
	done(null, user.id)
});
passport.deserializeUser(function(id, done){
	User.findOne({'_id': id}, function(err, user) {
		done(err, user);
	})
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
	next();
});

// ROUTES
app.use(indexRoutes);
app.use('/user_profile', userProfiles);
app.use(companyDashboards);

// 404 page
app.get('*', (req, res) => res.status(404).send('unable to find page!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('BCO Server started on port ' + PORT));
