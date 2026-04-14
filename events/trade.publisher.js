const redis = require("../config/redis");

exports.publish = async (trade) => {
  await redis.publish("trade_executed", JSON.stringify(trade));
};
