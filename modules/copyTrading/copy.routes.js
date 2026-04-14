const router = require("express").Router();
const controller = require("./copy.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/start", auth, controller.startCopy);
router.post("/stop", auth, controller.stopCopy);
router.get("/followers/:traderId", auth, controller.followers);

module.exports = router;
