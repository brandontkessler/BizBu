'use strict';
const path = require('path'),
  { User, Company } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

const routeType = 'publicProfile'

let makeMePublic = async (req, res) => {
  try{
    let foundUser = await User.findById(req.user._id)

    foundUser.publicProfile = true
    await foundUser.save()

    res.redirect(`/homebase/user/${req.user._id}`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'makeMePublic')
  }
}

let hideMe = async (req, res) => {
  try{
    let foundUser = await User.findById(req.user._id)

    foundUser.publicProfile = false
    await foundUser.save()

    res.redirect(`/homebase/user/${req.user._id}`)
  } catch(e) {
    errorHandler(e, req, res, routeType, 'hideMe')
  }
}

module.exports = {
  makeMePublic,
  hideMe
}
