'use strict';
const mongoose = require("mongoose"),
  crypto = require('crypto'),
  config = require('../../config');

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true
	},

	created: {
		type: Date
	},

	inviteCode: {
		type: String,
		unique: true
	},

	name: {
		type: String
	},

	pic: {
		type: String
	},

	facebook: {
		id: String,
		accessToken: String
	},

	linkedin: {
		id: String,
		accessToken: String,
    url: String
	},

	companiesAdmin: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company'
		}
	],

	companiesMember: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company'
		}
	],
	invites: [
		{
			inviter: String,
			companyId: String,
			companyName: String,
			admin: Boolean
		}
	],

  activeCompanies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }
  ],

  hideChat: Boolean,
  publicProfile: Boolean,
  myMessages: [
    {
      title: String,
      myMessagesRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MyMessages'
      }
    }
  ]
});

// Creates a unique invite code from hashed email
UserSchema.pre('save', function(next){
	let user = this;
	// Only hash if unmodified
	if(!user.isModified('email')) return next();

	let cipher = crypto.createCipher('aes192', user.email);
	let inviteCode = cipher.update(config.inviteEncrypter, 'utf8', 'hex');
	inviteCode += cipher.final('hex');

	user.inviteCode = inviteCode;
	next();
})

module.exports = mongoose.model("User", UserSchema);
