'use strict';
const path = require('path'),
  { User, Company, MyMessages } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'startup-resources'

let startups = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember')
    let allCompanies = await Company.find().populate('checklist')
    let companies = []
    for (let company of allCompanies){
      if(company.checklist.checklistData.public === 'True' &&
        company.checklist.checklistData.tagline &&
        company.checklist.checklistData.tagline !== '' &&
        company.checklist.checklistData.description &&
        company.checklist.checklistData.description !== ''){
        companies.push(company)
      }
    }

    res.render('homebase/startup-resources/startups', { user, companies, page: 'startups' })

  } catch(e) {
    errorHandler(err, req, res, routeType, 'startups')
  }
}

let messageStartup = async (req, res) => {
  try {
    let user = await User.findById(req.user._id)
    let company = await Company.findById(req.params.companyId).populate('admin').populate('member')

    // Check if user is part of company already
    let companyUsers = company.admin.concat(company.member)
    for (let companyUser of companyUsers){
      if(companyUser._id.equals(req.user._id)){
        throw "You're already part of this company"
      }
    }

    // Create the message group including the initial user plus all admin of the company
    let group = [req.user._id]
    for (let adminUser of company.admin){
      group.push(adminUser._id)
    }

    // create a new MyMessages
    let newMessage = new MyMessages({
      'userGroup': group
    })
    let createdMessage = await MyMessages.create(newMessage)

    // Save createdMessage to original user
    user.myMessages.unshift({
      'title': `To: ${company.name}`,
      'myMessagesRef': createdMessage
    })
    await user.save()

    /* Populate each group member with data then push created message and save
    * We may not need this. we don't necessarily want users to have a new message block in their
    * inbox before a message is even sent. And we handle that in the send message
    **/
    // for (let adminUser of company.admin){
    //   if(!adminUser.equals(req.user._id)){
    //     let aUser = await User.findById(adminUser)
    //     aUser.myMessages.unshift({
    //       'title': `From: ${user.name.split(" ")[0]}`,
    //       'myMessagesRef': createdMessage
    //     })
    //     await aUser.save()
    //   }
    // }

    res.redirect(`/homebase/user/${req.user._id}/my-messages`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'messageCompany')
  }
}

module.exports = {
  startups,
  messageStartup
}
