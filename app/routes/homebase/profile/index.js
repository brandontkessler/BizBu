'use strict';
const path = require('path'),
	{ getUserProfile } = require(path.join(__dirname, 'get-profile')),
	{ makeMePublic, hideMe } = require(path.join(__dirname, 'public-profile'))

module.exports = {
	getUserProfile,
	makeMePublic,
	hideMe
}
