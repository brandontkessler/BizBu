'use strict';
const mongoose = require("mongoose"),
  moment = require('moment')

let ChatSchema = new mongoose.Schema({
	companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
	messages: [
		{
			user: String,
			message:  String
		}
	]
})

module.exports = mongoose.model("Chat", ChatSchema)
