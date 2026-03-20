const router = require("express").Router();
const controller = require("./copy.controller");

router.post("/start", controller.startCopy);
router.post("/stop", controller.stopCopy);
router.get("/followers/:traderId", controller.followers);

module.exports = router;