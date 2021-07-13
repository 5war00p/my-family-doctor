const mongoose = require("mongoose");
const con_string = process.env.MONGO_CONNECTION_STRING || "Invalid connection string!";

mongoose
	.connect(con_string, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("Mongo connection established successfully!");
	})
	.catch(err => {
		console.error(err.message);
	});

module.exports = {
	mongoose: mongoose,
	User: require("./db-models/user"),
	UserAddress: require("./db-models/user-address"),
};
