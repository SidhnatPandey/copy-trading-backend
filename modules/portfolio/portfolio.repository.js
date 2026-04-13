const db = require("../../config/db");

exports.getOpenPositions = async (userId) => {
    const res = await db.query(
        "SELECT * FROM positions WHERE user_id=$1 AND status='OPEN'",
        [userId]
    );
    return res.rows;
};

exports.createPosition = async (data) => {
    const res = await db.query(
        `INSERT INTO positions(user_id, symbol, entry_price, quantity, side, status) VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [
            data.user_id,
            data.symbol,
            data.price,
            data.quantity,
            data.side,
            "OPEN"
        ]
    );
    return res.rows[0];
};

exports.closePosition = async (positionId) => {
    await db.query(
        "UPDATE positions SET status='CLOSED' WHERE id=$1",
        [positionId] 
    );
};