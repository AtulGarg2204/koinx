# Cryptocurrency Data Fetcher and Analyzer

This project is a server-side application that fetches and analyzes cryptocurrency data for Bitcoin, Matic, and Ethereum.

## Features

- Fetches cryptocurrency data every 2 hours from the CoinGecko API
- Stores data in MongoDB
- Provides API endpoints for:
  - Getting latest stats for a specific cryptocurrency
  - Calculating standard deviation of price for the last 100 records

## API Endpoints

1. GET `/stats?coin=<coin_name>`
   Returns the latest price, market cap, and 24-hour change for the specified cryptocurrency.

2. GET `/deviation?coin=<coin_name>`
   Returns the standard deviation of the price for the last 100 records of the specified cryptocurrency.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your MongoDB connection string:

