require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const funcs = require("./utils/funcs");
const jwtManager = require("./utils/jwt-manager");
const common_routes = require("./common-routes");
const user_routes = require("./user-routes");

app = express();

app.set("case sensitive routing", true);
app.use(express.json({ limit: "5MB" }));
app.use(cors());
app.use(morgan("combined"));

morgan.token("date", function () {
	return funcs.getDateTime();
});

morgan.token("remote-addr", function (req, res) {
	return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
});

API_BIND_ADDR = process.env.API_BIND_ADDR || "0.0.0.0";
API_PORT = process.env.API_PORT || 5060;

app.use("/v1/common", common_routes);
app.use("/v1/common/user", jwtManager, user_routes);

app.use((req, res) => {
	throw { err_message: "Route not found!", err_code: 404 };
});

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError) return funcs.sendError(res, "JSON parse error!", 400);
	else return funcs.sendError(res, err.err_message || err, err.err_code);
});

app.listen(API_PORT, API_BIND_ADDR, () => {
	console.log(`Server running on ${API_BIND_ADDR}:${API_PORT} at ${funcs.getDateTime()}`);
});
