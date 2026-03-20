const db = require("../../config/db");

exports.findById = async(id) => {
    const user = await db.query(
        "SELECT id,name,email,balance FROM users WHERE id=$1",
        [id]
    );
    return user.rows[0];
}