'use strict';
const User = require('../../../models/user'),
  Company = require('../../../models/company'),
  Bulletin = require('../../../models/bulletin'),
  Chat = require('../../../models/chat'),
  config = require('../../../config');

let getCompanyCreate = (req, res) => {
  res.render('user_profiles/create-company')
}

let createCompany = async (req, res) => {
  try {
    // CREATE COMPANY
    let newCompany = new Company({
      name: req.body.company.name,
      created: new Date()
    })
    let createdCompany = await Company.create(newCompany);

    // CREATE BULLETIN
    let newBulletin = new Bulletin({
      'companyRef': createdCompany
    });
    let createdBulletin = await Bulletin.create(newBulletin);

    // CREATE CHAT WINDOW
    let newChat = new Chat({
      'companyRef': createdCompany
    });
    let createdChat = await Chat.create(newChat);

    let user = await User.findById(req.user._id);

    newCompany.admin.push(req.user._id);
    newCompany.bulletin = createdBulletin;
    newCompany.chat = createdChat;
    newCompany.notifications.unshift(`${user.name.split(' ')[0]} created ${req.body.company.name}`);

    await createdChat.save();
    await newCompany.save();
    user.companiesAdmin.push(newCompany);
    await user.save();

    req.flash('success', 'Welcome to your new company dashboard')
    return res.redirect(`/company_dashboard/${newCompany._id}`);

  } catch(e) {
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

let getCompanyDashboard = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId);
    let user = await User.findById(req.user._id);

    // ADD USER TO ACTIVE LIST IF NOT ALREADY THERE
    let userIndex = foundCompany.activeUsers.indexOf(req.user._id);
    if(userIndex === -1){
      foundCompany.activeUsers.push(req.user._id);
    }

    user.activeCompanies.push(foundCompany._id);

    await user.save();
    await foundCompany.save();

    let updatedCompany = await Company.findById(req.params.companyId).populate('activeUsers')
    res.render('company_dashboards/dashboard', {company: updatedCompany, host: config.host});
  } catch(e) {
    console.log(e)
    req.flash('error', e.message);
    return res.redirect('back');
  }
}

module.exports = {
  getCompanyCreate,
  createCompany,
  getCompanyDashboard
}
