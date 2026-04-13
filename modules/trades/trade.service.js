const tradeRepo = require("./trade.repository");
const tradePublisher = require("../../events/trade.publisher");
const portfolioRepo = require("../portfolio/portfolio.repository");

exports.createTrade = async(data)=>{
    const trade = await tradeRepo.saveTrade(data);
    // Create position for BUY
    if (data.side === "BUY") {
        await portfolioRepo.createPosition({
            user_id: data.user_id,
            symbol: data.symbol,
            price: data.price,
            quantity: data.amount,
            side: "BUY"
        });
    }

    // Close position for SELL
    if (data.side === "SELL") {
        const positions = await portfolioRepo.getOpenPositions(data.user_id);
        const pos = positions.find(p => p.symbol === data.symbol);
        if (pos) {
            await portfolioRepo.closePosition(pos.id);
        }
    }
    await tradePublisher.publish(trade);
    return trade;
};

exports.history = async(userId)=>{
    return tradeRepo.getByUser(userId);
};