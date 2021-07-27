const mongoose = require("mongoose");

const HealthHistory = require("./health-history");

const HealthProfileSchema = new mongoose.Schema(
	{
		blood_group: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
		},

		blood_glucose: [HealthHistory.schema],

		blood_pressure: [HealthHistory.schema],

		heart_rate: [HealthHistory.schema],

		height: [HealthHistory.schema],

		temperature: [HealthHistory.schema],

		weight: [HealthHistory.schema],

		//References
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	},
);

const HealthProfile = mongoose.model("HealthProfile", HealthProfileSchema);

module.exports = HealthProfile;
