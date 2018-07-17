'use strict';
const moment = require('moment'),
  { User, Company, MyMessages } = require('../../../models'),
  { errorHandler } = require('../../../helpers');
const routeType = 'startup-resources';

let sendMessage = async (req, res) => {
  let now = new Date();
  try {
    let message = await MyMessages.findById(req.params.msgId);
    let group = message.userGroup;
    let sender = await User.findById(req.user._id);

    for (let member of group) {
      let foundUser = await User.findById(member);
      let msgIndex = foundUser.myMessages.map(function(msg){
        return msg.myMessagesRef.toString()
      }).indexOf(message._id.toString());

      if (msgIndex !== -1) {
        let msgToTop = foundUser.myMessages.splice(msgIndex, 1)[0];
        foundUser.myMessages.unshift(msgToTop);
      } else {
        foundUser.myMessages.unshift({
          'title': `From: ${req.user.name.split(" ")[0]}`,
          'myMessagesRef': message._id
        });
      }

      await foundUser.save();
    }

    message.messages.unshift({
      sentBy: sender.name,
      submittedOn: now,
      date: moment(now).format("M/D/YY"),
      time: moment(now).format("h:mma"),
      text: req.body.text.trim()
    });

    await message.save();

    res.redirect(`/startup-resources/my-messages`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'sendMessage');
  }
}

let deleteMessage = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    let msgIndex = user.myMessages.map(function(element){
      return element.myMessagesRef.toString();
    }).indexOf(req.params.msgId);

    user.myMessages.splice(msgIndex, 1);

    await user.save();

    res.redirect(`/startup-resources/my-messages`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'deleteMessage');
  }
}

let queryMessages = async (req, res) => {
  let route = 'queryMessages';
  try {
    let message = await MyMessages.findById(req.params.msgId);
    let data = '';
    for (let msg of message.messages){
      data += `<li class="actual-message">
        <h4>${msg.sentBy.split(" ")[0]}</h4>
        <h4>${msg.date} - ${msg.time}</h4>
        <p>${msg.text}</p>
        <hr>
        </li>`
    }
    res.send({data});
  } catch(e) {
    errorHandler(e, req, res, routeType, route);
  }
}


let startMessageWithCompany = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    let company = await Company.findById(req.params.companyId).populate('admin').populate('member');

    // Check if user is part of company already
    let companyUsers = company.admin.concat(company.member);
    for (let companyUser of companyUsers){
      if(companyUser._id.equals(req.user._id)){
        throw "You're already part of this company"
      }
    }

    // Create the message group including the initial user plus all admin of the company
    let group = [req.user._id];
    for (let adminUser of company.admin){
      group.push(adminUser._id);
    }

    // create a new MyMessages
    let newMessage = new MyMessages({
      'userGroup': group
    })
    let createdMessage = await MyMessages.create(newMessage);

    // Save createdMessage to original user
    user.myMessages.unshift({
      'title': `To: ${company.name}`,
      'myMessagesRef': createdMessage
    });
    await user.save();

    /* Populate each group member with data then push created message and save
    * We may not need this. we don't necessarily want users to have a new message block in their
    * inbox before a message is even sent. And we handle that in the send message
    **/
    // for (let adminUser of company.admin){
    //   if(!adminUser.equals(req.user._id)){
    //     let aUser = await User.findById(adminUser);
    //     aUser.myMessages.unshift({
    //       'title': `From: ${user.name.split(" ")[0]}`,
    //       'myMessagesRef': createdMessage
    //     });
    //     await aUser.save();
    //   }
    // }

    res.redirect(`/startup-resources/my-messages`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'startMessageWithCompany');
  }
}

let startMessageWithUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.userId.toString()){
      throw "Why do you want to send a message to yourself?";
    }

    let user1 = await User.findById(req.user._id);
    let publicUser = await User.findById(req.params.userId);

    // Create the message group
    let group = [user1._id, publicUser._id];

    // create a new MyMessages
    let newMessage = new MyMessages({
      'userGroup': group
    })
    let createdMessage = await MyMessages.create(newMessage);

    // Save createdMessage to original user
    user1.myMessages.unshift({
      'title': `To: ${publicUser.name.split(" ")[0]}`,
      'myMessagesRef': createdMessage
    });
    await user1.save();

    res.redirect(`/startup-resources/my-messages`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'startMessageWithUser');
  }
}


module.exports = {
  sendMessage,
  deleteMessage,
  queryMessages,
  startMessageWithCompany,
  startMessageWithUser
}
