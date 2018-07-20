'use strict';
const path = require('path'),
  { User, Company, Bulletin, Chat } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'homebase/company'

let getCompanyCreate = (req, res) => {
  res.render('homebase/company/create-company', { page: 'create-company' })
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

    // CREATE CHAT WINDOW
    let newChat = new Chat({
      'companyRef': createdCompany
    })
    let createdChat = await Chat.create(newChat)

    let user = await User.findById(req.user._id)

    newCompany.admin.push(req.user._id)
    newCompany.bulletin = createdBulletin
    newCompany.chat = createdChat
    newCompany.notifications.unshift(`${user.name.split(' ')[0]} created ${req.body.company.name}`)

    await createdChat.save()
    await newCompany.save()
    user.companiesAdmin.push(newCompany)
    await user.save()

    successHandler(req, res, routeType, 'createCompany', newCompany._id)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'createCompany')
  }
}

module.exports = {
  getCompanyCreate,
  createCompany
}
