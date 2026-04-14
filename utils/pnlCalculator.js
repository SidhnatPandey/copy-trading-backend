exports.calculatePnL = (entry, current, qty) => {
  return (current - entry) * qty;
};
