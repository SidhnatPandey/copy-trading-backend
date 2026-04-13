const router = require("express").Router();
const controller = require("./portfolio.controller");
const auth = require("../../middleware/auth.middleware");

router.get("/", auth, controller.getPortfolio);

module.exports = router;