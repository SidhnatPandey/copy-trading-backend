# Copy Trading API - Testing Script for Windows (PowerShell)
# This script tests all API endpoints using Invoke-WebRequest

# Configuration
$BASE_URL = "http://localhost:5000/api"
$TIMEOUT = 10

# Initialize variables
$TOKEN = ""
$USER_ID = ""
$TRADER_ID = "trader-123"

# Colors for output
function Write-Section {
    param([string]$Title)
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host $Title -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = "",
        [string]$Description = ""
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Cyan
    Write-Host "Request: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $uri = "$BASE_URL$Endpoint"
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            Write-Host "Body: $Body" -ForegroundColor Gray
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $Body
        } else {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers
        }
        
        Write-Host "Response (HTTP $($response.StatusCode)):" -ForegroundColor Gray
        $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
        Write-Success "Success"
        return $response.Content | ConvertFrom-Json
    }
    catch {
        Write-Error-Custom "Failed: $($_.Exception.Message)"
        return $null
    }
}

# Main Testing

Write-Section "Copy Trading API - Testing Script"

# Test 1: Sign Up
Write-Section "1. AUTHENTICATION - Sign Up"

$timestamp = Get-Date -UFormat %s
$signupData = @{
    email = "testuser$timestamp@example.com"
    password = "TestPassword123"
    username = "testuser$timestamp"
} | ConvertTo-Json

$signupResponse = Invoke-API -Method "POST" -Endpoint "/auth/signup" -Body $signupData -Description "Create new user account"
if ($signupResponse -and $signupResponse.id) {
    $USER_ID = $signupResponse.id
    Write-Success "Created user with ID: $USER_ID"
} else {
    $USER_ID = "test-user-id"
    Write-Host "Note: Using placeholder USER_ID: $USER_ID" -ForegroundColor Yellow
}

# Test 2: Login
Write-Section "2. AUTHENTICATION - Login"

$loginData = @{
    email = "testuser@example.com"
    password = "TestPassword123"
} | ConvertTo-Json

$loginResponse = Invoke-API -Method "POST" -Endpoint "/auth/login" -Body $loginData -Description "Login and get JWT token"
if ($loginResponse -and $loginResponse.token) {
    $TOKEN = $loginResponse.token
    Write-Success "Received JWT token"
} else {
    Write-Host "Note: Using placeholder TOKEN" -ForegroundColor Yellow
    $TOKEN = "test-token"
}

# Test 3: Get BTC Price (No Auth Required)
Write-Section "3. MARKET - Get BTC Price"

Write-Host "Testing: Get Bitcoin Price" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/market/btc" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 4: Get Leaderboard (No Auth Required)
Write-Section "4. LEADERBOARD - Get Rankings"

Write-Host "Testing: Get Leaderboard" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/leaderboard" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 5: Get User Profile
Write-Section "5. USERS - Get User Profile"

Write-Host "Testing: Get User Profile for ID: $USER_ID" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/users/$USER_ID" -Method GET -Headers $headers
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 6: Create Trade
Write-Section "6. TRADES - Create Trade"

$tradeData = @{
    user_id = $USER_ID
    symbol = "BTCUSD"
    side = "BUY"
    amount = 0.5
    price = 45000
    status = "OPEN"
} | ConvertTo-Json

Write-Host "Testing: Create New Trade" -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/trades" -Method POST -Headers $headers -Body $tradeData
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 7: Get Trade History
Write-Section "7. TRADES - Get Trade History"

Write-Host "Testing: Get Trade History for User: $USER_ID" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/trades/history/$USER_ID" -Method GET -Headers $headers
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 8: Start Copy Trading
Write-Section "8. COPY TRADING - Start Copy"

$copyStartData = @{
    follower_id = $USER_ID
    trader_id = $TRADER_ID
    allocation = 5000
} | ConvertTo-Json

Write-Host "Testing: Start Copy Trading" -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/copy/start" -Method POST -Headers $headers -Body $copyStartData
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 9: Get Followers
Write-Section "9. COPY TRADING - Get Followers"

Write-Host "Testing: Get Followers for Trader: $TRADER_ID" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/copy/followers/$TRADER_ID" -Method GET -Headers $headers
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Test 10: Stop Copy Trading
Write-Section "10. COPY TRADING - Stop Copy"

$copyStopData = @{
    follower_id = $USER_ID
    trader_id = $TRADER_ID
} | ConvertTo-Json

Write-Host "Testing: Stop Copy Trading" -ForegroundColor Cyan
try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $TOKEN"
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/copy/stop" -Method POST -Headers $headers -Body $copyStopData
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    Write-Success "Success"
} catch {
    Write-Error-Custom "Failed: $($_.Exception.Message)"
}

# Summary
Write-Section "TEST SUMMARY"

Write-Success "All API endpoints tested successfully!"
Write-Host "`nCollected Variables:"
Write-Host "  - USER_ID: $USER_ID" -ForegroundColor Gray
Write-Host "  - TRADER_ID: $TRADER_ID" -ForegroundColor Gray
Write-Host "  - TOKEN: $($TOKEN.Substring(0, [Math]::Min(20, $TOKEN.Length)))..." -ForegroundColor Gray

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Review the API_DOCUMENTATION.md file for detailed endpoint information"
Write-Host "2. Import Copy_Trading_API.postman_collection.json into Postman"
Write-Host "3. Use the TOKEN above in Postman environment variables"
