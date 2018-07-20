'use strict';
const path = require('path'),
  moment = require('moment'),
  { User, Company, MyMessages } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'my-messages'

let getMessages = async (req, res) => {
  try {
    // Need user to populate menu dropdown
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').populate('myMessages')

    res.render('homebase/user/my-messages', { user, page: 'my-messages' })
  } catch(e) {
    errorHandler(e, req, res, routeType, 'getMessages')
  }
}

let sendMessage = async (req, res) => {
  let now = new Date()
  try {
    let message = await MyMessages.findById(req.params.msgId)
    let group = message.userGroup
    let sender = await User.findById(req.user._id)

    for (let member of group) {
      let foundUser = await User.findById(member)
      let msgIndex = foundUser.myMessages.map(function(msg){
        return msg.myMessagesRef.toString()
      }).indexOf(message._id.toString())

      if (msgIndex !== -1) {
        let msgToTop = foundUser.myMessages.splice(msgIndex, 1)[0]
        foundUser.myMessages.unshift(msgToTop)
      } else {
        foundUser.myMessages.unshift({
          'title': `From: ${req.user.name.split(" ")[0]}`,
          'myMessagesRef': message._id
        })
      }

      await foundUser.save()
    }

    message.messages.unshift({
      sentBy: sender.name,
      submittedOn: now,
      date: moment(now).format("M/D/YY"),
      time: moment(now).format("h:mma"),
      text: req.body.text.trim()
    })

    await message.save()

    res.redirect(`/homebase/user/${req.user._id}/my-messages`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'sendMessage')
  }
}

let deleteMessage = async (req, res) => {
  try {
    let user = await User.findById(req.user._id)

    let msgIndex = user.myMessages.map(function(element){
      return element.myMessagesRef.toString()
    }).indexOf(req.params.msgId)

    user.myMessages.splice(msgIndex, 1)

    await user.save()

    res.redirect(`/homebase/user/${req.user._id}/my-messages`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'deleteMessage')
  }
}

let queryMessages = async (req, res) => {
  let route = 'queryMessages'
  try {
    let message = await MyMessages.findById(req.params.msgId)
    let data = ''
    for (let msg of message.messages){
      data += `<li class="actual-message">
        <h4>${msg.sentBy.split(" ")[0]}</h4>
        <h4>${msg.date} - ${msg.time}</h4>
        <p>${msg.text}</p>
        <hr>
        </li>`
    }
    res.send({data})
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

module.exports = {
  getMessages,
  sendMessage,
  deleteMessage,
  queryMessages
}
