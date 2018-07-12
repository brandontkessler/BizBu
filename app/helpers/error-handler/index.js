'use strict';
const middlewareFactory = require('./middleware-factory'),
  logger = require('../../logger');

module.exports = (err, req, res, routeType, route) => {
  if(err === 'middleware') {
    // routeType acts as the middleware function name
    let middlewareData = middlewareFactory(req, routeType);

    logger.log('error', `Middleware error - ${routeType}`);
    req.flash('error', middlewareData.msg || `You can't do that`);
    return res.redirect(middlewareData.redirect);
  } else {
    let loggerError;

    if(typeof err === 'string') {
      loggerError = err;
    } else {
      loggerError = err.message
    }

    logger.log('error', `Error at ${routeType} - ${route}: ${loggerError}`);
    req.flash('error', err.message || 'Unable to handle request');
    return res.redirect('back');
  }
}
