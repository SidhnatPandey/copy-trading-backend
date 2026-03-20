const axios = require("axios");

exports.getPrice = async(Symbol)=>{
    const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
    return res.data.bitcoin.usd;
}