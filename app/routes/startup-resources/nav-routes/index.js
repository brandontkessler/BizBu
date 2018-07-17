'use strict';
const path = require('path'),
  { User, Company, MyMessages } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))
  
const routeType = 'startup-resources'

let myMessages = async (req, res) => {
  try {
    // Need user to populate menu dropdown
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').populate('myMessages')

    res.render('startup-resources/my-messages', { user, page: 'my-messages' })
  } catch(e) {
    errorHandler(e, req, res, routeType, 'myMessages')
  }
}

let getStartupResourcesStartups = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember')
    let allCompanies = await Company.find()
    let companies = []
    for (let company of allCompanies){
      if(company.companyInfo &&
        company.companyInfo.tagline &&
        company.companyInfo.tagline !== '' &&
        company.companyInfo.description &&
        company.companyInfo.description !== ''){
        companies.push(company)
      }
    }

    res.render('startup-resources/startups', { user, companies, page: 'startups' })

  } catch(e) {
    errorHandler(err, req, res, routeType, 'getStartupResourcesStartups')
  }
}

let getStartupResourcesTalent = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember')
    let allUsers = await User.find()
    let publicUsers = []

    for (let oneUser of allUsers){
      if(oneUser.publicProfile){
        publicUsers.push(oneUser)
      }
    }

    res.render('startup-resources/talent', { user, publicUsers, page: 'talent' })

  } catch(e) {
    errorHandler(err, req, res, routeType, 'getStartupResourcesTalent')
  }
}

let getStartupResourcesServiceProviders = (req, res) => {
  let route = 'getStartupResourcesServiceProviders'
  User.findById(req.user._id).populate('companiesAdmin').populate('companiesMember').exec((err, user) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('startup-resources/service-providers', { user, page: 'service-providers' })
  })
}


module.exports = {
  myMessages,
  getStartupResourcesStartups,
  getStartupResourcesTalent,
  getStartupResourcesServiceProviders
}
