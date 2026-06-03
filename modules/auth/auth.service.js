const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const emailService = require("./email.service");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

exports.signup = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);
  const user = await db.query(
    `INSERT INTO users(name,email,password,role)
        VALUES($1,$2,$3,$4) RETURNING id,email,name,role`,
    [data.name, data.email, hash, data.role],
  );

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: user.rows[0] };
};

exports.login = async (data) => {
  const user = await db.query("SELECT * FROM users WHERE email=$1", [
    data.email,
  ]);

  if (user.rows.length === 0) throw new Error("User not found");
  const valid = await bcrypt.compare(data.password, user.rows[0].password);

  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const userDetails = {
    id: user.rows[0].id,
    email: user.rows[0].email,
    name: user.rows[0].name,
    role: user.rows[0].role,
  };

  return { token, user: userDetails };
};

exports.forgotPassword = async (data) => {
  const { email } = data;

  const user = await db.query("SELECT id,email,name FROM users WHERE email=$1", [
    email,
  ]);
  if (user.rows.length === 0) {
    return { message: "If that email exists, password reset instructions have been sent" };
  }

  const userRow = user.rows[0];
  const token = jwt.sign({ id: userRow.id, jti: uuidv4() }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const expiresAt = moment().add(1, "hour").toISOString();

  await db.query(
    "INSERT INTO password_resets(user_id, token, expires_at, created_at) VALUES($1,$2,$3,NOW())",
    [userRow.id, token, expiresAt],
  );

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  try {
    await emailService.sendResetEmail(userRow.email, resetUrl, userRow.name);
  } catch (e) {
    console.error("Error sending reset email", e);
  }

  const response = { message: "If that email exists, password reset instructions have been sent" };
  if (process.env.NODE_ENV !== "production") response.resetUrl = resetUrl;

  return response;
};

exports.resetPassword = async (data) => {
  const { token, password } = data;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error("Invalid or expired token");
  }
  const row = await db.query(
    "SELECT * FROM password_resets WHERE token=$1 AND expires_at > NOW()",
    [token],
  );

  if (row.rows.length === 0) throw new Error("Invalid or expired token");

  const userId = payload.id;

  const hash = await bcrypt.hash(password, 10);

  await db.query("UPDATE users SET password=$1 WHERE id=$2", [hash, userId]);
  await db.query("DELETE FROM password_resets WHERE user_id=$1", [userId]);

  return { message: "Password reset successful" };
};
