const bcrypt = require("bcrypt");

const router = require("express").Router();
const models = require("./db/models");
const funcs = require("./utils/funcs");

const jwtManager = require("./utils/jwt-manager");

const _ = require("lodash");

router.post("/login", (req, res) => {
	const { mfd_id, password } = req.body;

	models.User.findOne({ mfd_id })
		.then(user => {
			if (!user)
				throw { err_message: "Seems entered user details not exists!", err_code: 401 };

			const auth = bcrypt.compareSync(password, user.password);
			if (!auth) throw { err_message: "Incorrect credentials", err_code: 401 };

			jwt_data = {
				data: {
					id: user._id,
					mfd_id: user.mfd_id,
				},
				isloggedIn: true,
			};
			const { access_token, refresh_token } = funcs.genJWT(jwt_data);
			user.last_login = new Date();
			user.refresh_token = refresh_token;
			return user.save();
		})
		.then(_ => {
			return funcs.sendSuccess(res, jwt_data, 201, access_token, refresh_token);
		})
		.catch(err => {
			return funcs.sendError(res, err.err_message || err, err.err_code);
		});
});

router.post("/register", (req, res) => {
	let { firstname, lastname, password, confirm_password } = req.body;

	if (!firstname || !lastname || !password || !confirm_password) {
		return funcs.sendError(res, "Some fields are missing", 422);
	}

	if (password !== confirm_password) {
		return funcs.sendError(res, "Passwords must be same", 422);
	}

	password = funcs.get_hash(password);
	models.User.countDocuments()
		.then(ct => {
			mfd_id = "MFD" + _.padStart(ct + 1, 10, "0");
			return models.User.create({ mfd_id, firstname, lastname, password });
		})
		.then(user => {
			jwt_data = {
				data: {
					id: user._id,
					mfd_id: user.mfd_id,
				},
				isloggedIn: true,
			};
			const { access_token, refresh_token } = funcs.genJWT(jwt_data);
			user.last_login = new Date();
			user.refresh_token = refresh_token;
			return user.save();
		})
		.then(_ => {
			return funcs.sendSuccess(res, jwt_data, 201, access_token, refresh_token);
		})
		.catch(err => {
			return funcs.sendError(res, err.err_message || err, err.err_code);
		});
});

router.post("/refresh_token", jwtManager("refresh_token"), (req, res, next) => {
	const _id = req.jwt_data.data.id;

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	const { access_token, refresh_token } = funcs.genJWT(req.jwt_data);
	models.User.findOne({ _id })
		.then(user => {
			if (!user) throw { err_message: "User not exists!", err_code: 401 };
			user.refresh_token = refresh_token;
			return user.save();
		})
		.then(_ => {
			return funcs.sendSuccess(res, { access_token, refresh_token });
		})
		.catch(next);
});

router.delete("/logout", (req, res) => {});

module.exports = router;
