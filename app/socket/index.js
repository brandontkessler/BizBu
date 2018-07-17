'use strict';
const path = require('path'),
  { validation } = require(path.join(process.cwd(), 'app', 'helpers')),
  logger = require(path.join(process.cwd(), 'app', 'logger'))

module.exports = (io, Chat, User, Company) => {
  io.on('connection', socket => {
    socket.on('joinChat', async data => {
  		try{
  			let chatRoom = await Chat.findById(data.chatId)
  			if(chatRoom !== null && chatRoom.messages !== null && chatRoom.messages.length !== 0){
  				socket.emit('populate chat', chatRoom.messages)
  			}
  			socket.join(data.chatId)
  		} catch(e) {
        logger.log('error', `socket - joinChat: ${e}`)
  		}
    })

    socket.on('active user', async data => {
      try {
        let company = await Company.findById(data.companyId).populate('activeUsers')
        let activeUsers = []

        for(let activeUser of company.activeUsers){
          activeUsers.push(activeUser.name)
        }

        io.to(data.chatId).emit('populate active users', activeUsers)

      } catch(e) {
        logger.log('error', `socket - active user: ${e}`)
      }
    })

  	socket.on('chat message', async (data, callback) => {
  		try {
        if(!validation.isRealString(data.chatMessage)){
          return callback("Message must contain content")
        }
  			let chatRoom = await Chat.findById(data.chatId)
  			if(chatRoom !== null){
  				chatRoom.messages.push({
  					user: data.userName.split(" ")[0],
  					message: data.chatMessage
  				})
  				chatRoom.save()
  				io.to(data.chatId).emit('new message', data)
  			}
  		} catch(e){
        logger.log('error', `socket - chat message: ${e}`)
        return callback(e)
  		}
  	})

  	socket.on('set hide true', async data => {
  		try {
  			let user = await User.findById(data.userId)
  			user.hideChat = true
  			user.save()
  		} catch(e){
        logger.log('error', `socket - set hide true: ${e}`)
  		}
  	})

  	socket.on('set hide false', async data => {
  		try {
  			let user = await User.findById(data.userId)
  			user.hideChat = false
  			user.save()
  		} catch(e){
        logger.log('error', `socket - set hide false: ${e}`)
  		}
  	})

  	socket.on('disconnect', () => {
  		console.log('socket disconnected')
    })
  })
}
