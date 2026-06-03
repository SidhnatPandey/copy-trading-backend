const nodemailer = require("nodemailer");

const transportConfig = (() => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  }
  return null;
})();

let transporter = null;
if (transportConfig) {
  transporter = nodemailer.createTransport(transportConfig);
}

exports.sendResetEmail = async (to, resetUrl, name) => {
  const from = process.env.FROM_EMAIL || "no-reply@example.com";
  const subject = "Password reset instructions";
  const text = `Hello ${name || "user"},\n\n` +
    `A request was received to reset your password. Use the link below to set a new password (expires in 1 hour):\n\n${resetUrl}\n\n` +
    `If you didn't request this, you can ignore this email.`;

  if (!transporter) {
    console.log(`No SMTP configured - reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: `<p>Hello ${name || "user"},</p><p>A request was received to reset your password. Click the link below to set a new password (expires in 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, ignore this email.</p>`,
  });
};

exports._transporter = transporter;
