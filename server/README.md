# Telegramonic Rust Server (`server/`)

This is a highly reliable, robust, and asynchronous Rust backend application built with **Axum** and **Tokio**. It exposes HTTP REST endpoints that represent Telegram MTProto actions, acting as a gateway/bridge for the client-side React web application.

## Core Features

- **Dual-Mode Architecture**:
  - **Mock Mode (Default/Fallback)**: In-memory simulation of Telegram sessions, folder/file storage management, and a complete multi-step login state machine (requires no Telegram API credentials).
  - **Real Mode**: Uses the async **Grammers** library to establish binary MTProto TCP connections to official Telegram Data Centers (DCs).
- **CORS Support**: Permissive headers configuration enabling smooth local communication with the React frontend server.
- **Structured Tracing**: Uses `tracing-subscriber` for clean, structured console outputs.

---

## 🚀 Getting Started

### 1. Install Rust

If Rust is not yet installed on your system, you can install it using `rustup`:

```bash
# On macOS or Linux:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

_After installation, restart your shell or run `source $HOME/.cargo/env` to add Cargo to your PATH._

### 2. Run the Server

By default, the server runs in **Mock Mode** on `127.0.0.1:8080`.

To build and start the server:

```bash
# Navigate to the server folder
cd server

# Run the server
cargo run
```

### 3. Environment Variables

You can configure the server using environment variables or a `.env` file in the `server/` directory:

| Environment Variable | Description                                                          | Default     |
| :------------------- | :------------------------------------------------------------------- | :---------- |
| `PORT`               | Listening port for the HTTP server                                   | `8080`      |
| `HOST`               | Bind address                                                         | `127.0.0.1` |
| `MOCK_MODE`          | Set to `true` to run simulation; `false` to connect to real Telegram | `true`      |
| `TELEGRAM_API_ID`    | Your Telegram Developer API ID (required if `MOCK_MODE=false`)       | _None_      |
| `TELEGRAM_API_HASH`  | Your Telegram Developer API Hash (required if `MOCK_MODE=false`)     | _None_      |

---

## 🛠️ API Endpoints & Testing in Mock Mode

When running in **Mock Mode**, you can simulate the full MTProto login flow using these predefined inputs:

### Authentication State Machine

- **Phase 1: Phone Validation (`/auth/send-code`)**:
  - Submitting any phone number transitions the server state to `AwaitingCode`.
- **Phase 2: Code verification (`/auth/sign-in`)**:
  - Submitting the code **`12345`** transitions the state directly to `LoggedIn` (success).
  - Submitting the code **`2fa`** transitions the state to `AwaitingPassword` (simulates active Two-Step verification).
  - Submitting any other code returns a `400 Bad Request` auth error.
- **Phase 3: 2FA Password validation (`/auth/check-password`)**:
  - Submitting the password **`password`** transitions the state to `LoggedIn` (success).

### Endpoint Index (Matches Frontend Constants)

#### Auth Route Handlers:

- `GET /auth/state` - Queries current authentication state (LoggedOut, AwaitingCode, AwaitingPassword, LoggedIn).
- `POST /auth/send-code` - Requests an auth code.
- `POST /auth/sign-in` / `POST /auth/sign-up` - Submits code to verify.
- `POST /auth/check-password` - Verifies 2FA password.
- `POST /auth/log-out` - Signs out and clears session.
- `POST /auth/reset-authorization` - Clears active connection states.

#### User/Account Settings Handlers:

- `GET /users/me` - Retrieves profile of authenticated account.
- `GET /users/get-users` - Gets contacts.
- `POST /account/update-profile` - Edits profile names.
- `POST /account/update-status` - Toggles online/offline status.
- `POST /account/update-username` - Edits username.
- `GET /account/get-password` - Checks 2FA password settings.

#### Drive Files Explorer Handlers:

- `GET /drive/list` - Lists channels representing drives.
- `GET /drive/stats` - Retrives storage statistics (used vs total cap).
- `GET /drive/folders` - Lists directory folders (`parent_id` parameter supported).
- `GET /drive/files` - Lists directory files (`folder_id` and search parameter `q` supported).
- `POST /drive/folders/create` - Creates folder.
- `POST /drive/folders/delete` - Deletes folder.

#### Chunked Files Transfer:

- `POST /files/upload-part` - Uploads raw binary file chunks.
- `POST /files/save-file` - Registers uploaded chunks into file registry metadata.
- `GET /files/download` - Downloads file byte contents.
