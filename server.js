'use strict';
const express = require('express'),
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
  auth = require('./auth'),
	config = require('./config'),
	Chat = require('./models/chat'),
	User = require('./models/user');

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

io.on('connection', socket => {
  socket.on('joinChat', async data => {
		try{
			let chatRoom = await Chat.findById(data.chatId);
			if(chatRoom !== null && chatRoom.messages !== null && chatRoom.messages.length !== 0){
				socket.emit('populate chat', chatRoom.messages);
			}
			socket.join(data.chatId);
		} catch(e) {
			console.log(e)
		}
  });

	socket.on('chat message', async data => {
		try {
			let chatRoom = await Chat.findById(data.chatId);
			if(chatRoom !== null){
				chatRoom.messages.push({
					user: data.userName.split(" ")[0],
					message: data.chatMessage
				})
				chatRoom.save();
				io.to(data.chatId).emit('new message', data);
			}
		} catch(e){
			console.log(e);
		}
	});

	socket.on('set hide true', async data => {
		try {
			let user = await User.findById(data.userId);
			user.hideChat = true;
			user.save();
		} catch(e){
			console.log(e)
		}
	})

	socket.on('set hide false', async data => {
		try {
			let user = await User.findById(data.userId);
			user.hideChat = false;
			user.save();
		} catch(e){
			console.log(e)
		}
	})

	socket.on('disconnect', () => {
		console.log('socket disconnected')
  });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('BCO Server started on port ' + PORT));
