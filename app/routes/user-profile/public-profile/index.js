'use strict';
const { User, Company } = require('../../../models'),
  { errorHandler } = require('../../../helpers');

const routeType = 'publicProfile'

let makeMePublic = async (req, res) => {
  try{
    let foundUser = await User.findById(req.user._id);

    foundUser.publicProfile = true;
    await foundUser.save();

    res.redirect(`/user-profile/${req.user._id}`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'makeMePublic');
  }
}

let hideMe = async (req, res) => {
  try{
    let foundUser = await User.findById(req.user._id);

    foundUser.publicProfile = false;
    await foundUser.save();

    res.redirect(`/user-profile/${req.user._id}`);
  } catch(e) {
    errorHandler(e, req, res, routeType, 'hideMe');
  }
}

module.exports = {
  makeMePublic,
  hideMe
}
