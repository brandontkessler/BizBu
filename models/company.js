'use strict';

const mongoose = require("mongoose");

let CompanySchema = new mongoose.Schema({
	name: String,
	created: Date,
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
	}


});

module.exports = mongoose.model("Company", CompanySchema);
