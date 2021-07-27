const mongoose = require("mongoose");
const UserAddress = require("./user-address");

const UserSchema = new mongoose.Schema(
	{
		mfd_id: {
			type: String,
		},

		// Required fields
		firstname: {
			type: String,
			trim: true,
			required: true,
		},
		lastname: {
			type: String,
			trim: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},

		//Non-Required fields
		gender: {
			type: String,
			enum: ["Male", "Female", "Other"],
		},
		dob: {
			type: Date,
		},
		address: UserAddress.schema,
		mobile_num: {
			type: Number,
		},
		username: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
		},
		last_login: {
			type: Date,
		},
		app_version: {
			type: String,
		},
		refresh_token: {
			type: String,
		},

		//References
		health_profile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "HealthProfile",
		},
	},
	{
		timestamps: true,
		id: false,
	},
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
