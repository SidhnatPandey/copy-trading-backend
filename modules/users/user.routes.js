const router = require("express").Router();
const controller = require("./user.controller");
const auth = require("../../middleware/auth.middleware");

router.get("/:id", auth, controller.getUser);
router.put("/:id", auth, controller.updateUser);

module.exports = router;
