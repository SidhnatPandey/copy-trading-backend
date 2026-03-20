const repo = require("./user.repository");

exports.getUser = async(id) => {
    return repo.findById(id);
}