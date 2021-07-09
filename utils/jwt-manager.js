const jwt = require("jsonwebtoken");
const funcs = require("./funcs");
const JWT_SECRET = process.env.JWT_SECRET || "temporary secret";

module.exports = (req, res, next) => {
	baseUrl = req.baseUrl.split("/").reverse()[0];
	auth_token = funcs.getJwtFromHeaders(req);
	if (!auth_token && baseUrl !== "common")
		return funcs.sendError(res, "Authentication token not provided!", 401);
	jwt.verify(auth_token, JWT_SECRET, (err, data) => {
		if (err) {
			if (err.name === "TokenExpiredError")
				throw { err_message: "Authentication token expired!", err_code: 401 };
			throw { err_message: "Invalid authentication token!", err_code: 401 };
		}
		delete data["exp"];
		delete data["iat"];
		req.jwt_data = data;
		next();
	});
};
