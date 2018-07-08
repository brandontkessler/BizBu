'use strict';
const
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	helmet = require('helmet'),
	methodOverride = require('method-override'),
  auth = require('./app/auth'),
	config = require('./app/config'),
	Chat = require('./app/models/chat'),
	User = require('./app/models/user'),
	Company = require('./app/models/company'),
	chatIo = require('./app/socket');

// REQUIRED ROUTES
const	homeRoutes = require('./app/routes/home'),
	authRoutes = require('./app/routes/auth'),
	userRoutes = require('./app/routes/user-profile'),
	companyDashboardRoutes = require('./app/routes/company-dashboards');

mongoose.connect(config.dbURI);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
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
app.use(homeRoutes);
app.use(authRoutes);
app.use('/user_profile', userRoutes);
app.use('/company_dashboard', companyDashboardRoutes);

// 404 page
app.get('*', (req, res) => res.status(404).send('404 unable to find page!'));

// SOCKET
chatIo(io, Chat, User, Company);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('BCO Server started on port ' + PORT));
