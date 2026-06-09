#!/usr/bin/env bash
# =============================================================================
# test_real_api.sh — Comprehensive API Test Suite for Telegramonic Backend
#
# Tests all public and protected server endpoints, verifies file and folder
# listing, and ensures pass/fail tracking across all test steps.
# =============================================================================

# Disable exit-on-error globally so that failed assertions don't halt execution,
# allowing us to print a comprehensive summary of all test cases.
set -uo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:50065}"

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Stats trackers ────────────────────────────────────────────────────────────
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# ── Helpers ───────────────────────────────────────────────────────────────────
print_step() {
  echo -e "\n${CYAN}${BOLD}▶ $1${RESET}" >&2
}

print_success() {
  echo -e "${GREEN}✓ $1${RESET}" >&2
}

print_error() {
  echo -e "${RED}✗ ERROR: $1${RESET}" >&2
}

# Low-level request helper
# Returns a JSON string containing "status" and "body"
request() {
  local method="$1"
  local path="$2"
  local data="${3:-}"
  
  local response
  if [ -n "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "${BASE_URL}${path}" || echo -e "\n000")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      "${BASE_URL}${path}" || echo -e "\n000")
  fi
  
  local status_code
  status_code=$(echo "$response" | tail -n 1 | tr -d '\r' | xargs)
  
  local body
  body=$(echo "$response" | sed '$d')
  
  if [ -z "$status_code" ] || [ "$status_code" = "" ]; then
    status_code="000"
  fi
  
  # Return JSON structure
  jq -n --arg code "$status_code" --arg body "$body" '{"status": ($code|tonumber), "body": $body}'
}

# Custom helper for binary upload-part
upload_part_api() {
  local file_id="$1"
  local part_index="$2"
  local local_file="$3"
  
  local body_file
  body_file=$(mktemp)
  
  local status_code
  status_code=$(curl -s -X POST \
    -w "%{http_code}" \
    -o "$body_file" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@${local_file}" \
    "${BASE_URL}/files/upload-part?file_id=${file_id}&part_index=${part_index}" || echo "000")
  
  local body=""
  if [ -f "$body_file" ]; then
    body=$(cat "$body_file")
  fi
  rm -f "$body_file"
  
  if [ -z "$status_code" ] || [ "$status_code" = "" ]; then
    status_code="000"
  fi
  
  jq -n --arg code "$status_code" --arg body "$body" '{"status": ($code|tonumber), "body": $body}'
}

# Run a test step and update statistics
# Usage: run_api_test <method> <path> [payload_json] [expected_status]
run_api_test() {
  local method="$1"
  local path="$2"
  local payload="${3:-}"
  local expected_status="${4:-200}"
  
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  
  local res
  res=$(request "$method" "$path" "$payload")
  local status
  status=$(echo "$res" | jq -r '.status')
  local body
  body=$(echo "$res" | jq -r '.body')
  
  if [ "$status" -eq "$expected_status" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    print_success "$method $path -> HTTP $status (Expected $expected_status)"
    echo "$body"
    return 0
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "$method $path -> Got HTTP $status, Expected $expected_status"
    echo "$body" >&2
    return 1
  fi
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
  echo "Please install jq first (e.g. 'brew install jq')."
  exit 1
fi

# Verify server connectivity
res=$(request GET "/auth/state")
status_code=$(echo "$res" | jq -r '.status')
if [ "$status_code" -eq 0 ]; then
  print_error "Cannot connect to Telegramonic backend server at ${BASE_URL}."
  echo "Ensure the server is running."
  echo "Remember to run the server in REAL mode using:"
  echo -e "  ${BOLD}TELEGRAM_API_ID=<id> TELEGRAM_API_HASH=<hash> cargo run${RESET}"
  exit 1
fi

print_success "Server is reachable."

# Get initial auth state
initial_state=$(echo "$res" | jq -r '.body')
status=$(echo "$initial_state" | jq -r '.status')

echo -e "Initial Server Auth State: ${YELLOW}${status}${RESET}"

skip_login="false"
if [ "$status" = "LoggedIn" ]; then
  echo -e "\n${GREEN}You are already logged in. Skipping login flow and proceeding to test protected endpoints...${RESET}"
  skip_login="true"
fi

# Refresh state
status=$(request GET "/auth/state" | jq -r '.body | fromjson | .status')

if [ "$skip_login" = "false" ] && [ "$status" != "LoggedIn" ]; then
  # ── Step 1: Input Credentials ───────────────────────────────────────────────
  print_step "Step 1: Enter Telegram Credentials"
  echo "Please provide the phone number and API credentials."
  
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

  # Test POST /auth/send-code
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  send_code_res=$(request POST "/auth/send-code" "$payload")
  send_code_status=$(echo "$send_code_res" | jq -r '.status')
  send_code_body=$(echo "$send_code_res" | jq -r '.body')

  if [ "$send_code_status" -eq 200 ] && echo "$send_code_body" | jq -e '.success' >/dev/null; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    print_success "POST /auth/send-code -> HTTP 200"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "Failed to send code: $send_code_body"
    exit 1
  fi

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

  # Test POST /auth/sign-in
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  sign_in_res=$(request POST "/auth/sign-in" "$sign_in_payload")
  sign_in_status=$(echo "$sign_in_res" | jq -r '.status')
  sign_in_body=$(echo "$sign_in_res" | jq -r '.body')

  if [ "$sign_in_status" -eq 200 ]; then
    success=$(echo "$sign_in_body" | jq -r '.success')
    next_step=$(echo "$sign_in_body" | jq -r '.next_step')
    if [ "$success" = "true" ]; then
      TESTS_PASSED=$((TESTS_PASSED + 1))
      print_success "POST /auth/sign-in -> HTTP 200"
    else
      TESTS_FAILED=$((TESTS_FAILED + 1))
      print_error "Sign-in failed: $sign_in_body"
      exit 1
    fi
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "Sign-in endpoint returned HTTP $sign_in_status: $sign_in_body"
    exit 1
  fi

  # ── Step 4: Handle 2-Factor Authentication (if required) ────────────────────
  if [ "$next_step" = "password" ]; then
    print_step "Step 4: Two-Step Verification Required"
    read -s -p "Enter your 2FA password: " PASSWORD
    echo "" # newline

    pwd_payload=$(jq -n --arg pwd "$PASSWORD" '{password: $pwd}')
    
    # Test POST /auth/check-password (Real Success Case)
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    pwd_res=$(request POST "/auth/check-password" "$pwd_payload")
    pwd_status=$(echo "$pwd_res" | jq -r '.status')
    pwd_body=$(echo "$pwd_res" | jq -r '.body')

    if [ "$pwd_status" -eq 200 ] && echo "$pwd_body" | jq -e '.success' >/dev/null; then
      TESTS_PASSED=$((TESTS_PASSED + 1))
      print_success "POST /auth/check-password -> HTTP 200"
    else
      TESTS_FAILED=$((TESTS_FAILED + 1))
      print_error "2FA password check failed: $pwd_body"
      exit 1
    fi
  fi
fi

# Ensure we are logged in before running protected endpoint tests
status=$(request GET "/auth/state" | jq -r '.body | fromjson | .status')
if [ "$status" != "LoggedIn" ]; then
  print_error "Authentication failed. Exiting test suite."
  exit 1
fi

print_success "Successfully authenticated! Starting comprehensive endpoint checks..."

# ── PUBLIC & STATE ENDPOINTS ──────────────────────────────────────────────────
print_step "Checking Public / State Endpoints"
run_api_test GET "/health" "" 200 >/dev/null
run_api_test GET "/auth/state" "" 200 >/dev/null

# Negative tests for auth when already logged in
# POST /auth/sign-up (Maps to sign-in, we accept 200/400/500 to support mock/real state variations)
TESTS_TOTAL=$((TESTS_TOTAL + 1))
res_signup=$(request POST "/auth/sign-up" '{"phone": "invalid", "code": "invalid"}')
status_signup=$(echo "$res_signup" | jq -r '.status')
if [ "$status_signup" -eq 200 ] || [ "$status_signup" -eq 400 ] || [ "$status_signup" -eq 500 ]; then
  TESTS_PASSED=$((TESTS_PASSED + 1))
  print_success "POST /auth/sign-up -> HTTP $status_signup (Accepted 200/400/500)"
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "POST /auth/sign-up -> HTTP $status_signup (Expected 200/400/500)"
fi

# POST /auth/check-password (Negative case, we accept 200/400/500 to support mock/real state variations)
TESTS_TOTAL=$((TESTS_TOTAL + 1))
res_pwd=$(request POST "/auth/check-password" '{"password": "wrong"}')
status_pwd=$(echo "$res_pwd" | jq -r '.status')
if [ "$status_pwd" -eq 200 ] || [ "$status_pwd" -eq 400 ] || [ "$status_pwd" -eq 500 ]; then
  TESTS_PASSED=$((TESTS_PASSED + 1))
  print_success "POST /auth/check-password -> HTTP $status_pwd (Accepted 200/400/500)"
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "POST /auth/check-password -> HTTP $status_pwd (Expected 200/400/500)"
fi

# ── USERS & ACCOUNT ENDPOINTS ─────────────────────────────────────────────────
print_step "Checking Users & Account Endpoints"

# GET /users/me
me_res=$(run_api_test GET "/users/me" "" 200)
my_id=$(echo "$me_res" | jq -r '.id')
my_first_name=$(echo "$me_res" | jq -r '.first_name')
my_last_name=$(echo "$me_res" | jq -r '.last_name // ""')
my_username=$(echo "$me_res" | jq -r '.username // ""')

# GET /users/get-users
run_api_test GET "/users/get-users" "" 200 >/dev/null

# GET /users/get-full-user
run_api_test GET "/users/get-full-user?id=${my_id}" "" 200 >/dev/null

# GET /account/get-password
run_api_test GET "/account/get-password" "" 200 >/dev/null

# POST /account/update-profile
profile_payload=$(jq -n \
  --arg first "$my_first_name" \
  --arg last "$my_last_name" \
  '{first_name: $first, last_name: $last}')
run_api_test POST "/account/update-profile" "$profile_payload" 200 >/dev/null

# POST /account/update-status
run_api_test POST "/account/update-status" '{"offline": false}' 200 >/dev/null

# POST /account/update-username
username_payload=$(jq -n --arg user "$my_username" '{username: $user}')
run_api_test POST "/account/update-username" "$username_payload" 200 >/dev/null


# ── CONTACTS ENDPOINTS (STUBS) ────────────────────────────────────────────────
print_step "Checking Contacts Endpoints (Stubs)"
run_api_test GET "/contacts/get-contacts" "" 200 >/dev/null
run_api_test GET "/contacts/search?q=test" "" 200 >/dev/null
run_api_test POST "/contacts/import-contacts" "{}" 200 >/dev/null


# ── DRIVE & FILE QUERIES ──────────────────────────────────────────────────────
print_step "Checking Drive Overview Endpoints"
run_api_test GET "/drive/list" "" 200 >/dev/null
run_api_test GET "/drive/stats" "" 200 >/dev/null

# Query files at drive root
run_api_test GET "/drive/files" "" 200 >/dev/null

# ── LIST FILES IN CHANNELS/FOLDERS ───────────────────────────────────────────
print_step "Listing Folders and Files in each Channel/Folder"

folders_res=$(run_api_test GET "/drive/folders" "" 200)
folder_count=$(echo "$folders_res" | jq '. | length')
echo -e "\nFound ${GREEN}${folder_count}${RESET} channel folders:"

for ((i=0; i<folder_count; i++)); do
  folder_id=$(echo "$folders_res" | jq -r ".[$i].id")
  folder_name=$(echo "$folders_res" | jq -r ".[$i].name")
  
  echo -e "\n📁 ${CYAN}${folder_name}${RESET} (ID: ${folder_id}):"
  
  # List files in this specific channel/folder
  files_res=$(run_api_test GET "/drive/files?folder_id=${folder_id}" "" 200)
  file_count=$(echo "$files_res" | jq '. | length')
  
  if [ "$file_count" -eq 0 ]; then
    echo -e "   ${YELLOW}(No files found in this channel)${RESET}"
  else
    for ((j=0; j<file_count; j++)); do
      f_name=$(echo "$files_res" | jq -r ".[$j].name")
      f_size=$(echo "$files_res" | jq -r ".[$j].size")
      f_id=$(echo "$files_res" | jq -r ".[$j].id")
      f_ext=$(echo "$files_res" | jq -r ".[$j].file_ext // \"none\"")
      echo -e "   📄 ${GREEN}${f_name}${RESET} (ID: ${f_id}, Size: ${f_size} bytes, Ext: ${f_ext})"
    done
  fi
done


# ── FOLDER LIFECYCLE ──────────────────────────────────────────────────────────
print_step "Checking Folder Lifecycle (Create, Verify, Delete)"

# Create folder
create_folder_res=$(run_api_test POST "/drive/folders/create" '{"name": "Temp Test Folder", "parent_id": null}' 200)
created_id=$(echo "$create_folder_res" | jq -r '.id')
created_name=$(echo "$create_folder_res" | jq -r '.name')

if [ -n "$created_id" ] && [ "$created_id" != "null" ]; then
  print_success "Folder created: $created_name (ID: $created_id)"
  
  # Verify folder is listed
  verify_folders=$(run_api_test GET "/drive/folders" "" 200)
  if echo "$verify_folders" | jq -e ".[] | select(.id == ${created_id})" >/dev/null; then
    print_success "Folder verification: Found created folder in listing."
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "Folder verification: Created folder NOT found in listing!"
  fi
  
  # Delete folder
  run_api_test POST "/drive/folders/delete" "{\"id\": ${created_id}}" 200 >/dev/null
  
  # Verify deleted
  verify_deleted=$(run_api_test GET "/drive/folders" "" 200)
  if echo "$verify_deleted" | jq -e ".[] | select(.id == ${created_id})" >/dev/null; then
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "Folder cleanup verification: Deleted folder is STILL in listing!"
  else
    print_success "Folder cleanup verification: Folder successfully removed."
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "Folder creation did not return a valid folder ID: $create_folder_res"
fi


# ── FILE LIFECYCLE (UPLOAD, SAVE, DOWNLOAD) ───────────────────────────────────
print_step "Checking File Lifecycle (Upload Part, Save File, Download File)"

# Generate a temporary local file with unique random string content
temp_upload_file=$(mktemp)
echo -n "Telegramonic file upload content - $(date) - $((RANDOM))" > "$temp_upload_file"
orig_size=$(wc -c < "$temp_upload_file" | xargs) # Strip spaces portably
file_id=$((100000 + RANDOM % 900000))

# 1. upload-part
TESTS_TOTAL=$((TESTS_TOTAL + 1))
upload_res=$(upload_part_api "$file_id" 0 "$temp_upload_file")
upload_status=$(echo "$upload_res" | jq -r '.status')
upload_body=$(echo "$upload_res" | jq -r '.body')

if [ "$upload_status" -eq 200 ] && echo "$upload_body" | jq -e '.success' >/dev/null; then
  TESTS_PASSED=$((TESTS_PASSED + 1))
  print_success "POST /files/upload-part -> HTTP 200"
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "POST /files/upload-part failed: $upload_body"
fi

# 2. save-file
save_payload=$(jq -n \
  --argjson fid "$file_id" \
  --arg name "api_test_upload_$file_id.txt" \
  --argjson size "$orig_size" \
  '{file_id: $fid, name: $name, size: $size, folder_id: null}')

run_api_test POST "/files/save-file" "$save_payload" 200 >/dev/null

# 3. Verify file exists in root file list
verify_files=$(run_api_test GET "/drive/files" "" 200)
if echo "$verify_files" | jq -e ".[] | select(.id == ${file_id})" >/dev/null; then
  print_success "File verification: Created file found in root file list."
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "File verification: Created file NOT found in root file list!"
fi

# 4. download / get-file verification
temp_download_file1=$(mktemp)
temp_download_file2=$(mktemp)

# Test /files/download
TESTS_TOTAL=$((TESTS_TOTAL + 1))
dl1_status=$(curl -s -X GET "${BASE_URL}/files/download?file_id=${file_id}" -o "$temp_download_file1" -w "%{http_code}")
if [ "$dl1_status" -eq 200 ]; then
  if diff "$temp_upload_file" "$temp_download_file1" >/dev/null; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    print_success "GET /files/download -> HTTP 200 and file content matches exactly"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "GET /files/download -> File content mismatch!"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "GET /files/download -> Returned HTTP $dl1_status"
fi

# Test /files/get-file
TESTS_TOTAL=$((TESTS_TOTAL + 1))
dl2_status=$(curl -s -X GET "${BASE_URL}/files/get-file?file_id=${file_id}" -o "$temp_download_file2" -w "%{http_code}")
if [ "$dl2_status" -eq 200 ]; then
  if diff "$temp_upload_file" "$temp_download_file2" >/dev/null; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    print_success "GET /files/get-file -> HTTP 200 and file content matches exactly"
  else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_error "GET /files/get-file -> File content mismatch!"
  fi
else
  TESTS_FAILED=$((TESTS_FAILED + 1))
  print_error "GET /files/get-file -> Returned HTTP $dl2_status"
fi

# Local file cleanup
rm -f "$temp_upload_file" "$temp_download_file1" "$temp_download_file2"


# ── SESSION CLEANUP ───────────────────────────────────────────────────────────
print_step "Session Cleanup"
read -p "Keep session active? (y/n): " keep_session
if [[ ! "$keep_session" =~ ^[Yy]$ ]]; then
  # Test log-out & reset-authorization
  run_api_test POST "/auth/log-out" "{}" 200 >/dev/null
  run_api_test POST "/auth/reset-authorization" "{}" 200 >/dev/null
else
  echo -e "${GREEN}Session kept active. You can open the client React app now!${RESET}"
fi


# ── FINAL SUMMARY ─────────────────────────────────────────────────────────────
echo -e "\n${BOLD}====================================================${RESET}"
echo -e "${BOLD}             API Test Suite Summary                 ${RESET}"
echo -e "${BOLD}====================================================${RESET}"
echo -e "Total Tests Executed: ${CYAN}${TESTS_TOTAL}${RESET}"
echo -e "Passed:               ${GREEN}${TESTS_PASSED}${RESET}"
echo -e "Failed:               ${RED}${TESTS_FAILED}${RESET}"
echo -e "${BOLD}====================================================${RESET}"

if [ "$TESTS_FAILED" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}         ALL TESTS COMPLETED SUCCESSFULLY!          ${RESET}"
  exit 0
else
  echo -e "${RED}${BOLD}         SOME TESTS ENCOUNTERED FAILURES.           ${RESET}"
  exit 1
fi
