const router = require("express").Router();

const profile_routes = require("./profile-routes");

router.use("/profile", profile_routes);

module.exports = router;
