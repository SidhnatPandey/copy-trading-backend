const axios = require("axios");

const symbolMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  AVAX: "avalanche-2",
  DOT: "polkadot",
};

let cachedData = null;
let lastFetch = 0;
const CACHE_MS = 800; // keep data fresh for 800ms to support frequent frontend polling

function fmtLarge(num) {
  if (num === null || num === undefined) return null;
  const abs = Math.abs(num);
  if (abs >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (abs >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (abs >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toString();
}

function roundPrice(p) {
  if (p === null || p === undefined) return null;
  return p >= 1 ? Number(p.toFixed(2)) : Number(p.toFixed(4));
}

exports.getMarketData = async (opts = {}) => {
  const now = Date.now();
  if (cachedData && now - lastFetch < CACHE_MS) return cachedData;

  const ids = Object.values(symbolMap).join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

  const res = await axios.get(url);
  const data = res.data || [];

  const formatted = data.map((c) => {
    const symbol = (c.symbol || "").toUpperCase();
    return {
      symbol,
      name: c.name,
      price: roundPrice(c.current_price),
      change24h: c.price_change_percentage_24h
        ? Number(c.price_change_percentage_24h.toFixed(2))
        : null,
      volume: fmtLarge(c.total_volume),
      marketCap: fmtLarge(c.market_cap),
      high24h: roundPrice(c.high_24h),
      low24h: roundPrice(c.low_24h),
    };
  });

  // re-order to match symbolMap order
  const order = Object.keys(symbolMap);
  const ordered = order
    .map((s) => formatted.find((f) => f.symbol === s))
    .filter(Boolean);

  cachedData = ordered;
  lastFetch = now;
  return ordered;
};
