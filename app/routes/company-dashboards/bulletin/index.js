'use strict';
const path = require('path'),
  moment = require('moment'),
  { User, Company, Bulletin } = require(path.join(process.cwd(), 'app', 'models')),
  { successHandler, errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'company-dashboards'
const route = 'bulletinRoutes'
let now = new Date()

let getBulletinBoard = (req, res) => {
  Company.findById(req.params.companyId).populate('admin').populate('member').populate('bulletin').exec((err, foundCompany) => {
    if(err) errorHandler(err, req, res, routeType, route)
    res.render('company-dashboards/bulletin-board', {company: foundCompany})
  })
}

let postBulletin = async (req, res) => {
  try{
    let bulletin = {
        message: req.body.bulletin.message,
        submittedBy: req.body.bulletin.submittedBy,
        name: req.body.bulletin.name,
        submittedOn: now,
        date: moment(now).format("M/D/YY"),
        time: moment(now).format("h:mma")
    }
    let foundBulletin = await Bulletin.findById(req.body.bulletinId)
    let foundCompany = await Company.findById(req.params.companyId)

    foundCompany.notifications.unshift(`${req.body.bulletin.name.split(' ')[0]} has posted a bulletin`)
    foundBulletin.bulletins.push(bulletin)

    await foundCompany.save()
    await foundBulletin.save()

    successHandler(req, res, routeType, route)
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

let updateBulletin = async (req, res) => {
  try{
    let foundBulletin = await Bulletin.findById(req.body.bulletinId)
    let foundCompany = await Company.findById(req.params.companyId)

    foundCompany.notifications.unshift(`${req.body.name.split(' ')[0]} has updated a bulletin`)
    foundBulletin.bulletins[req.body.bulletinIndex].message = req.body.message

    await foundCompany.save()
    await foundBulletin.save()

    res.send({redirect: `/company-dashboard/${req.params.companyId}/bulletin-board`})
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

let deleteBulletin = async (req, res) => {
  try {
    let foundBulletin = await Bulletin.findById(req.body.bulletinId)

    if (req.body.bulletinIndex > -1){
      foundBulletin.bulletins.splice([req.body.bulletinIndex],1)
    }

    await foundBulletin.save()

    res.send({redirect: `/company-dashboard/${req.params.companyId}/bulletin-board`})
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

let bulletinComment = async (req, res) => {
  try {
    let comment = {
      message: req.body.message,
      submittedBy: req.body.submittedBy,
      name: req.body.name,
      submittedOn: now,
      date: moment(now).format("M/D/YY"),
      time: moment(now).format("h:mma")
    }
    let foundBulletin = await Bulletin.findById(req.body.bulletinId)
    let foundCompany = await Company.findById(req.params.companyId)

    foundCompany.notifications.unshift(`${req.body.name.split(' ')[0]} has commented on a bulletin`)
    foundBulletin.bulletins[req.body.bulletinIndex].comments.push(comment)

    await foundCompany.save()
    await foundBulletin.save()

    res.send({redirect: `/company-dashboard/${req.params.companyId}/bulletin-board`})
  } catch(e) {
    errorHandler(e, req, res, routeType, route)
  }
}

module.exports = {
  getBulletinBoard,
  postBulletin,
  updateBulletin,
  deleteBulletin,
  bulletinComment
}
