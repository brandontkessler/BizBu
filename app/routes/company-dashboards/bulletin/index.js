'use strict';
const moment = require('moment'),
  { User, Company, Bulletin } = require('../../../models'),
  logger = require('../../../logger');

let getBulletinBoard = (req, res) => {
  Company.findById(req.params.companyId).populate('admin').populate('member').populate('bulletin').exec((err, foundCompany) => {
    if(err){
      logger.log('error', `routes/company-dashboards/bulletin - getBulletinBoard: ${err}`)
      req.flash('error', err.message)
      return res.redirect('back');
    }
    res.render('company_dashboards/bulletin-board', {company: foundCompany});
  })
}

let postBulletin = async (req, res) => {
  try{
    let now = new Date();
    let bulletin = {
        message: req.body.bulletin.message,
        submittedBy: req.body.bulletin.submittedBy,
        name: req.body.bulletin.name,
        submittedOn: now,
        date: moment(now).format("M/D/YY"),
        time: moment(now).format("h:mma")
    }
    let foundBulletin = await Bulletin.findById(req.body.bulletinId);
    let foundCompany = await Company.findById(req.params.companyId);

    foundCompany.notifications.unshift(`${req.body.bulletin.name.split(' ')[0]} has posted a bulletin`);
    foundBulletin.bulletins.push(bulletin);

    await foundCompany.save();
    await foundBulletin.save();

    req.flash('success', 'Your bulletin has been posted');
    return res.redirect(`/company_dashboard/${req.params.companyId}/bulletin-board`);

  } catch(e) {
    logger.log('error', `routes/company-dashboards/bulletin - postBulletin: ${e}`)
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

let updateBulletin = async (req, res) => {
  try{
    let body = req.body;
    let foundBulletin = await Bulletin.findById(body.bulletinId);
    let foundCompany = await Company.findById(req.params.companyId);

    foundCompany.notifications.unshift(`${req.body.name.split(' ')[0]} has updated a bulletin`);
    foundBulletin.bulletins[req.body.bulletinIndex].message = body.message;

    await foundCompany.save();
    await foundBulletin.save();

    res.send({redirect: `/company_dashboard/${req.params.companyId}/bulletin-board`});

  } catch(e) {
    logger.log('error', `routes/company-dashboards/bulletin - updateBulletin: ${e}`)
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

let deleteBulletin = async (req, res) => {
  try {
    let body = req.body;
    let foundBulletin = await Bulletin.findById(body.bulletinId);

    if (req.body.bulletinIndex > -1){
      foundBulletin.bulletins.splice([req.body.bulletinIndex],1)
    }

    await foundBulletin.save();

    res.send({redirect: `/company_dashboard/${req.params.companyId}/bulletin-board`});

  } catch(e) {
    logger.log('error', `routes/company-dashboards/bulletin - deleteBulletin: ${e}`)
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

let bulletinComment = async (req, res) => {
  try {
    let body = req.body;
    let now = new Date();
    let comment = {
      message: body.message,
      submittedBy: body.submittedBy,
      name: body.name,
      submittedOn: now,
      date: moment(now).format("M/D/YY"),
      time: moment(now).format("h:mma")
    }
    let foundBulletin = await Bulletin.findById(body.bulletinId);
    let foundCompany = await Company.findById(req.params.companyId);

    foundCompany.notifications.unshift(`${req.body.name.split(' ')[0]} has commented on a bulletin`);
    foundBulletin.bulletins[req.body.bulletinIndex].comments.push(comment);

    await foundCompany.save();
    await foundBulletin.save();

    res.send({redirect: `/company_dashboard/${req.params.companyId}/bulletin-board`});

  } catch(e) {
    logger.log('error', `routes/company-dashboards/bulletin - bulletinComment: ${e}`)
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

module.exports = {
  getBulletinBoard,
  postBulletin,
  updateBulletin,
  deleteBulletin,
  bulletinComment
}
