const router = require("express").Router();

const models = require("./db/models");
const funcs = require("./utils/funcs");

router.post("/", (req, res, next) => {
	const _id = req.jwt_data.data.id;

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	models.HealthProfile.findOne({ user: _id })
		.then(health_profile => {
			return funcs.sendSuccess(res, health_profile);
		})
		.catch(next);
});

router.patch("/", (req, res, next) => {
	const {
		user_id,
		author_id,
		author_name,
		height,
		weight,
		temperature,
		blood_group,
		heart_rate,
		blood_glucose,
		blood_pressure,
	} = req.body;

	const { mfd_id, id } = req.jwt_data.data;

	if (!models.mongoose.Types.ObjectId.isValid(id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	if (!user_id) return funcs.sendError(res, "Invalid ID!", 403);

	if (!author_id && !author_name) return funcs.sendError(res, "Author Details must sent!", 403);

	models.User.findOne({ _id: user_id })
		.populate({ path: "health_profile" })
		.then(user => {
			if (!user) throw { err_message: "UserID not found", err_code: 404 };

			if (!user.health_profile) return models.HealthProfile.create({ user: user_id });

			return user.health_profile;
		})
		.then(health_profile => {
			if (blood_group && blood_group.value) {
				health_profile.blood_group = blood_group.value;
			}
			if (blood_glucose && blood_glucose.value) {
				val = new models.HealthHistory({
					value: blood_glucose.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.blood_glucose.history.push(val);
			}
			if (blood_pressure && blood_pressure.value) {
				val = new models.HealthHistory({
					value: blood_pressure.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.blood_pressure.history.push(val);
			}
			if (heart_rate && heart_rate.value) {
				val = new models.HealthHistory({
					value: heart_rate.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.heart_rate.history.push(val);
			}
			if (height && height.value) {
				val = new models.HealthHistory({
					value: height.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.height.history.push(val);
			}
			if (temperature && temperature.value) {
				val = new models.HealthHistory({
					value: temperature.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.temperature.history.push(val);
			}
			if (weight && weight.value) {
				val = new models.HealthHistory({
					value: weight.value,
					author: { id: author_id, name: author_name },
				});
				health_profile.weight.history.push(val);
			}
			return health_profile.save();
		})
		.then(health_profile => {
			return funcs.sendSuccess(res, health_profile);
		})
		.catch(next);
});

module.exports = router;
