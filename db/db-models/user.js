const mongoose = require("mongoose");
const _ = require("lodash");

const UserAddressSchema = new mongoose.Schema({
	address: {
		type: String,
		trim: true,
		required: true,
	},
	district: {
		type: String,
		trim: true,
		required: true,
		set: _.capitalize,
	},
	state: {
		type: String,
		required: true,
		set: _.capitalize,
	},
	pincode: {
		type: Number,
		required: true,
	},
	is_permanent: {
		type: Boolean,
		default: false,
	},
});

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
		address: UserAddressSchema,
		blood_group: {
			type: String,
		},
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
	},
	{
		timestamps: true,
		id: false,
	},
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
