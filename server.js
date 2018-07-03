'use strict';
const express = require('express'),
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	helmet = require('helmet'),
	methodOverride = require('method-override'),
  auth = require('./auth'),
	config = require('./config');

// REQUIRED ROUTES
const	indexRoutes = require('./routes/index'),
	userProfiles = require('./routes/user_profiles'),
	companyDashboards = require('./routes/company_dashboards');

mongoose.connect(config.dbURI);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(helmet());

// EXPRESS SESSION CONFIG
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());

// invoke social authentication
auth();

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
