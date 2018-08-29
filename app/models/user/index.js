'use strict';
const path = require('path'),
  crypto = require('crypto'),
  mongoose = require('mongoose'),
  config = require(path.join(process.cwd(), 'app', 'config')),
  h = require(path.join(process.cwd(), 'app', 'helpers'))

let UserSchema = new mongoose.Schema({


  email: String,


  url: String,
	created: Date,
	inviteCode: String,
	name: String,

	pic: {
		type: String
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
})

UserSchema.pre('save', async function(next){
	let user = this

	// Only hash if unmodified
	if(!user.isModified('username')) return next()

  let cipher = crypto.createCipher('aes192', user.username)
  let inviteCode = cipher.update(config.inviteEncrypter, 'utf8', 'hex')
	user.inviteCode = inviteCode += cipher.final('hex')

  let pw = await h.encryption.encode(user.password)
  user.password = pw

	next()
})


module.exports = mongoose.model("User", UserSchema)
