'use strict';
const path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.join(process.cwd(), 'app', 'config')),
  h = require(path.join(process.cwd(), 'app', 'helpers'))

let UserSchema = new mongoose.Schema({
  email: String,
	created: Date,
	name: String,

	pic: {
		type: String
	},

	linkedin: {
		id: String,
		accessToken: String,
    url: String
	},

  publicProfile: Boolean,

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


  myMessages: [
    {
      title: String,
      myMessagesRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MyMessages'
      }
    }
  ]
})


module.exports = mongoose.model("User", UserSchema)
