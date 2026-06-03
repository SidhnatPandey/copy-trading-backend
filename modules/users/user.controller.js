const service = require("./user.service");

exports.getUser = async (req, res) => {
  const user = await service.getUser(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);
  res.json(user);
};
