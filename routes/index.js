const router = require("express").Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/users", require("../modules/users/user.routes"));
router.use("/trades", require("../modules/trades/trade.routes"));
router.use("/copy", require("../modules/copyTrading/copy.routes"));
router.use(
  "/leaderboard",
  require("../modules/leaderboard/leaderboard.routes"),
);
router.use("/market", require("../modules/market/market.routes"));
router.use("/portfolio", require("../modules/portfolio/portfolio.routes"));

module.exports = router;
