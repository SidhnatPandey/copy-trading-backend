const service = require("./copy.service");

exports.startCopy = async(req, res) => {
    const result = await service.start(req.body);
    res.json(result);
}

exports.stopCopy = async(req, res) => {
    const result = await service.stop(req.body);
    res.json(result);
}

exports.followers = async(req, res) => {
    const result = await service.followers(req.params.traderId);
    res.json(result);
}