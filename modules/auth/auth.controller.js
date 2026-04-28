const authService = require("./auth.service");

exports.signup = async (req, res) => {
  const { token, user } = await authService.signup(req.body);
  res.json({ token, user });
};

exports.login = async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.json({ token, user });
};
