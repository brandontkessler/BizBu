'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'company-dashboards'

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
  getCompanyDashboard,
  postCompanyInfoToDashboard
}
