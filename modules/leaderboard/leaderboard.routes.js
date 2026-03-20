const router = require("express").Router();
const controller = require("./leaderboard.controller");

router.get("/",controller.getLeaderboard);

module.exports = router;