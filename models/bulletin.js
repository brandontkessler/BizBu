const 	mongoose = require("mongoose");

let BulletinSchema = new mongoose.Schema({
	companyRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  bulletins: [
    {
      message: String,
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      submittedOn: Date,
      date: String,
      time: String
    }
  ]
});

module.exports = mongoose.model("Bulletin", BulletinSchema);
