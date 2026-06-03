#!/usr/bin/env bash
# =============================================================================
# test_real_api.sh — Interactive Real Mode API Test Suite for Telegramonic
#
# Connects to a running server in Real Mode and performs an actual login
# sequence via the Telegram MTProto network.
#
# Usage:
#   ./testing/test_real_api.sh
#   BASE_URL=http://localhost:8080 ./testing/test_real_api.sh
# =============================================================================

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
print_step() {
  echo -e "\n${CYAN}${BOLD}▶ $1${RESET}"
}

print_success() {
  echo -e "${GREEN}✓ $1${RESET}"
}

print_error() {
  echo -e "${RED}✗ ERROR: $1${RESET}"
}

post() {
  curl -s -X POST "${BASE_URL}$1" \
    -H "Content-Type: application/json" \
    -d "${2:-{}}"
}

get() {
  curl -s -X GET "${BASE_URL}$1" \
    -H "Content-Type: application/json"
}

# ── Preflight Checks ──────────────────────────────────────────────────────────
clear
echo -e "${BOLD}====================================================${RESET}"
echo -e "${BOLD}       Telegramonic Real Mode API Test Tool         ${RESET}"
echo -e "${BOLD}====================================================${RESET}"
echo -e "Target Server URL: ${CYAN}${BASE_URL}${RESET}"

# Verify jq is installed
if ! command -v jq &> /dev/null; then
  print_error "'jq' is required but not installed."
  echo "Please install jq first (e.g. 'brew install jq' or 'sudo apt-get install jq')."
  exit 1
fi

# Verify server connectivity
if ! curl -sf "${BASE_URL}/auth/state" > /dev/null 2>&1; then
  print_error "Cannot connect to Telegramonic backend server at ${BASE_URL}."
  echo "Ensure the server is running."
  echo "Remember to run the server in REAL mode using:"
  echo -e "  ${BOLD}TELEGRAM_API_ID=<id> TELEGRAM_API_HASH=<hash> cargo run${RESET}"
  exit 1
fi

print_success "Server is reachable."

# Get initial auth state
initial_state=$(get /auth/state)
status=$(echo "$initial_state" | jq -r '.status')

echo -e "Initial Server Auth State: ${YELLOW}${status}${RESET}"

if [ "$status" = "LoggedIn" ]; then
  echo -e "\n${YELLOW}You are already logged in.${RESET}"
  read -p "Would you like to log out first to run the login test? (y/n): " logout_choice
  if [[ "$logout_choice" =~ ^[Yy]$ ]]; then
    logout_res=$(post /auth/log-out '{}')
    if echo "$logout_res" | jq -e '.success' >/dev/null; then
      print_success "Logged out successfully."
    else
      print_error "Failed to log out. Proceeding anyway."
    fi
  else
    print_step "Skipping login flow. Fetching profile info directly..."
  fi
fi

# Refresh state
status=$(get /auth/state | jq -r '.status')

if [ "$status" != "LoggedIn" ]; then
  # ── Step 1: Input Credentials ───────────────────────────────────────────────
  print_step "Step 1: Enter Telegram Credentials"
  echo "Please provide the phone number and API credentials."
  echo "Note: The API ID/Hash must match the ones the server was started with."
  
  read -p "Phone Number (e.g. +15555551234): " PHONE
  if [ -z "$PHONE" ]; then
    print_error "Phone number cannot be empty."
    exit 1
  fi

  read -p "Telegram API ID (from my.telegram.org): " API_ID
  if [ -z "$API_ID" ]; then
    print_error "API ID cannot be empty."
    exit 1
  fi

  read -p "Telegram API Hash (from my.telegram.org): " API_HASH
  if [ -z "$API_HASH" ]; then
    print_error "API Hash cannot be empty."
    exit 1
  fi

  # ── Step 2: Request Login Code ──────────────────────────────────────────────
  print_step "Step 2: Requesting Login Code..."
  payload=$(jq -n \
    --arg phone "$PHONE" \
    --arg api_id "$API_ID" \
    --arg api_hash "$API_HASH" \
    '{phone: $phone, api_id: $api_id, api_hash: $api_hash}')

  send_code_res=$(post /auth/send-code "$payload")

  if ! echo "$send_code_res" | jq -e '.success' >/dev/null; then
    err=$(echo "$send_code_res" | jq -r '.error // "Unknown error"')
    print_error "Failed to send code: $err"
    exit 1
  fi

  print_success "Login code requested successfully."
  echo "Check your Telegram app or SMS for the verification code."

  # ── Step 3: Verify Login Code ───────────────────────────────────────────────
  print_step "Step 3: Verification"
  read -p "Enter the verification code: " CODE
  if [ -z "$CODE" ]; then
    print_error "Verification code cannot be empty."
    exit 1
  fi

  sign_in_payload=$(jq -n \
    --arg phone "$PHONE" \
    --arg code "$CODE" \
    '{phone: $phone, code: $code}')

  sign_in_res=$(post /auth/sign-in "$sign_in_payload")

  success=$(echo "$sign_in_res" | jq -r '.success')
  next_step=$(echo "$sign_in_res" | jq -r '.next_step')

  if [ "$success" != "true" ]; then
    err=$(echo "$sign_in_res" | jq -r '.error // "Unknown error"')
    print_error "Sign-in failed: $err"
    exit 1
  fi

  # ── Step 4: Handle 2-Factor Authentication (if required) ────────────────────
  if [ "$next_step" = "password" ]; then
    print_step "Step 4: Two-Step Verification Required"
    read -s -p "Enter your 2FA password: " PASSWORD
    echo "" # newline

    pwd_payload=$(jq -n --arg pwd "$PASSWORD" '{password: $pwd}')
    pwd_res=$(post /auth/check-password "$pwd_payload")

    pwd_success=$(echo "$pwd_res" | jq -r '.success')
    if [ "$pwd_success" != "true" ]; then
      err=$(echo "$pwd_res" | jq -r '.error // "Incorrect password"')
      print_error "2FA password check failed: $err"
      exit 1
    fi
    print_success "2FA verification succeeded."
  fi
fi

print_success "Successfully authenticated!"

# ── Step 5: Test Authenticated Endpoints ─────────────────────────────────────
print_step "Step 5: Querying Account Profile"
me_res=$(get /users/me)
if echo "$me_res" | jq -e '.id' >/dev/null; then
  first_name=$(echo "$me_res" | jq -r '.first_name')
  last_name=$(echo "$me_res" | jq -r '.last_name // ""')
  username=$(echo "$me_res" | jq -r '.username // "none"')
  echo -e "User ID:    ${GREEN}$(echo "$me_res" | jq -r '.id')${RESET}"
  echo -e "Name:       ${GREEN}${first_name} ${last_name}${RESET}"
  echo -e "Username:   ${GREEN}@${username}${RESET}"
else
  print_error "Failed to retrieve profile: $me_res"
fi

print_step "Step 6: Querying Channels (Drives)"
drives_res=$(get /drive/list)
if echo "$drives_res" | jq -e 'type == "array"' >/dev/null; then
  count=$(echo "$drives_res" | jq '. | length')
  echo -e "Found ${GREEN}${count}${RESET} channels/drives."
  if [ "$count" -gt 0 ]; then
    echo "$drives_res" | jq -r '.[] | " - \(.name) (Chat ID: \(.chat_id))"'
  fi
else
  print_error "Failed to retrieve drives: $drives_res"
fi

# ── Clean up option ───────────────────────────────────────────────────────────
print_step "Step 7: Session Cleanup"
read -p "Keep session active? (y/n): " keep_session
if [[ ! "$keep_session" =~ ^[Yy]$ ]]; then
  logout_res=$(post /auth/log-out '{}')
  if echo "$logout_res" | jq -e '.success' >/dev/null; then
    print_success "Session terminated. Logged out successfully."
  else
    print_error "Failed to log out."
  fi
else
  echo -e "${GREEN}Session kept active. You can open the client React app now!${RESET}"
fi

echo -e "\n${BOLD}====================================================${RESET}"
echo -e "${GREEN}${BOLD}             Real Mode Test Complete!               ${RESET}"
echo -e "${BOLD}====================================================${RESET}"
