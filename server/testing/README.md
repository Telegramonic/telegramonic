# server/testing

Test scripts for the Telegramonic Rust backend server. All scripts target the server's HTTP REST API and are designed to run against the **mock mode** server (no real Telegram credentials needed).

---

## Prerequisites

| Tool   | Purpose                   | Install                              |
| ------ | ------------------------- | ------------------------------------ |
| `curl` | HTTP requests             | pre-installed on macOS/Linux         |
| `jq`   | JSON parsing & assertions | `brew install jq` / `apt install jq` |

---

## Scripts

### `test_auth.sh` — Auth API Test Suite

Tests all seven endpoints under the `/auth` namespace:

| Endpoint                    | Method | What's tested                                   |
| --------------------------- | ------ | ----------------------------------------------- |
| `/auth/state`               | `GET`  | Initial `LoggedOut` state                       |
| `/auth/send-code`           | `POST` | Valid phone, empty phone, non-integer `api_id`  |
| `/auth/sign-in`             | `POST` | Code `12345`, code `11111`, wrong code          |
| `/auth/sign-up`             | `POST` | Maps to sign-in handler, same assertions        |
| `/auth/check-password`      | `POST` | Correct 2FA password, wrong password            |
| `/auth/log-out`             | `POST` | Active session, already logged out (idempotent) |
| `/auth/reset-authorization` | `POST` | Mid-flow reset, already LoggedOut (idempotent)  |

**Mock cheat-sheet** (accepted values in mock mode):

| Input                          | Effect                                      |
| ------------------------------ | ------------------------------------------- |
| Any non-empty phone            | Succeeds, transitions to `AwaitingCode`     |
| Code `12345` or `11111`        | Direct login → `LoggedIn`                   |
| Code `2fa` or `22222`          | Triggers 2FA → `AwaitingPassword`           |
| Password `password` or `admin` | Completes 2FA → `LoggedIn`                  |
| Any other code / password      | Returns `success: false` with error message |

---

## Usage

### 1. Start the server (mock mode, no credentials required)

```bash
cd server/
cargo run
```

The server starts on `http://127.0.0.1:8080` by default.

### 2. Run the auth test suite

```bash
# From the project root
bash server/testing/test_auth.sh

# Or make it executable and run directly
chmod +x server/testing/test_auth.sh
./server/testing/test_auth.sh
```

### 3. Override the server URL

```bash
BASE_URL=http://localhost:9090 ./server/testing/test_auth.sh
```

---

## Output

```
Telegramonic — Auth API Test Suite
Server: http://127.0.0.1:8080

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1 · GET /auth/state
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ TEST: Returns LoggedOut status after reset
  ✓ PASS  status is LoggedOut (got: "LoggedOut")

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total:   22
  Passed:  22
  Failed:  0
  Skipped: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✓ All tests passed!
```

Exit code `0` on all pass, `1` if any test fails.

---

## Adding New Tests

Each test group is a plain bash function following this pattern:

```bash
test_my_feature() {
  print_header "N · Description"

  reset_session  # always start clean

  print_test "What this specific assertion checks"
  local body
  body=$(post /auth/some-endpoint '{"key":"value"}')
  assert_true  "success flag"   "$body" ".success"
  assert_eq    "field value"    "$body" ".some_field" "expected_value"
}
```

Then call `test_my_feature` from the `main()` function.
