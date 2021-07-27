const mongoose = require("mongoose");

const HealthHistory = require("./health-history");

const HealthProfileSchema = new mongoose.Schema(
	{
		blood_group: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
		},

		blood_glucose: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "mmol/L" },
		},

		blood_pressure: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "mmHg" },
		},

		heart_rate: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "bpm" },
		},

		height: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "ft", enum: ["ft", "cm", "in"] },
		},

		temperature: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "°F", enum: ["K", "°F"] },
		},

		weight: {
			history: [HealthHistory.schema],
			unit: { type: String, default: "kg", enum: ["kg", "lb"] },
		},

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
