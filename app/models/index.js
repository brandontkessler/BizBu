'use strict';
const path = require('path'),
  Company = require(path.join(__dirname, 'company')),
  User = require(path.join(__dirname, 'user')),
  Bulletin = require(path.join(__dirname, 'bulletin')),
  Chat = require(path.join(__dirname, 'chat')),
  MyMessages = require(path.join(__dirname, 'my-messages'));

module.exports = {
  Company,
  User,
  Bulletin,
  Chat,
  MyMessages
}
