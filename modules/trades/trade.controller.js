const tradeService = require("./trade.service");

exports.createTrade = async (req, res) => {
  const trade = await tradeService.createTrade(req.body);
  res.json(trade);
};

exports.tradeHistory = async (req, res) => {
  const trades = await tradeService.history(req.params.userId);
  res.json(trades);
};
