const tradeRepo = require("./trade.repository");
const tradePublisher = require("../../events/trade.publisher");

exports.createTrade = async(data)=>{
    const trade = await tradeRepo.saveTrade(data);
    await tradePublisher.publish(trade);
    return trade;
};

exports.history = async(userId)=>{
    return tradeRepo.getByUser(userId);
};