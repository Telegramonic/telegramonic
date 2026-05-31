#!/usr/bin/env bash
# =============================================================================
# test_auth.sh — Auth API test suite for the Telegramonic backend server
#
# Tests all endpoints under the /auth namespace against the mock server.
# Covers: state polling, happy-path login, 2FA flow, invalid inputs,
# logout, and session reset.
#
# Usage:
#   ./testing/test_auth.sh             # default: http://127.0.0.1:8080
#   BASE_URL=http://localhost:9090 ./testing/test_auth.sh
#
# Requirements:
#   - curl  (https://curl.se)
#   - jq    (https://stedolan.github.io/jq)
#
# Exit codes:
#   0  all tests passed
#   1  one or more tests failed
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

# ── Counters ──────────────────────────────────────────────────────────────────
PASSED=0
FAILED=0
SKIPPED=0

# ── Helpers ───────────────────────────────────────────────────────────────────

print_header() {
  echo ""
  echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${CYAN}${BOLD}  $1${RESET}"
  echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
}

print_test() {
  echo -e "\n${BOLD}▸ TEST: $1${RESET}"
}

pass() {
  echo -e "  ${GREEN}✓ PASS${RESET}  $1"
  PASSED=$((PASSED + 1))
}

fail() {
  echo -e "  ${RED}✗ FAIL${RESET}  $1"
  FAILED=$((FAILED + 1))
}

skip() {
  echo -e "  ${YELLOW}⊘ SKIP${RESET}  $1"
  SKIPPED=$((SKIPPED + 1))
}

# Perform a GET request and return the response body.
# Usage: get /path
get() {
  curl -s -X GET "${BASE_URL}$1" \
    -H "Content-Type: application/json"
}

# Perform a POST request and return the response body.
# Usage: post /path '{"key":"value"}'
post() {
  curl -s -X POST "${BASE_URL}$1" \
    -H "Content-Type: application/json" \
    -d "${2:-{}}"
}

# Assert that a JSON field equals the expected value.
# Usage: assert_eq "test description" "$json" ".field" "expected"
assert_eq() {
  local label="$1" body="$2" path="$3" expected="$4"
  local actual
  actual=$(echo "$body" | jq -r "$path" 2>/dev/null)
  if [[ "$actual" == "$expected" ]]; then
    pass "$label (got: $(echo "$body" | jq -c "$path" 2>/dev/null))"
  else
    fail "$label — expected '$expected', got '$actual'"
    echo -e "     ${YELLOW}Body: $(echo "$body" | jq -c . 2>/dev/null || echo "$body")${RESET}"
  fi
}

# Assert that a JSON boolean field is true.
assert_true() {
  local label="$1" body="$2" path="$3"
  assert_eq "$label" "$body" "$path" "true"
}

# Assert that a JSON boolean field is false.
assert_false() {
  local label="$1" body="$2" path="$3"
  assert_eq "$label" "$body" "$path" "false"
}

# ── Preflight check ───────────────────────────────────────────────────────────

check_server() {
  print_header "Preflight: Server Connectivity"
  echo -e "  Target: ${BOLD}${BASE_URL}${RESET}"

  if ! curl -sf "${BASE_URL}/auth/state" > /dev/null 2>&1; then
    echo -e "\n  ${RED}${BOLD}ERROR: Cannot reach server at ${BASE_URL}${RESET}"
    echo -e "  Start it with:  ${BOLD}cargo run${RESET}  (from the server/ directory)"
    exit 1
  fi

  echo -e "  ${GREEN}Server is reachable.${RESET}"
}

# ── Reset helper: ensures session is LoggedOut before each test group ─────────

reset_session() {
  post /auth/reset-authorization > /dev/null
}

# =============================================================================
# TEST GROUPS
# =============================================================================

# ─── 1. Auth State ────────────────────────────────────────────────────────────

test_auth_state() {
  print_header "1 · GET /auth/state"

  reset_session

  print_test "Returns LoggedOut status after reset"
  local body
  body=$(get /auth/state)
  assert_eq "status is LoggedOut" "$body" ".status" "LoggedOut"
}

# ─── 2. Send Code ─────────────────────────────────────────────────────────────

test_send_code() {
  print_header "2 · POST /auth/send-code"

  reset_session

  print_test "Valid phone sends code successfully"
  local body
  body=$(post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}')
  assert_true  "success is true"              "$body" ".success"
  assert_eq    "next_step is 'code'"          "$body" ".next_step" "code"

  print_test "State transitions to AwaitingCode after send-code"
  local state_body
  state_body=$(get /auth/state)
  assert_eq    "status is AwaitingCode"       "$state_body" ".status" "AwaitingCode"
  assert_eq    "phone stored in state"        "$state_body" ".data.phone" "+15551234567"

  print_test "Empty phone number returns an error"
  reset_session
  local err_body
  err_body=$(post /auth/send-code '{"phone":"","api_id":"12345","api_hash":"abc123"}')
  assert_false "success is false"             "$err_body" ".success"

  print_test "Missing api_id returns 400 Bad Request"
  reset_session
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/auth/send-code" \
    -H "Content-Type: application/json" \
    -d '{"phone":"+15551234567","api_id":"not-a-number","api_hash":"abc123"}')
  if [[ "$http_code" == "400" ]]; then
    pass "Non-integer api_id returns HTTP 400 (got: $http_code)"
    PASSED=$((PASSED + 1))
    # compensate for the pass inside the if — we called pass twice, subtract one
    PASSED=$((PASSED - 1))
  else
    fail "Non-integer api_id — expected HTTP 400, got: $http_code"
  fi
}

# ─── 3. Sign In — Happy Path ──────────────────────────────────────────────────

test_sign_in_happy_path() {
  print_header "3 · POST /auth/sign-in — Happy Path (code '12345')"

  reset_session

  # First, put session into AwaitingCode state
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null

  print_test "Valid code '12345' signs in directly to dashboard"
  local body
  body=$(post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"12345"}')
  assert_true  "success is true"              "$body" ".success"
  assert_eq    "next_step is 'dashboard'"     "$body" ".next_step" "dashboard"

  print_test "State is LoggedIn after successful sign-in"
  local state_body
  state_body=$(get /auth/state)
  assert_eq    "status is LoggedIn"          "$state_body" ".status" "LoggedIn"

  print_test "Alternative valid code '11111' also signs in"
  reset_session
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null
  local body2
  body2=$(post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"11111"}')
  assert_true  "success is true"              "$body2" ".success"
  assert_eq    "next_step is 'dashboard'"     "$body2" ".next_step" "dashboard"
}

# ─── 4. Sign In — Invalid Code ────────────────────────────────────────────────

test_sign_in_invalid_code() {
  print_header "4 · POST /auth/sign-in — Invalid Code"

  reset_session
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null

  print_test "Wrong code returns failure with next_step='code'"
  local body
  body=$(post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"00000"}')
  assert_false "success is false"             "$body" ".success"
  assert_eq    "next_step remains 'code'"     "$body" ".next_step" "code"

  print_test "Error message is present on failure"
  local error_msg
  error_msg=$(echo "$body" | jq -r '.error')
  if [[ -n "$error_msg" && "$error_msg" != "null" ]]; then
    pass "error field populated: '$error_msg'"
  else
    fail "error field is null or missing"
  fi
}

# ─── 5. Two-Factor Authentication Flow ───────────────────────────────────────

test_2fa_flow() {
  print_header "5 · 2FA Flow — code '2fa' → check-password"

  reset_session
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null

  print_test "Code '2fa' transitions to AwaitingPassword"
  local body
  body=$(post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"2fa"}')
  assert_true  "success is true"              "$body" ".success"
  assert_eq    "next_step is 'password'"      "$body" ".next_step" "password"

  print_test "State is AwaitingPassword"
  local state_body
  state_body=$(get /auth/state)
  assert_eq    "status is AwaitingPassword"   "$state_body" ".status" "AwaitingPassword"

  print_test "Correct password 'password' completes login"
  local pw_body
  pw_body=$(post /auth/check-password '{"password":"password"}')
  assert_true  "success is true"              "$pw_body" ".success"
  assert_eq    "next_step is 'dashboard'"     "$pw_body" ".next_step" "dashboard"

  print_test "State is LoggedIn after password verification"
  local final_state
  final_state=$(get /auth/state)
  assert_eq    "status is LoggedIn"          "$final_state" ".status" "LoggedIn"

  print_test "Wrong password returns failure"
  reset_session
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null
  post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"22222"}' > /dev/null
  local bad_pw_body
  bad_pw_body=$(post /auth/check-password '{"password":"wrongpassword"}')
  assert_false "success is false"             "$bad_pw_body" ".success"
  assert_eq    "next_step remains 'password'" "$bad_pw_body" ".next_step" "password"
}

# ─── 6. Log Out ───────────────────────────────────────────────────────────────

test_log_out() {
  print_header "6 · POST /auth/log-out"

  reset_session
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null
  post /auth/sign-in \
    '{"phone":"+15551234567","phone_code_hash":"mock_hash_xyz123","code":"12345"}' > /dev/null

  print_test "Logging out from an active session succeeds"
  local body
  body=$(post /auth/log-out '{}')
  assert_true "success is true"               "$body" ".success"

  print_test "State is LoggedOut after log-out"
  local state_body
  state_body=$(get /auth/state)
  assert_eq   "status is LoggedOut"           "$state_body" ".status" "LoggedOut"

  print_test "Logging out when already LoggedOut is idempotent"
  local body2
  body2=$(post /auth/log-out '{}')
  assert_true "success is true"               "$body2" ".success"
}

# ─── 7. Reset Authorization ───────────────────────────────────────────────────

test_reset_authorization() {
  print_header "7 · POST /auth/reset-authorization"

  # Put into mid-flow AwaitingCode state
  post /auth/send-code '{"phone":"+15551234567","api_id":"12345","api_hash":"abc123def456"}' > /dev/null
  local pre_state
  pre_state=$(get /auth/state | jq -r '.status')

  print_test "Reset clears AwaitingCode state"
  local body
  body=$(post /auth/reset-authorization '{}')
  assert_true "success is true"               "$body" ".success"

  local state_body
  state_body=$(get /auth/state)
  assert_eq   "status is LoggedOut after reset" "$state_body" ".status" "LoggedOut"

  print_test "Reset is safe to call when already LoggedOut"
  local body2
  body2=$(post /auth/reset-authorization '{}')
  assert_true "success is true (idempotent)"  "$body2" ".success"
}

# ─── 8. Sign Up (mapped to sign-in handler) ───────────────────────────────────

test_sign_up() {
  print_header "8 · POST /auth/sign-up (maps to sign-in handler)"

  reset_session
  post /auth/send-code '{"phone":"+15559876543","api_id":"99999","api_hash":"xyz987"}' > /dev/null

  print_test "/auth/sign-up with valid code mirrors /auth/sign-in behaviour"
  local body
  body=$(post /auth/sign-up \
    '{"phone":"+15559876543","phone_code_hash":"mock_hash_xyz123","code":"12345"}')
  assert_true "success is true"               "$body" ".success"
  assert_eq   "next_step is 'dashboard'"      "$body" ".next_step" "dashboard"
}

# =============================================================================
# SUMMARY
# =============================================================================

print_summary() {
  local total=$((PASSED + FAILED + SKIPPED))
  echo ""
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "${BOLD}  Test Summary${RESET}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo -e "  Total:   ${BOLD}$total${RESET}"
  echo -e "  ${GREEN}Passed:  $PASSED${RESET}"
  echo -e "  ${RED}Failed:  $FAILED${RESET}"
  echo -e "  ${YELLOW}Skipped: $SKIPPED${RESET}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

  if [[ $FAILED -gt 0 ]]; then
    echo -e "\n  ${RED}${BOLD}✗ Some tests failed.${RESET}"
    exit 1
  else
    echo -e "\n  ${GREEN}${BOLD}✓ All tests passed!${RESET}"
    exit 0
  fi
}

# =============================================================================
# MAIN
# =============================================================================

main() {
  echo ""
  echo -e "${BOLD}Telegramonic — Auth API Test Suite${RESET}"
  echo -e "Server: ${BASE_URL}"

  # Verify jq is installed
  if ! command -v jq &> /dev/null; then
    echo -e "\n${RED}ERROR: 'jq' is required but not installed.${RESET}"
    echo -e "Install it with:  brew install jq  (macOS)  or  apt install jq  (Linux)"
    exit 1
  fi

  check_server

  test_auth_state
  test_send_code
  test_sign_in_happy_path
  test_sign_in_invalid_code
  test_2fa_flow
  test_log_out
  test_reset_authorization
  test_sign_up

  print_summary
}

main "$@"
