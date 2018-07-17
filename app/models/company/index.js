'use strict';
const mongoose = require("mongoose")

let CompanySchema = new mongoose.Schema({
	name: String,
	created: Date,
	companyInfo: {
		tagline: String,
		description: String,
		needs: [String]
	},

	admin: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],

	member: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],

	notifications: [String],

	bulletin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bulletin'
	},

	chat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Chat'
	},

	activeUsers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]

})

module.exports = mongoose.model("Company", CompanySchema)
