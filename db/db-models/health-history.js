const mongoose = require("mongoose");

const HealthHistorySchema = new mongoose.Schema(
	{
		value: {
			type: String,
		},
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
			},
			name: { type: String },
		},
	},
	{ timestamps: true, id: false },
);

const HealthHistory = mongoose.model("HealthHistory", HealthHistorySchema);

module.exports = HealthHistory;
