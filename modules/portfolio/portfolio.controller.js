const service = require("./portfolio.service");

exports.getPortfolio = async (req, res) => {
    const userId = req.user.id;
    const data = await service.getPortfolio(userId);
    res.json(data);
};