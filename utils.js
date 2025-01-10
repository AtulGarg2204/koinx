const https = require('https');
const CoinModel = require('./models/coin');

const COINGECKO_API = 'api.coingecko.com';

function httpsGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: COINGECKO_API,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function fetchCryptoData() {
  const coins = ['bitcoin', 'matic-network', 'ethereum'];
  
  for (const coin of coins) {
    try {
      const data = await httpsGet(`/api/v3/coins/${coin}`);
      
      const newCoin = new CoinModel({
        id: coin,
        price: data.market_data.current_price.usd,
        marketCap: data.market_data.market_cap.usd,
        change24h: data.market_data.price_change_percentage_24h
      });
      
      await newCoin.save();
      console.log(`Data saved for ${coin}`);
    } catch (error) {
      console.error(`Error fetching data for ${coin}:`, error);
    }
  }
}

async function getStats(coin) {
  const latestData = await CoinModel.findOne({ id: coin }).sort({ timestamp: -1 });
  
  if (!latestData) {
    throw new Error('No data found for the specified coin');
  }
  
  return {
    price: latestData.price,
    marketCap: latestData.marketCap,
    "24hChange": latestData.change24h
  };
}

async function calculateDeviation(coin) {
  const data = await CoinModel.find({ id: coin }).sort({ timestamp: -1 }).limit(100);
  
  if (data.length === 0) {
    throw new Error('No data found for the specified coin');
  }
  
  const prices = data.map(item => item.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / prices.length;
  const standardDeviation = Math.sqrt(variance);
  
  return parseFloat(standardDeviation.toFixed(2));
}

module.exports = { fetchCryptoData, getStats, calculateDeviation };

