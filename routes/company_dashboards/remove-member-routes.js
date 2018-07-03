'use strict';
const User = require('../../models/user'),
  Company = require('../../models/company');

let removeMemberPage = (req, res) => {
  Company.findById(req.params.companyId).populate('member').exec((err, foundCompany) => {
    if(err){
      req.flash('error', err)
      return res.redirect('back');
    }
    res.render('company_dashboards/remove-member', {company: foundCompany});
  });
}

let removeMember = async (req, res) => {
  try {
    let membersToDelete = req.body.member;
    let foundCompany = await Company.findById(req.params.companyId);

    if(typeof membersToDelete === "string"){
      let foundUser = await User.findById(membersToDelete);

      foundCompany.member = foundCompany.member.filter(member => !member.equals(foundUser._id));
      foundUser.companiesMember = foundUser.companiesMember.filter(company => !company.equals(foundCompany._id));
      foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has been removed`);

      await foundCompany.save();
      await foundUser.save();

      req.flash('success', `${foundUser.name} has been removed from the team`);
      res.redirect('back')
    } else {
      foundCompany.notifications.unshift(`Members have been removed`);

      for (member of membersToDelete){
        let foundUser = await User.findById(member);

        foundCompany.member = foundCompany.member.filter(memberId => !memberId.equals(foundUser._id));
        foundUser.companiesMember = foundUser.companiesMember.filter(companyId => !companyId.equals(foundCompany._id));

        await foundCompany.save();
        await foundUser.save();

        req.flash('success', `The selected members have been removed from the team`);
        return res.redirect('back')
      }
    }
  } catch(e) {
    req.flash('error', e.mesage);
    return res.redirect('back');
  }
}

module.exports = {
  removeMemberPage,
  removeMember
}
