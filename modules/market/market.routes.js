const router = require("express").Router();
const marketService = require("./market.service");

router.get("/btc", async(req, res)=>{
    const price = await marketService.getPrice();
    res.json({price});
});

module.exports = router;