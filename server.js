'use strict';
const path = require('path'),
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	helmet = require('helmet'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	BizBu = require(path.join(__dirname, 'app'))

mongoose.connect(BizBu.config.dbURI)
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"))
app.use(flash())
app.use(helmet())

// EXPRESS SESSION CONFIG
app.use(session(BizBu.session))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('combined', {
	stream: {
		write: message => {
			BizBu.logger.log('info', message)
		}
	}
}))

// invoke social authentication
require(path.join(__dirname, 'app', 'auth'))()

// Send data to static files
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
	next()
})

// ROUTES
app.use(BizBu.homeRoutes)
app.use(BizBu.authRoutes)
app.use('/homebase', BizBu.homebaseRoutes)
app.use('/company-dashboard', BizBu.companyDashboardRoutes)
app.get('*', (req, res) => res.status(404).send('404 unable to find page!'))

server.listen(BizBu.config.port, () => console.log(`BizBu started on port ${BizBu.config.port}`))
