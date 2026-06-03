# Telegramonic Rust Server (`server/`)

This is a highly reliable, robust, and asynchronous Rust backend application built with **Axum** and **Tokio**. It exposes HTTP REST endpoints that represent Telegram MTProto actions, acting as a gateway/bridge for the client-side React web application.

## Core Features

- **MTProto Real Mode**: Uses the async **Grammers** library to establish binary MTProto TCP connections to official Telegram Data Centers (DCs).
- **CORS Support**: Permissive headers configuration enabling smooth communication with the React frontend server.
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

To build and start the server in Real Mode, you **must** supply your Telegram Developer API ID and API Hash:

```bash
# Navigate to the server folder
cd server

# Run the server with credentials
TELEGRAM_API_ID=<your_id> TELEGRAM_API_HASH=<your_hash> cargo run
```

Get your credentials at [my.telegram.org/apps](https://my.telegram.org/apps).

### 3. Environment Variables

You can configure the server using environment variables or a `.env` file in the `server/` directory:

| Environment Variable | Description                                                     | Default     |
| :------------------- | :-------------------------------------------------------------- | :---------- |
| `PORT`               | Listening port for the HTTP server                              | `8080`      |
| `HOST`               | Bind address                                                    | `127.0.0.1` |
| `TELEGRAM_API_ID`    | Your Telegram Developer API ID (Mandatory)                     | _None_      |
| `TELEGRAM_API_HASH`  | Your Telegram Developer API Hash (Mandatory)                   | _None_      |

---

## 🛠️ API Endpoints

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
- `GET /drive/stats` - Retrieves storage statistics (used vs total cap).
- `GET /drive/folders` - Lists directory folders (`parent_id` parameter supported).
- `GET /drive/files` - Lists directory files (`folder_id` and search parameter `q` supported).
- `POST /drive/folders/create` - Creates folder.
- `POST /drive/folders/delete` - Deletes folder.

#### Chunked Files Transfer:

- `POST /files/upload-part` - Uploads raw binary file chunks.
- `POST /files/save-file` - Registers uploaded chunks into file registry metadata.
- `GET /files/download` - Downloads file byte contents.
