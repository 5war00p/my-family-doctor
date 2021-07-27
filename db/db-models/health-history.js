const mongoose = require("mongoose");

const HealthHistorySchema = new mongoose.Schema(
	{
		value: {
			type: String,
		},
		unit: {
			type: String,
			enum: [
				// Blood Glucose
				"mmol/L",
				// Blood Pressure
				"mmHg",
				// Heart Rate
				"bpm",
				// Height
				"ft",
				"cm",
				"in",
				//Temperatue
				"K",
				"°F",
				// Weight
				"kg",
				"lb",
			],
		},
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
			},
			name: { type: String },
		},
	},
	{ timestamps: true },
);

const HealthHistory = mongoose.model("HealthHistory", HealthHistorySchema);

module.exports = HealthHistory;
