# apps/server/testing

Test scripts and tools for the Telegramonic Rust backend server.

---

## Prerequisites

| Tool   | Purpose                   | Install                              |
| ------ | ------------------------- | ------------------------------------ |
| `curl` | HTTP requests             | pre-installed on macOS/Linux         |
| `jq`   | JSON parsing & assertions | `brew install jq` / `apt install jq` |

---

## Scripts & Testing Tools

## 1. Interactive Integration Testing (`test_real_api.sh`)

Since the server runs exclusively in **Real Mode** using official MTProto connections, this script helps you test the active API endpoints interactively by prompting for real SMS codes, phone numbers, and optional 2FA passwords.

#### Usage:

1. **Start the server**:
   ```bash
   cargo run
   ```
2. **Run the interactive test**:
   ```bash
   # From the project root
   ./apps/server/testing/test_real_api.sh
   ```

---

## 2. Unit & Integration Tests (`cargo test`)

Unit and integration tests for route handlers run completely in-memory using localized test stubs without contacting any external Telegram networks.

To run tests:
```bash
cd apps/server/
cargo test
```
