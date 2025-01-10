require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { fetchCryptoData, getStats, calculateDeviation } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: "KoinX Cryptocurrency API",
    version: "1.0.0",
    description: "API for fetching cryptocurrency data and calculating statistics",
    endpoints: {
      root: {
        path: "/",
        method: "GET",
        description: "Returns API information and documentation"
      },
      stats: {
        path: "/stats",
        method: "GET",
        params: {
          coin: "string (required) - One of: bitcoin, matic-network, ethereum"
        },
        description: "Returns latest price, market cap, and 24h change for specified cryptocurrency",
        example: "/stats?coin=bitcoin"
      },
      deviation: {
        path: "/deviation",
        method: "GET",
        params: {
          coin: "string (required) - One of: bitcoin, matic-network, ethereum"
        },
        description: "Returns standard deviation of price for last 100 records",
        example: "/deviation?coin=bitcoin"
      }
    },
    supportedCoins: ["bitcoin", "matic-network", "ethereum"]
  });
});

// Background job to fetch and store crypto data every 2 hours
const TWO_HOURS = 2 * 60 * 60 * 1000;
setInterval(async () => {
  console.log('Running background job to fetch crypto data');
  await fetchCryptoData();
}, TWO_HOURS);

// Initial fetch when the server starts
fetchCryptoData();

// API endpoint for /stats
app.get('/stats', async (req, res) => {
  const { coin } = req.query;
  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    const stats = await getStats(coin);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// API endpoint for /deviation
app.get('/deviation', async (req, res) => {
  const { coin } = req.query;
  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    const deviation = await calculateDeviation(coin);
    res.json({ deviation });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating deviation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

