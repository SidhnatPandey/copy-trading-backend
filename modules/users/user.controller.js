const service = require("./user.service");

exports.getUser = async (req, res) => {
    const user = await service.getUser(req.params.id);
    res.json(user);
}