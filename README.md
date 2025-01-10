# Cryptocurrency Data Fetcher and Analyzer

This project is a server-side application that fetches and analyzes cryptocurrency data for Bitcoin, Matic, and Ethereum.

## Features

- Fetches cryptocurrency data every 2 hours from the CoinGecko API
- Stores data in MongoDB
- Provides API endpoints for:
  - Getting latest stats for a specific cryptocurrency
  - Calculating standard deviation of price for the last 100 records

## API Endpoints

1. GET `/`
   Returns API information and available endpoints.

2. GET `/stats?coin=<coin_name>`
   Returns the latest price, market cap, and 24-hour change for the specified cryptocurrency.

3. GET `/deviation?coin=<coin_name>`
   Returns the standard deviation of the price for the last 100 records of the specified cryptocurrency.

## Testing the API

You can test the API using cURL, Postman, or your web browser. Here are some example commands:

1. Get API information:
```bash
curl https://koinx-crypto-backend.onrender.com/
