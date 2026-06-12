const repo = require("./user.repository");

exports.getUser = async (id) => {
  return repo.findById(id);
};

exports.updateUser = async (id, data) => {
  return repo.update(id, data);
};