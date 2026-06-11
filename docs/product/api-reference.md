# API Gateway Reference

The Telegramonic Rust/Axum server exposes a local HTTP REST and SSE gateway on port `50065`. All requests and responses utilize JSON formats, with large 64-bit integer IDs serialized as strings to prevent precision loss in client-side Javascript.

---

## 🔑 Authentication Endpoints

### 1. Get Authentication State

Returns the current MTProto session state of the local client connection.

- **HTTP Method**: `GET`
- **Path**: `/auth/state`
- **Authentication Required**: No
- **Sample Responses**:
  ```json
  { "status": "LoggedOut" }
  ```
  ```json
  {
    "status": "AwaitingCode",
    "data": { "phone": "+15550199", "phone_code_hash": "a5c7f8..." }
  }
  ```
  ```json
  { "status": "LoggedIn" }
  ```

### 2. Request OTP Code

Requests a 5-digit verification code from Telegram.

- **HTTP Method**: `POST`
- **Path**: `/auth/send-code`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "phone": "+15550199",
    "api_id": "28123456",
    "api_hash": "d58a9ecd4e3f..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "next_step": "code"
  }
  ```

### 3. Verify OTP Code

Submits the verification code received via Telegram.

- **HTTP Method**: `POST`
- **Path**: `/auth/sign-in`
- **Authentication Required**: No
- **Request Body**:
  ```json
  {
    "phone": "+15550199",
    "phone_code_hash": "a5c7f8...",
    "code": "12345"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "next_step": "dashboard"
  }
  ```
  _Note: Returns `next_step: "password"` if Two-Factor Authentication (2FA) is active._

---

## 📂 Custom Drive Endpoints

### 1. List custom drives

Returns Telegram channels associated with the account that represent mounted cloud drives.

- **HTTP Method**: `GET`
- **Path**: `/drive/list`
- **Authentication Required**: Yes
- **Response**:
  ```json
  [
    {
      "chat_id": "-1002812345678",
      "name": "Design Assets",
      "icon": null
    }
  ]
  ```

### 2. Get storage statistics

Computes overall folder, file, and storage capacity metrics.

- **HTTP Method**: `GET`
- **Path**: `/drive/stats`
- **Authentication Required**: Yes
- **Response**:
  ```json
  {
    "total_space": 10995116277760,
    "used_space": 104857600,
    "file_count": 12,
    "folder_count": 3
  }
  ```
  _Note: `total_space` is simulated at a fixed 10 TB capacity._

---

## 💾 File Transfer Endpoints

### 1. Upload Binary Chunk

Buffers a raw file block segment on the server.

- **HTTP Method**: `POST`
- **Path**: `/files/upload-part?file_id=<id>&part_index=<index>`
- **Headers**: `Content-Type: application/octet-stream`
- **Authentication Required**: Yes
- **Response**:
  ```json
  { "success": true }
  ```

### 2. Finalize and Save File

Assembles all buffered chunks and transmits the resulting media document to a target drive (Telegram channel).

- **HTTP Method**: `POST`
- **Path**: `/files/save-file`
- **Authentication Required**: Yes
- **Request Body**:
  ```json
  {
    "file_id": "9876543210",
    "name": "mockup_v1.png",
    "size": 2097152,
    "folder_id": "-1002812345678"
  }
  ```
- **Response**:
  ```json
  {
    "id": "184029104",
    "folder_id": "-1002812345678",
    "name": "mockup_v1.png",
    "size": 2097152,
    "mime_type": "image/png",
    "file_ext": "png",
    "created_at": "2026-06-08T20:20:00Z",
    "icon_type": "presentation",
    "telegram_message_id": 42
  }
  ```

### 3. Stream Download Bytes

Downloads file bytes from Telegram and pipes them directly to the client.

- **HTTP Method**: `GET`
- **Path**: `/files/download?file_id=<id>`
- **Authentication Required**: Yes
- **Response Headers**: `Content-Type: application/octet-stream`
- **Response**: Raw binary stream.
