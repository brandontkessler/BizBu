'use strict';
const path = require('path'),
	{ getUserProfile } = require(path.join(__dirname, 'get-profile')),
	{ getUserInvites } = require(path.join(__dirname, 'invites')),
	{ makeMePublic, hideMe } = require(path.join(__dirname, 'public-profile')),
	{ getMessages, sendMessage, deleteMessage, queryMessages } = require(path.join(__dirname, 'my-messages'))

module.exports = {
	getUserProfile,
	getUserInvites,
	makeMePublic,
	hideMe,
	getMessages,
	sendMessage,
	deleteMessage,
	queryMessages
}
