const router = require("express").Router();

const profile_routes = require("./profile-routes");
const health_profile_routes = require("./health-profile-routes");

router.use("/profile", profile_routes);
router.use("/health-profile", health_profile_routes);

module.exports = router;
