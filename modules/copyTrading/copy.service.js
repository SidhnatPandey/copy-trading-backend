const repo = require("./copy.repository");

exports.start = async(data) => {
    return repo.create(data);
}

exports.stop = async(data) => {
    return repo.remove(data);
}

exports.followers = async(traderId) => {
    return repo.getFollowers(traderId);
}