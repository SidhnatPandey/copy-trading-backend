require("dotenv").config();
const redis = require("../config/redis");
const db = require("../config/db");

redis.subscribe("trade_executed");
redis.on("message", async(channel, message) => {
    const trade = JSON.parse(message);

    const followers = await db.query(
        "SELECT * FROM copy_relationships WHERE trader_id=$1",
        [trade.user_id]
    );

    for (const follower of followers.rows) {
        const traderBalance = 10000;

        const proportion = follower.allocation / traderBalance;
        const amount = proportion * trade.amount;

        await db.query(
            `INSERT INTO trades
            (user_id,symbol,side,amount,price,status)
            VALUES($1,$2,$3,$4,$5,$6)`,
            [
                follower.follower_id,
                trade.symbol,
                trade.side,
                amount,
                trade.price,
                "OPEN"
            ]
        );
    }
});