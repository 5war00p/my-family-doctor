const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const globals = require("./globals");

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access secret";
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh secret";

const ACCESS_EXPIRY_TIME = process.env.ACCESS_EXPIRY_TIME || "1h";
const REFRESH_EXPIRY_TIME = process.env.REFRESH_EXPIRY_TIME || "28d";

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

sendSuccess = (res, data, resCode, access_token, refresh_token) => {
	resCode = resCode || 200;
	data = data === undefined ? {} : data;
	let message = {
		code: resCode,
		status: "success",
		data: data,
	};
	if (access_token) message["access_token"] = access_token;
	if (refresh_token) message["refresh_token"] = refresh_token;

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

genJWT = (
	data,
	access_secret = JWT_ACCESS_SECRET,
	access_expire = ACCESS_EXPIRY_TIME,
	refresh_secret = JWT_REFRESH_SECRET,
	refresh_expire = REFRESH_EXPIRY_TIME,
) => {
	access_token = jwt.sign(data, access_secret, { expiresIn: access_expire });
	refresh_token = jwt.sign(data, refresh_secret, { expiresIn: refresh_expire });

	return { access_token, refresh_token };
};

get_hash = passwd => {
	salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(passwd, salt);
};

getJwtFromHeaders = req => {
	access_token = req.headers["x-mfd-access-token"] || "";
	refresh_token = req.headers["x-mfd-refresh-token"] || "";
	return { access_token, refresh_token };
};

module.exports = {
	genJWT,
	genRandomString,
	getDateTime,
	getJwtFromHeaders,
	getTimeStamp,
	get_hash,
	sendError,
	sendSuccess,
};
