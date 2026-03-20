const router = require("express").Router();
const controller = require("./trade.controller");

router.post("/", controller.createTrade);
router.get("/history/:userId", controller.tradeHistory);

module.exports = router;