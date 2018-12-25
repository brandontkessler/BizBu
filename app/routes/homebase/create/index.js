'use strict';
const path = require('path'),
  { User, Company, Bulletin, Chat, Checklist } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'homebase'

let getCreateCompany = (req, res) => {
  res.render('homebase/create', { page: 'create' })
}

let createCompany = async (req, res) => {
  try {
    // CREATE COMPANY
    let newCompany = new Company({
      name: req.body.company.name,
      created: new Date()
    })
    let createdCompany = await Company.create(newCompany)

    // CREATE BULLETIN
    let newBulletin = new Bulletin({
      'companyRef': createdCompany
    })
    let createdBulletin = await Bulletin.create(newBulletin)

    // CREATE CHECKLIST
    let newChecklist = new Checklist({
      'companyRef': createdCompany
    })
    let createdChecklist = await Checklist.create(newChecklist)

    // CREATE CHAT WINDOW
    let newChat = new Chat({
      'companyRef': createdCompany
    })
    let createdChat = await Chat.create(newChat)

    let user = await User.findById(req.user._id)

    newCompany.admin.push(req.user._id)
    newCompany.bulletin = createdBulletin
    newCompany.checklist = createdChecklist
    newCompany.chat = createdChat
    newCompany.notifications.unshift(`${user.name.split(' ')[0]} created ${req.body.company.name}`)

    await newCompany.save()
    user.companiesAdmin.push(newCompany)
    await user.save()

    successHandler(req, res, routeType, 'createCompany', newCompany._id)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'createCompany')
  }
}

module.exports = {
  getCreateCompany,
  createCompany
}
