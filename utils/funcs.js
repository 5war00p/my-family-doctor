const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const globals = require("./globals");

const JWT_SECRET = process.env.JWT_SECRET || "temporary secret";
const JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME || "28d";

sendError = (res, err, resCode) => {
	err = err || "Internal server error";
	resCode = resCode || 500;
	req = res.req;
	var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	var user_agent = req.headers["user-agent"] || "No user agent";
	err_message = { code: resCode || 500, message: err };
	console.error(
		`${ip} - - [${getDateTime()}] "${req.method} ${
			req.originalUrl
		}" ${resCode} "${user_agent}"`,
		err_message,
	);
	if (typeof err !== "string") err = "Internal server error!";
	let message = {
		code: resCode,
		status: "error",
		message: err,
	};
	res.set("X-Content-Type-Options", "nosniff");
	res.status(resCode);
	res.json(message);
	res.end();
};

sendSuccess = (res, data, resCode, token) => {
	resCode = resCode || 200;
	data = data === undefined ? {} : data;
	let message = {
		code: resCode,
		status: "success",
		data: data,
	};
	if (token) message["token"] = token;
	res.set("X-Content-Type-Options", "nosniff");
	res.status(resCode);
	res.json(message);
	res.end();
};

getDateTime = () => {
	return new Date().toLocaleString("en-in", { timeZone: "Asia/Kolkata" }).toUpperCase();
};

getTimeStamp = () => {
	return Math.floor(new Date().getTime() / 1000);
};

genRandomString = (size, charset = "0123456789abcdef") => {
	randString = "";
	for (i = 0; i < size; i++) {
		randString += charset[Math.floor(Math.random() * charset.length)];
	}
	return randString;
};

genJWT = (data, secret = JWT_SECRET, expire = JWT_EXPIRY_TIME) => {
	return jwt.sign(data, secret, {
		expiresIn: expire,
	});
};

get_hash = passwd => {
	salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(passwd, salt);
};

getJwtFromHeaders = req => {
	auth_token = req.headers["x-mfd-token"] || "";
	return auth_token || "";
};

module.exports = {
	getDateTime,
	getTimeStamp,
	genRandomString,
	genJWT,
	get_hash,
	getJwtFromHeaders,
	sendError,
	sendSuccess,
};
