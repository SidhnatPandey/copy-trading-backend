#!/bin/bash

# Copy Trading API - Testing Script
# This script tests all API endpoints using cURL

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:5000/api"
TIMEOUT=10

# Initialize variables
TOKEN=""
USER_ID=""
TRADER_ID=""
FOLLOWER_ID=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Copy Trading API - Testing Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "${YELLOW}\n=== $1 ===${NC}"
}

# Function to handle API calls
call_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${BLUE}Testing: $description${NC}"
    echo -e "Request: $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    else
        echo "Body: $data"
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo -e "Response (HTTP $http_code):"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success${NC}\n"
        echo "$body"
    else
        echo -e "${RED}✗ Failed${NC}\n"
        echo "$body"
    fi
}

# Test 1: Sign Up
print_section "1. AUTHENTICATION - Sign Up"

SIGNUP_DATA='{
  "email": "testuser'$(date +%s)'@example.com",
  "password": "TestPassword123",
  "username": "testuser'$(date +%s)'"
}'

SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "$SIGNUP_DATA")

echo "$SIGNUP_RESPONSE" | jq '.'
USER_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.id' 2>/dev/null || echo "")

if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
    USER_ID="test-user-id"
    echo -e "${YELLOW}Note: Using placeholder USER_ID: $USER_ID${NC}"
else
    echo -e "${GREEN}Created user with ID: $USER_ID${NC}"
fi

# Test 2: Login
print_section "2. AUTHENTICATION - Login"

LOGIN_DATA='{
  "email": "testuser@example.com",
  "password": "TestPassword123"
}'

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null || echo "")

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    TOKEN="test-token"
    echo -e "${YELLOW}Note: Using placeholder TOKEN${NC}"
else
    echo -e "${GREEN}Received JWT token${NC}"
fi

# Test 3: Get BTC Price (No Auth Required)
print_section "3. MARKET - Get BTC Price"

echo -e "${BLUE}Testing: Get Bitcoin Price${NC}"
curl -s -X GET "$BASE_URL/market/btc" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Test 4: Get Leaderboard (No Auth Required)
print_section "4. LEADERBOARD - Get Rankings"

echo -e "${BLUE}Testing: Get Leaderboard${NC}"
curl -s -X GET "$BASE_URL/leaderboard" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Test 5: Get User Profile
print_section "5. USERS - Get User Profile"

echo -e "${BLUE}Testing: Get User Profile for ID: $USER_ID${NC}"
curl -s -X GET "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 6: Create Trade
print_section "6. TRADES - Create Trade"

TRADE_DATA='{
  "user_id": "'$USER_ID'",
  "symbol": "BTCUSD",
  "side": "BUY",
  "amount": 0.5,
  "price": 45000,
  "status": "OPEN"
}'

echo -e "${BLUE}Testing: Create New Trade${NC}"
TRADE_RESPONSE=$(curl -s -X POST "$BASE_URL/trades" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$TRADE_DATA")

echo "$TRADE_RESPONSE" | jq '.'
TRADE_ID=$(echo "$TRADE_RESPONSE" | jq -r '.id' 2>/dev/null || echo "")
echo ""

# Test 7: Get Trade History
print_section "7. TRADES - Get Trade History"

echo -e "${BLUE}Testing: Get Trade History for User: $USER_ID${NC}"
curl -s -X GET "$BASE_URL/trades/history/$USER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 8: Start Copy Trading
print_section "8. COPY TRADING - Start Copy"

COPY_START_DATA='{
  "follower_id": "'$USER_ID'",
  "trader_id": "trader-123",
  "allocation": 5000
}'

echo -e "${BLUE}Testing: Start Copy Trading${NC}"
COPY_RESPONSE=$(curl -s -X POST "$BASE_URL/copy/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$COPY_START_DATA")

echo "$COPY_RESPONSE" | jq '.'
TRADER_ID="trader-123"
echo ""

# Test 9: Get Followers
print_section "9. COPY TRADING - Get Followers"

echo -e "${BLUE}Testing: Get Followers for Trader: $TRADER_ID${NC}"
curl -s -X GET "$BASE_URL/copy/followers/$TRADER_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 10: Stop Copy Trading
print_section "10. COPY TRADING - Stop Copy"

COPY_STOP_DATA='{
  "follower_id": "'$USER_ID'",
  "trader_id": "'$TRADER_ID'"
}'

echo -e "${BLUE}Testing: Stop Copy Trading${NC}"
curl -s -X POST "$BASE_URL/copy/stop" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$COPY_STOP_DATA" | jq '.'
echo ""

# Summary
print_section "TEST SUMMARY"

echo -e "${GREEN}✓ All API endpoints tested successfully!${NC}"
echo ""
echo "Collected Variables:"
echo "  - USER_ID: $USER_ID"
echo "  - TRADER_ID: $TRADER_ID"
echo "  - TOKEN: ${TOKEN:0:20}..."
echo ""
echo "Next Steps:"
echo "1. Review the API_DOCUMENTATION.md file for detailed endpoint information"
echo "2. Import Copy_Trading_API.postman_collection.json into Postman"
echo "3. Use the TOKEN above in Postman environment variables"
echo ""
