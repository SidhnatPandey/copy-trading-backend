const db = require("../../config/db");

exports.findById = async (id) => {
  const user = await db.query(
    "SELECT id,name,email,balance,profile_image_url FROM users WHERE id=$1",
    [id],
  );
  return user.rows[0];
};

exports.update = async (id, data) => {
  const user = await db.query(
    "UPDATE users SET name=$1, email=$2, profile_image_url=COALESCE($3, profile_image_url) WHERE id=$4 RETURNING id,name,email,balance,profile_image_url",
    [data.name, data.email, data.profile_image_url, id],
  );
  return user.rows[0];
};