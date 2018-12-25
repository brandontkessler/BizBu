'use strict';
const path = require('path'),
  { Company, Checklist } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'company-dashboards'
const route = 'checklistRoutes'

// ********************** GENERAL ********************************
let getGeneral = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/general', {company: foundCompany})
  })
}

let postGeneral = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - General`)
    foundChecklist.checklistData.tagline = req.body.tagline
    foundChecklist.checklistData.mission = req.body.mission
    foundChecklist.checklistData.description = req.body.description
    foundChecklist.checklistData.founderBios = req.body.founderBios
    foundChecklist.checklistData.introVideo = req.body.introVideo

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, "checklistGeneral")
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

// ********************** RESEARCH ********************************
let getResearch = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/research', {company: foundCompany})
  })
}

let postResearch = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - Research`)
    foundChecklist.checklistData.endUser = req.body.endUser
    foundChecklist.checklistData.competition = req.body.competition
    foundChecklist.checklistData.revenue = req.body.revenue
    foundChecklist.checklistData.marketSize = req.body.marketSize

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, 'checklistResearch')
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

// ********************** PRODUCT ********************************
let getProduct = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/product', {company: foundCompany})
  })
}

let postProduct = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - Product`)
    foundChecklist.checklistData.prototype = req.body.prototype

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, 'checklistProduct')
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

// ********************** MARKETING ********************************
let getMarketing = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/marketing', {company: foundCompany})
  })
}

let postMarketing = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - Marketing`)
    foundChecklist.checklistData.userAcquisition = req.body.userAcquisition
    foundChecklist.checklistData.acquisitionCost = req.body.acquisitionCost
    foundChecklist.checklistData.initialCustomersPlan = req.body.initialCustomersPlan

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, 'checklistMarketing')
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

// ********************** LEGAL ********************************
let getLegal = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/legal', {company: foundCompany})
  })
}

let postLegal = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - Legal`)
    foundChecklist.checklistData.legal = req.body.legal

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, 'checklistLegal')
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

// ********************** FINANCIALS ********************************
let getFinancials = (req, res) => {
  Company.findById(req.params.companyId).populate('checklist').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/checklist/financials', {company: foundCompany})
  })
}

let postFinancials = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId)
    let foundChecklist = await Checklist.findById(foundCompany.checklist)

    foundCompany.notifications.unshift(`Update made to Checklist - Financials`)
    foundChecklist.checklistData.financialResources = req.body.financialResources

    await foundCompany.save()
    await foundChecklist.save()

    successHandler(req, res, routeType, 'checklistFinancials')
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

module.exports = {
  getGeneral,
  postGeneral,
  getResearch,
  postResearch,
  getProduct,
  postProduct,
  getMarketing,
  postMarketing,
  getLegal,
  postLegal,
  getFinancials,
  postFinancials
}
