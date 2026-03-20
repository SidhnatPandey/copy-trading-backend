const authService = require("./auth.service");

exports.signup = async (req, res) => {
    const user = await authService.signup(req.body);
    res.json(user);
};

exports.login = async (req, res)=>{
    const token = await authService.login(req.body);
    res.json({token});
}