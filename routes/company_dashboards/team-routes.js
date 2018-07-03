'use strict';
const User = require('../../models/user'),
  Company = require('../../models/company');

let getTeam = (req, res) => {
  Company.findById(req.params.companyId).populate('admin').populate('member').exec((err, foundCompany) => {
    if(err){
      req.flash('error', err)
      return res.redirect('back');
    }
    res.render('company_dashboards/team', {company: foundCompany});
  })
}

let leaveTeam = async (req, res) => {
  try {
    let foundUser = await User.findById(req.user.id);
    let foundCompany = await Company.findById(req.params.companyId);

    // CHECK IF USER IS MEMBER
    let userIsMember = foundUser.companiesAdmin.every(companyId => companyId.toString() !== foundCompany._id.toString());
    if(userIsMember){
      let companyIndex = foundCompany.member.indexOf(foundUser._id);
      let userIndex = foundUser.companiesMember.indexOf(foundCompany._id);

      foundCompany.member.splice(companyIndex, 1);
      foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
      foundUser.companiesMember.splice(userIndex, 1);

      await foundCompany.save();
      await foundUser.save();

      req.flash('success', `You have left ${foundCompany.name}`);
      return res.redirect('/user_profile/' + foundUser._id)
    }

    // IF NOT MEMBER, THEN USER IS ADMIN
    let companyIndex = foundCompany.admin.indexOf(foundUser._id);
    let userIndex = foundUser.companiesAdmin.indexOf(foundCompany._id);

    foundCompany.admin.splice(companyIndex, 1);
    foundCompany.notifications.unshift(`${foundUser.name.split(' ')[0]} has left the team`);
    foundUser.companiesAdmin.splice(userIndex, 1);

    await foundCompany.save();
    await foundUser.save();

    req.flash('success', `You have left ${foundCompany.name}`);
    return res.redirect('/user_profile/' + foundUser._id)
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }
}

let getInvitePage = async (req, res) => {
  try {
    let foundCompany = await Company.findById(req.params.companyId);
    let allUsers = await User.find({});
    res.render('company_dashboards/invite', {users: allUsers, company: foundCompany});
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('back');
  }
}

let sendInvite = async (req, res) => {
  try {
    let foundUser = await User.findOne({ 'inviteCode': req.body.invitee });

    if(!foundUser){
      req.flash('error', `That user doesn't exist!`)
      return res.redirect('back');
    }

    let newInvite = req.body.invite;

    let uniqueAdmin = foundUser.companiesAdmin.every(companyId => !companyId.equals(newInvite.companyId));
    let uniqueMember = foundUser.companiesMember.every(companyId => !companyId.equals(newInvite.companyId));
    let uniqueInvite = foundUser.invites.every(invite => invite.companyId !== newInvite.companyId);

    if(!uniqueAdmin){
      req.flash('error', `That user's already an admin for this company!`)
      res.redirect('back')
    } else if (!uniqueMember){
      req.flash('error', `That user's already a team member for this company!`)
      res.redirect('back')
    } else if (!uniqueInvite){
      req.flash('error', `There's already an invite pending for the user`)
      res.redirect('back')
    } else {

      await foundUser.invites.push(newInvite);
      await foundUser.save();

      req.flash('success', `Your invite has been sent!`)
      return res.redirect('/user_profile/' + req.user.id + '/company_dashboard/' + req.params.companyId + '/team')
    }
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('back');
  }
}

let acceptInvite = async (req, res) => {
  try {
    let foundUser = await User.findById(req.user.id);
    let foundCompany = await Company.findById(req.params.companyId);
    let inviteArray = foundUser.invites;

    for (let invite of inviteArray) {
      if(!foundCompany._id.equals(invite.companyId)){
        continue;
      }
      if(invite.admin){
        foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
        foundUser.companiesAdmin.push(foundCompany);
        foundCompany.admin.push(req.user);
        foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);

        await foundUser.save();
        await foundCompany.save();

        req.flash('success', `You're now an admin for ${foundCompany.name}`)
        return res.redirect("/user_profile/" + req.user._id);
      } else {
        foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
        foundUser.companiesMember.push(foundCompany);
        foundCompany.member.push(req.user);
        foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has accepted the invite`);

        await foundUser.save();
        await foundCompany.save();

        req.flash('success', `You're now a member for ${foundCompany.name}`)
        return res.redirect("/user_profile/" + req.user.id);
      }
    }
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('back');
  }
}

let declineInvite = async (req, res) => {
  try {
    let foundUser = await User.findById(req.user._id);
    let foundCompany = await Company.findById(req.params.companyId);

    foundUser.invites = foundUser.invites.filter(invite => !invite._id.equals(req.body.inviteId));
    foundCompany.notifications.unshift(`${req.user.name.split(' ')[0]} has rejected the invite`);

    await foundUser.save();
    await foundCompany.save();

    req.flash('success', `You have rejected the invite!`);
    return res.redirect("/user_profile/" + req.user.id);
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }
}

module.exports = {
  getTeam,
  leaveTeam,
  getInvitePage,
  sendInvite,
  acceptInvite,
  declineInvite
}
