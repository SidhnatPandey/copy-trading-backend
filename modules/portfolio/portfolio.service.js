const repo = require("./portfolio.repository");
const marketService = require("../market/market.service");
const pnlUtil = require("../../utils/pnlCalculator");

exports.getPortfolio = async (userId) => {
    const positions = await repo.getOpenPositions(userId);
    const totalPnL = 0;
    const enriched = [];

    for (const pos of positions) {
        const currentPrice = await marketService.getPrice(pos.symbol);
        const pnl = pnlUtil.calculatePnL(
            pos.entry_price,
            currentPrice,
            pos.quantity,
        );
        totalPnL += pnl;
        enriched.push({
            ...pos,
            currentPrice,
            pnl
        });
    }

    return {
        positions: enriched,
        totalPnL
    };
};