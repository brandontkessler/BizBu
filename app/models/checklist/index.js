'use strict';
const mongoose = require("mongoose")

let ChecklistSchema = new mongoose.Schema({
	companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },

  checklistData: {
    tagline: String,
		mission: String,
    description: String,
		founderBios: String,
		introVideo: String,
    endUser: String,
		competition: String,
		revenue: String,
		marketSize: String,
		prototype: String,
		userAcquisition: String,
		acquisitionCost: String,
		initialCustomersPlan: String,
		legal: String,
		financialResources: String
  }

})

module.exports = mongoose.model("Checklist", ChecklistSchema)
