# Copy Trading Backend - API Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Trades](#trades)
  - [Copy Trading](#copy-trading)
  - [Leaderboard](#leaderboard)
  - [Market](#market)
- [Testing the APIs](#testing-the-apis)
- [Response Format](#response-format)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Redis (Upstash)
- Postman or cURL for testing

### Installation
```bash
npm install
```

---

## Running the Project

### Development Mode (Single Server)
```bash
npm run dev
```
Runs only the Express server on port 5000.

### Development Mode (Server + Worker)
```bash
npm run dev-all
```
Runs the server and the trade replication worker with auto-reload.

### Production Mode
```bash
npm start
```
Runs the server and worker in production mode.

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

## Authentication

### 1. Sign Up
**Endpoint:** `POST /auth/signup`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2026-03-20T10:30:00Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "username": "johndoe"
  }'
```

---

### 2. Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

## Users

### 3. Get User Profile
**Endpoint:** `GET /users/:id`

**Description:** Retrieve user profile information by user ID

**Path Parameters:**
- `id` (required): User ID

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "johndoe",
  "balance": 10000,
  "totalPnL": 500,
  "createdAt": "2026-03-20T10:30:00Z"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/users/user_id
```

---

## Trades

### 4. Create Trade
**Endpoint:** `POST /trades`

**Description:** Create a new trade entry

**Request Body:**
```json
{
  "user_id": "user_id",
  "symbol": "BTCUSD",
  "side": "BUY",
  "amount": 0.5,
  "price": 45000,
  "status": "OPEN"
}
```

**Response:**
```json
{
  "id": "trade_id",
  "user_id": "user_id",
  "symbol": "BTCUSD",
  "side": "BUY",
  "amount": 0.5,
  "price": 45000,
  "status": "OPEN",
  "createdAt": "2026-03-20T10:35:00Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/trades \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_id",
    "symbol": "BTCUSD",
    "side": "BUY",
    "amount": 0.5,
    "price": 45000,
    "status": "OPEN"
  }'
```

---

### 5. Get Trade History
**Endpoint:** `GET /trades/history/:userId`

**Description:** Retrieve all trades for a specific user

**Path Parameters:**
- `userId` (required): User ID

**Response:**
```json
[
  {
    "id": "trade_id_1",
    "user_id": "user_id",
    "symbol": "BTCUSD",
    "side": "BUY",
    "amount": 0.5,
    "price": 45000,
    "status": "OPEN",
    "createdAt": "2026-03-20T10:35:00Z"
  },
  {
    "id": "trade_id_2",
    "user_id": "user_id",
    "symbol": "ETHUSD",
    "side": "SELL",
    "amount": 2.0,
    "price": 2500,
    "status": "CLOSED",
    "createdAt": "2026-03-20T10:40:00Z"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/trades/history/user_id
```

---

## Copy Trading

### 6. Start Copy Trading
**Endpoint:** `POST /copy/start`

**Description:** Start copying trades from a trader

**Request Body:**
```json
{
  "follower_id": "follower_user_id",
  "trader_id": "trader_user_id",
  "allocation": 5000
}
```

**Response:**
```json
{
  "id": "copy_relationship_id",
  "follower_id": "follower_user_id",
  "trader_id": "trader_user_id",
  "allocation": 5000,
  "status": "ACTIVE",
  "createdAt": "2026-03-20T10:45:00Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/copy/start \
  -H "Content-Type: application/json" \
  -d '{
    "follower_id": "follower_user_id",
    "trader_id": "trader_user_id",
    "allocation": 5000
  }'
```

---

### 7. Stop Copy Trading
**Endpoint:** `POST /copy/stop`

**Description:** Stop copying trades from a trader

**Request Body:**
```json
{
  "follower_id": "follower_user_id",
  "trader_id": "trader_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Copy trading stopped",
  "relationship_id": "copy_relationship_id"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/copy/stop \
  -H "Content-Type: application/json" \
  -d '{
    "follower_id": "follower_user_id",
    "trader_id": "trader_user_id"
  }'
```

---

### 8. Get Followers
**Endpoint:** `GET /copy/followers/:traderId`

**Description:** Get all followers of a specific trader

**Path Parameters:**
- `traderId` (required): Trader user ID

**Response:**
```json
[
  {
    "id": "copy_relationship_id_1",
    "follower_id": "follower_user_id_1",
    "trader_id": "trader_user_id",
    "allocation": 5000,
    "status": "ACTIVE"
  },
  {
    "id": "copy_relationship_id_2",
    "follower_id": "follower_user_id_2",
    "trader_id": "trader_user_id",
    "allocation": 3000,
    "status": "ACTIVE"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/copy/followers/trader_user_id
```

---

## Leaderboard

### 9. Get Leaderboard
**Endpoint:** `GET /leaderboard`

**Description:** Get the top traders ranked by profit

**Response:**
```json
[
  {
    "rank": 1,
    "user_id": "top_trader_id",
    "username": "toptrader",
    "totalPnL": 15000,
    "winRate": 0.75,
    "followers": 150
  },
  {
    "rank": 2,
    "user_id": "second_trader_id",
    "username": "secondtrader",
    "totalPnL": 12000,
    "winRate": 0.72,
    "followers": 120
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/leaderboard
```

---

## Market

### 10. Get BTC Price
**Endpoint:** `GET /market/btc`

**Description:** Get the current Bitcoin price

**Response:**
```json
{
  "price": 45000.50
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/market/btc
```

---

## Testing the APIs

### Option 1: Using Postman

1. **Import Collection**
   - Open Postman
   - Create a new collection called "Copy Trading API"
   - Add requests for each endpoint

2. **Set Environment Variables**
   - Create an environment called "Local"
   - Add variable: `BASE_URL` = `http://localhost:5000`
   - Add variable: `TOKEN` = (will be set after login)

3. **Example Postman Workflow**
   ```
   1. Sign Up → Store user info
   2. Login → Store token in {{TOKEN}}
   3. Get User Profile → Verify user creation
   4. Create Trade → Add a trade
   5. Get Trade History → View trades
   6. Start Copy Trading → Set up copy relationship
   7. Get Leaderboard → View rankings
   8. Get BTC Price → Check market data
   ```

### Option 2: Using cURL (Bash/PowerShell)

#### Create a test script `test-api.sh`:
```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== Testing Copy Trading API ==="

# Sign Up
echo -e "\n1. Testing Sign Up..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!",
    "username": "testuser"
  }')
echo $SIGNUP_RESPONSE | jq .

# Login
echo -e "\n2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# Get User
echo -e "\n3. Testing Get User..."
curl -s -X GET $BASE_URL/users/user-id | jq .

# Create Trade
echo -e "\n4. Testing Create Trade..."
curl -s -X POST $BASE_URL/trades \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-id",
    "symbol": "BTCUSD",
    "side": "BUY",
    "amount": 0.5,
    "price": 45000,
    "status": "OPEN"
  }' | jq .

# Get BTC Price
echo -e "\n5. Testing Get Market Price..."
curl -s -X GET $BASE_URL/market/btc | jq .

# Get Leaderboard
echo -e "\n6. Testing Get Leaderboard..."
curl -s -X GET $BASE_URL/leaderboard | jq .
```

Run the script:
```bash
chmod +x test-api.sh
./test-api.sh
```

### Option 3: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create requests for each endpoint
3. Use the same JSON payloads as shown above

---

## Response Format

All API responses follow a consistent format:

### Success Response (2xx)
```json
{
  "id": "...",
  "field": "value",
  "createdAt": "..."
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

---

## Quick Start Testing

### 1. Start the server and worker
```bash
npm run dev-all
```

### 2. Test a simple endpoint (no auth required)
```bash
curl http://localhost:5000/api/market/btc
```

### 3. Create a user and get a token
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "Test123!",
    "username": "testuser"
  }'
```

### 4. Use the token for authenticated requests
```bash
curl -X GET http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues

### Port Already in Use
```bash
# Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :5000
kill -9 <PID>
```

### Redis Connection Error
- Ensure REDIS_URL is set in `.env`
- Check Upstash Redis credentials
- Verify internet connection

### Database Connection Error
- Verify DATABASE_URL in `.env`
- Check PostgreSQL database is running
- Verify credentials and network access

---

## API Summary Table

| # | Method | Endpoint | Description | Auth |
|---|--------|----------|-------------|------|
| 1 | POST | `/auth/signup` | Create account | ❌ |
| 2 | POST | `/auth/login` | Get JWT token | ❌ |
| 3 | GET | `/users/:id` | Get user profile | ✅ |
| 4 | POST | `/trades` | Create trade | ✅ |
| 5 | GET | `/trades/history/:userId` | Get trade history | ✅ |
| 6 | POST | `/copy/start` | Start copy trading | ✅ |
| 7 | POST | `/copy/stop` | Stop copy trading | ✅ |
| 8 | GET | `/copy/followers/:traderId` | Get trader followers | ✅ |
| 9 | GET | `/leaderboard` | Get leaderboard | ❌ |
| 10 | GET | `/market/btc` | Get BTC price | ❌ |

---

## Support & Debugging

For debugging requests, use:
- **Postman Console** - View request/response details
- **VS Code Thunder Client** - Built-in request testing
- **Browser DevTools** - Check network tab
- **Server Logs** - Check terminal output for errors

---

**Last Updated:** March 20, 2026
**Version:** 1.0.0
