const router = require("express").Router();
const controller = require("./trade.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/", auth, controller.createTrade);
router.get("/history/:userId", auth, controller.tradeHistory);

module.exports = router;