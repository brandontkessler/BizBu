'use strict';
const path = require('path'),
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	passport = require('passport'),
	helmet = require('helmet'),
	morgan = require('morgan'),
	methodOverride = require('method-override'),
	{ chatIo, config, logger, session,
		homeRoutes, authRoutes, homebaseRoutes, companyDashboardRoutes,
		User, Company, Chat } = require(path.join(__dirname, 'app'))

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"))
app.use(flash())
app.use(helmet())

// EXPRESS SESSION CONFIG
app.use(session)
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('combined', {
	stream: {
		write: message => {
			logger.log('info', message)
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
app.use(homeRoutes)
app.use(authRoutes)
app.use('/homebase', homebaseRoutes)
app.use('/company-dashboard', companyDashboardRoutes)
app.get('*', (req, res) => res.status(404).send('404 unable to find page!'))

// SOCKET
chatIo(io, Chat, User, Company)

server.listen(config.port, () => console.log(`OutOfOffice started on port ${config.port}`))
