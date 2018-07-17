'use strict';
const path = require('path'),
  { User, Company, Bulletin, Chat } = require(path.join(process.cwd(), 'app', 'models')),
  config = require(path.join(process.cwd(), 'app', 'config')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'company-dashboards'

let getCompanyCreate = (req, res) => {
  res.render('user-profiles/create-company')
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

let getCompanyDashboard = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let user = await User.findById(req.user._id)

    // ADD USER TO ACTIVE LIST IF NOT ALREADY THERE
    let userIndex = foundCompany.activeUsers.indexOf(req.user._id)
    if(userIndex === -1){
      foundCompany.activeUsers.push(req.user._id)
    }

    user.activeCompanies.push(foundCompany._id)

    await user.save()
    await foundCompany.save()

    let updatedCompany = await Company.findById(req.params.companyId).populate('activeUsers')
    res.render('company-dashboards', { company: updatedCompany })
  } catch(e) {
    errorHandler(e, req, res, routeType, 'getCompanyDashboard')
  }
}

let postCompanyInfoToDashboard = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let needs = []
    for (let need of req.body.needs.split(",")) {
      needs.push(need.trim())
    }

    let companyInfo = {
      tagline: req.body.tagline,
      description: req.body.description,
      needs: needs
    }

    foundCompany.companyInfo = companyInfo;

    await foundCompany.save()

    let updatedCompany = await Company.findById(req.params.companyId).populate('activeUsers')
    res.render('company-dashboards', { company: updatedCompany })
  } catch(e) {
    errorHandler(e, req, res, routeType, 'postCompanyInfoToDashboard')
  }
}

module.exports = {
  getCompanyCreate,
  createCompany,
  getCompanyDashboard,
  postCompanyInfoToDashboard
}
