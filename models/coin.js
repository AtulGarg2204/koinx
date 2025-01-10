const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  id: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coin', coinSchema);

