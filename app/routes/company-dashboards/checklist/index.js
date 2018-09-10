'use strict';
const path = require('path'),
  { Company, Checklist } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'company-dashboards'
const route = 'checklistRoutes'

let getChecklist = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist', {company: foundCompany})
  })
}

let saveChecklist = async (req, res) => {
  try {
    let newChecklistData = {
      tagline: req.body.tagline,
      description: req.body.description,
      location: req.body.location,
      assumptions: req.body.assumptions,
      endUser: req.body.endUser,
      seekingCofounder: req.body.seekingCoFounder,
      founderBios: req.body.founderBios,
      introVideo: req.body.introVideo,
      prototype: req.body.prototype,
      competition: req.body.competition,
      revenue: req.body.revenue,
      marketFinancialModel: req.body.marketFinancialModel,
      userAcquisition: req.body.userAcquisition,
      legal: req.body.legal,
      financialResources: req.body.financialResources,
      initialCustomersPlan: req.body.initialCustomersPlan
    }

    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Updates have been made to the checklist`)
    foundChecklist.checklistData = newChecklistData

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, route)
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}


module.exports = {
  getChecklist,
  saveChecklist
}
