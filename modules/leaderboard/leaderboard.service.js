const db = require("../../config/db");

exports.getLeaderboard = async () => {
  const result = await db.query(`
 SELECT user_id,
 SUM(amount*price) as trading_volume
 FROM trades
 GROUP BY user_id
 ORDER BY trading_volume DESC
 LIMIT 10
 `);

  return result.rows;
};
