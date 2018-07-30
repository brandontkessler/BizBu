'use strict';
const path = require('path'),
  h = require(path.join(process.cwd(), 'app', 'helpers')),
  { User } = require(path.join(process.cwd(), 'app', 'models')),
  { errorHandler } = require(path.join(process.cwd(), 'app', 'helpers'))

let errorType = 'middleware'

let userDoesNotExist = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username })
    if(user){
      req.flash('error', `A user is registered with that email`)
      return res.redirect('back')
    }
    next()
  } catch(e) {
    req.flash('error', `A user is registered with that email`)
    return res.redirect('back')
  }
}

let confirmPassword = (req, res, next) => {
  if(req.body.password !== req.body.confirmPassword){
    return errorHandler(errorType, req, res, 'confirmPassword')
  }
  next()
}

let userExists = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username })
    if(!user){
      req.flash('error', `That user doesn't exist`)
      return res.redirect('back')
    }
    next()
  } catch(e) {
    req.flash('error', `That user doesn't exist`)
    res.redirect('back')
  }
}

let correctPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username })
    let pw = h.encryption.decode(user.password)
    if(req.body.password !== pw){
      return errorHandler(errorType, req, res, 'correctPassword')
    }
    next()
  } catch(e){
    req.flash(e)
    return res.redirect('back')
  }
}

module.exports = {
  userDoesNotExist,
  confirmPassword,
  userExists,
  correctPassword
}
