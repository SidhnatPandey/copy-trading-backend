# Quick Start Guide - Testing Copy Trading APIs

## 🚀 Quick Setup

### 1. Start the Application
```bash
# Terminal 1: Run server and worker
npm run dev-all
```

Expected output:
```
Server running on port 5000
[Redis] Listening on trade_executed channel
```

---

## 📋 How to Test APIs

### Option 1: Using Postman (Recommended)

1. **Download Postman** (if not already installed)
   - Visit: https://www.postman.com/downloads/

2. **Import Collection**
   - Open Postman
   - Click: `File` → `Import`
   - Select: `Copy_Trading_API.postman_collection.json`
   - Click: `Import`

3. **Setup Environment Variables**
   - Click: `Environments` (bottom left)
   - Create new environment: `Local`
   - Add these variables:
     ```
     BASE_URL = http://localhost:5000/api
     TOKEN = (will be filled after login)
     USER_ID = (will be filled after signup)
     TRADER_ID = trader-123
     FOLLOWER_ID = (your user id)
     ```

4. **Run Tests**
   - Select `Local` environment (top right)
   - Execute requests in order:
     1. Auth → Sign Up
     2. Auth → Login (this will auto-fill TOKEN)
     3. Market → Get BTC Price
     4. Users → Get User Profile
     5. And so on...

---

### Option 2: Using PowerShell (Windows)

```powershell
# Navigate to project directory
cd D:\copy-trading\copy-trading-backend

# Run the PowerShell test script
.\test-api.ps1
```

This will automatically test all 10 API endpoints and display results.

---

### Option 3: Using Bash (Linux/Mac)

```bash
# Navigate to project directory
cd /path/to/copy-trading-backend

# Make script executable
chmod +x test-api.sh

# Run the test script
./test-api.sh
```

---

### Option 4: Using cURL Manually

Test a single endpoint:
```bash
# Get BTC Price (no auth needed)
curl http://localhost:5000/api/market/btc

# Get Leaderboard (no auth needed)
curl http://localhost:5000/api/leaderboard

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "username": "myuser"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

---

### Option 5: Using Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Create new requests with the same endpoints from documentation
3. Test directly in VS Code

---

## 🧪 Testing Workflow

### Basic Workflow:
```
1. Sign Up → Get User ID
2. Login → Get JWT Token
3. Get User Profile (using USER_ID)
4. Create Trade (using USER_ID)
5. View Trade History
6. Start Copy Trading
7. Check Followers
```

### Without Authentication:
```
- Get BTC Price ✓ Works without token
- Get Leaderboard ✓ Works without token
```

---

## 📊 API Overview

| Function | Method | Endpoint | Auth | Testing Tool |
|----------|--------|----------|------|--------------|
| Sign Up | POST | `/auth/signup` | ❌ | Postman / cURL |
| Login | POST | `/auth/login` | ❌ | Postman / cURL |
| Get User | GET | `/users/:id` | ✅ | Postman |
| Create Trade | POST | `/trades` | ✅ | Postman |
| Trade History | GET | `/trades/history/:userId` | ✅ | Postman |
| Start Copy | POST | `/copy/start` | ✅ | Postman |
| Stop Copy | POST | `/copy/stop` | ✅ | Postman |
| Get Followers | GET | `/copy/followers/:traderId` | ✅ | Postman |
| Leaderboard | GET | `/leaderboard` | ❌ | Browser / cURL |
| BTC Price | GET | `/market/btc` | ❌ | Browser / cURL |

---

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process using port 5000
taskkill /PID <PID> /F
```

### "Cannot Connect" Error
- Verify server is running: `npm run dev-all`
- Check BASE_URL is correct: `http://localhost:5000/api`
- Ensure firewall allows port 5000

### Redis Connection Error
- Verify `.env` file contains `REDIS_URL`
- Check internet connection (for Upstash)
- See: [Error Fix](../README.md#redis-connection-error)

### Token Issues
- Make sure you run the Login request first
- Copy the entire token value (without quotes)
- In Postman, set Bearer token in Authorization tab

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `API_DOCUMENTATION.md` | Complete API reference with examples |
| `Copy_Trading_API.postman_collection.json` | Postman collection (import this) |
| `test-api.ps1` | PowerShell testing script (Windows) |
| `test-api.sh` | Bash testing script (Linux/Mac) |

---

## 🎯 Next Steps

1. ✅ Start the server: `npm run dev-all`
2. ✅ Choose a testing method (Postman recommended)
3. ✅ Follow the Basic Workflow above
4. ✅ Check API_DOCUMENTATION.md for details
5. ✅ Review response formats and error handling

---

## 💡 Pro Tips

### Postman Tips:
- Use `Tests` tab to set variables automatically
- Use `Pre-request Scripts` to set dynamic values
- Export/import collections for sharing with team

### cURL Tips:
- Use `-v` flag for verbose output (debugging)
- Use `jq` to format JSON: `curl ... | jq '.'`
- Use environment variables: `export TOKEN="your-token"`

### Testing Tips:
- Test without auth first (Market, Leaderboard)
- Then test with auth (Users, Trades, Copy)
- Always sign up/login before using protected endpoints
- Save important IDs for testing multiple endpoints

---

## 📞 Support

For detailed information on:
- Request/response formats → See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Endpoint details → See respective sections in documentation
- Error codes → Check response status and error messages

---

**Created:** March 20, 2026  
**Version:** 1.0.0  
**Status:** Ready for Testing ✓
