const db = require("../../config/db");

exports.findById = async (id) => {
  const user = await db.query(
    "SELECT id,name,email,balance,avatar FROM users WHERE id=$1",
    [id],
  );
  return user.rows[0];
};

exports.update = async (id, data) => {
  const user = await db.query(
    "UPDATE users SET name=$1, email=$2, avatar=COALESCE($3, avatar) WHERE id=$4 RETURNING id,name,email,balance,avatar",
    [data.name, data.email, data.avatar, id],
  );
  return user.rows[0];
};