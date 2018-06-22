const 	mongoose = require("mongoose"),
				bcrypt = require('bcryptjs'),
				inviteCostFactor = process.env.INVITE_COST_FACTOR;

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

	facebook: {
		id: String,
		accessToken: String
	},

	linkedin: {
		id: String,
		token: String
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
	]
});

// Creates a unique invite code from hashed email
UserSchema.pre('save', function(next){
	let user = this;
	// Only hash if unmodified
	if(!user.isModified('email')) return next();

	bcrypt.genSalt(inviteCostFactor, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.email, salt, function(err, hash){
			if(err) return next(err);
			user.inviteCode = hash;
			next();
		})
	})
})

// another layer of checking password matches
// UserSchema.methods.comparePassword = function(password){
// 	return bcrypt.compareSync(password, this.password)
// }

module.exports = mongoose.model("User", UserSchema);
