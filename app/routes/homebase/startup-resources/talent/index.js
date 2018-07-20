'use strict';
const path = require('path'),
  { User, MyMessages } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'startup-resources'

let talent = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember')
    let allUsers = await User.find()
    let publicUsers = []

    for (let oneUser of allUsers){
      if(oneUser.publicProfile){
        publicUsers.push(oneUser)
      }
    }

    res.render('homebase/startup-resources/talent', { user, publicUsers, page: 'talent' })

  } catch(e) {
    errorHandler(err, req, res, routeType, 'talent')
  }
}

let messageTalent = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.userId.toString()){
      throw "Why do you want to send a message to yourself?"
    }

    let user1 = await User.findById(req.user._id)
    let publicUser = await User.findById(req.params.userId)

    // Create the message group
    let group = [user1._id, publicUser._id]

    // create a new MyMessages
    let newMessage = new MyMessages({
      'userGroup': group
    })
    let createdMessage = await MyMessages.create(newMessage)

    // Save createdMessage to original user
    user1.myMessages.unshift({
      'title': `To: ${publicUser.name.split(" ")[0]}`,
      'myMessagesRef': createdMessage
    })
    await user1.save()

    res.redirect(`/homebase/user/${req.user._id}/my-messages`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'messageTalent')
  }
}


module.exports = {
  talent,
  messageTalent
}
