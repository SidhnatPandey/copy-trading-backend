const db = require("../../config/db");

exports.saveTrade = async (data) => {
  const trade = await db.query(
    `INSERT INTO trades(user_id,symbol,side,amount,price,status)
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *`,
    [data.user_id, data.symbol, data.side, data.amount, data.price, "OPEN"],
  );
  return trade.rows[0];
};

exports.getByUser = async (userId) => {
  const trades = await db.query("SELECT * FROM trades WHERE user_id=$1", [
    userId,
  ]);
  return trades.rows;
};
