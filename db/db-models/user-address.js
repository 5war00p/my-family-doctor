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

const UserAddress = mongoose.model("UserAddress", UserAddressSchema);

module.exports = UserAddress;
