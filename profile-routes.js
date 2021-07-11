const router = require("express").Router();

const bcrypt = require("bcrypt");

const models = require("./db/models");
const funcs = require("./utils/funcs");

router.post("/info", (req, res, next) => {
	const _id = req.jwt_data.data.id;

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	models.User.findOne({ _id })
		.then(user => {
			return funcs.sendSuccess(res, {
				_id: user._id,
				mfd_id: user.mfd_id,
				email: user.email,
				dob: user.dob,
				gender: user.gender,
				mobile: user.mobile,
				lastname: user.lastname,
				firstname: user.firstname,
				address: user.address,
			});
		})
		.catch(next);
});

router.patch("/info", (req, res, next) => {
	const { email, firstname, lastname, mobile, gender, dob } = req.body;
	const _id = req.jwt_data.data.id;

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	models.User.findOne({ _id })
		.then(user => {
			if (!user) throw { err_message: "UserID not found", err_code: 404 };

			if (dob) user.dob = dob;
			if (email) user.email = email;
			if (gender) user.gender = gender;
			if (mobile) user.mobile = mobile;
			if (lastname) user.name = lastname;
			if (firstname) user.name = firstname;

			return user.save();
		})
		.then(user => {
			return funcs.sendSuccess(res, {
				_id: user._id,
				mfd_id: user.mfd_id,
				email: user.email,
				dob: user.dob,
				gender: user.gender,
				mobile: user.mobile,
				firstname: user.firstname,
				lastname: user.lastname,
			});
		})
		.catch(next);
});

router.patch("/change_pswd", (req, res, next) => {
	let { old_password, new_password } = req.body;
	const _id = req.jwt_data.data.id;

	if (!old_password || !new_password)
		return funcs.sendSuccess(res, "Missing some required fields!", 406);

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	models.User.findOne({ _id })
		.then(user => {
			if (!user) throw { err_message: "User not found", err_code: 404 };

			const auth = bcrypt.compareSync(old_password, user.password);
			if (!auth) throw { err_message: "Password doesn't match", err_code: 403 };

			new_password = funcs.get_hash(new_password);

			user.password = new_password;
			return user.save();
		})
		.then(_ => {
			return funcs.sendSuccess(res, "Password Changed Successfully !!");
		})
		.catch(next);
});

router.patch("/address", (req, res, next) => {
	let { address, district, state, pincode, is_permanant } = req.body;
	const _id = req.jwt_data.data.id;

	if (!address || !district || !state || !pincode || !is_permanant)
		return funcs.sendSuccess(res, "Missing some required fields!", 406);

	if (!models.mongoose.Types.ObjectId.isValid(_id))
		return funcs.sendError(res, "Invalid UserID!", 403);

	models.User.findOne({ _id })
		.select({ address: 1 })
		.then(user => {
			if (!user) throw { err_message: "User not found", err_code: 404 };

			user.address = address;
			user.district = district;
			user.state = state;
			user.pincode = pincode;
			user.is_permanant = is_permanant;

			return user.save();
		})
		.then(_ => {
			return funcs.sendSuccess(res, "Address Updated Successfully !!");
		})
		.catch(next);
});

module.exports = router;
