'use strict';
const mongoose = require("mongoose")

let ChecklistSchema = new mongoose.Schema({
	companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },

  checklistData: {
    tagline: String,
    description: String,
    location: String,
    assumptions: String,
    endUser: String,
		seekingCofounder: String,
		founderBios: String,
		introVideo: String,
		prototype: String,
		competition: String,
		revenue: String,
		marketFinancialModel: String,
		userAcquisition: String,
		legal: String,
		financialResources: String,
		initialCustomersPlan: String
  }

})

module.exports = mongoose.model("Checklist", ChecklistSchema)
