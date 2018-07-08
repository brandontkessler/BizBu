'use strict';
const moment = require('moment'),
  { User, Company, Bulletin } = require('../../../models');
  
let getBulletinBoard = (req, res) => {
  Company.findById(req.params.companyId).populate('admin').populate('member').populate('bulletin').exec((err, foundCompany) => {
    if(err){
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
    console.log(e)
    req.flash('error', e.message)
    return res.redirect('back');
  }
}

module.exports = {
  getBulletinBoard,
  postBulletin
}
