const service = require("./leaderboard.service");

exports.getLeaderboard = async (req, res) => {
  const data = await service.getLeaderboard();
  res.json(data);
};
