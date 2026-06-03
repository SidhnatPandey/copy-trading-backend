const authService = require("./auth.service");

exports.signup = async (req, res) => {
  const { token, user } = await authService.signup(req.body);
  res.json({ token, user });
};

exports.login = async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.json({ token, user });
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body || {});
    res.json(result);
  } catch (err) {
    console.error("forgotPassword error", err);
    res.status(500).json({ message: "Unable to process request" });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body || {});
    res.json(result);
  } catch (err) {
    console.error("resetPassword error", err.message || err);
    res.status(400).json({ message: err.message || "Unable to reset password" });
  }
};