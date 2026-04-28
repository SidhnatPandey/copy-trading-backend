const router = require("express").Router();
const marketService = require("./market.service");

router.get("/latest", async (req, res) => {
  try {
    const data = await marketService.getMarketData();
    res.json(data);
  } catch (err) {
    console.error("market/latest error", err && err.message);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

module.exports = router;
