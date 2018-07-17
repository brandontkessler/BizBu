'use strict';
const mongoose = require("mongoose")

let MyMessagesSchema = new mongoose.Schema({

  userGroup: [
    {
  		type: mongoose.Schema.Types.ObjectId,
  		ref: 'User'
  	}
  ],

  messages: [
    {
      sentBy: String,
      submittedOn: Date,
      date: String,
      time: String,
      text: String
    }
  ]
})

module.exports = mongoose.model("MyMessages", MyMessagesSchema)
