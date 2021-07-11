const jwt = require("jsonwebtoken");
const funcs = require("./funcs");

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access secret";
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh secret";

module.exports = type => {
	return (req, res, next) => {
		baseUrl = req.baseUrl.split("/").reverse()[0];
		const { access_token, refresh_token } = funcs.getJwtFromHeaders(req);

		if (type === "access_token") {
			auth_token = access_token;
			JWT_SECRET = JWT_ACCESS_SECRET;
		} else if (type === "refresh_token") {
			auth_token = refresh_token;
			JWT_SECRET = JWT_REFRESH_SECRET;
		}

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
};
