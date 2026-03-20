const db = require("../../config/db");

exports.create = async(data) => {
    const result = await db.query(
        `INSERT INTO copy_relationships(trader_id, follower_id, allocation)
        VALUES($1,$2,$3) RETURNING *`,
        [data.trader_id,data.follower_id,data.allocation]
    );

    return result.rows[0];
    
}

exports.remove = async(data)=>{
    await db.query(
        `DELETE FROM copy_relationships
        WHERE trader_id=$1 AND follower_id=$2`,
        [data.trader_id,data.follower_id]
    );
    return {success:true};
}

exports.getFollowers = async(traderId)=>{
    const followers = await db.query(
        `SELECT * FROM copy_relationships WHERE trader_id=$1`,
        [traderId]
    );
    return followers.rows;
}