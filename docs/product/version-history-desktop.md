# Desktop Version History

This document tracks release updates, major features, optimizations, and bug fixes for the Telegramonic Desktop application and Rust Backend server.

---

## [v0.3.0] - Current Release

- **Desktop Version**: `0.3.0`
- **Server Version**: `0.1.0`

### 🌟 New Features

- **Production Release**: Production release bump to `v0.3.0`.

---

## [v0.2.1]

- **Desktop Version**: `0.2.1`
- **Server Version**: `0.1.1`

### 🌟 New Features

- **Profile Credentials Verification Flow**: Added a multi-step confirmation and verification dialog flow (OTP/2FA password prompts) inside the Profile tab for updating Telegram API credentials.
- **Profile Layout & Responsiveness Refinements**: Refactored the Profile screen with glassmorphic cards and stack scaling. Replaced standard inputs with unified Chakra UI components and enabled auto-truncation for user details on smaller screens.
- **Unchanged Fields Validation**: Dynamically disabled the Save Credentials button until the API ID or API Hash fields differ from the active profile.
- **Cloud Storage Gauges Removal**: Removed the unnecessary Cloud Storage Usage section to optimize screen space.

### 🐛 Bug Fixes

- **Auto-Logout & Session Invalidation Prevention**: Introduced an asynchronous temporary client context during credential updates. This allows the primary session to remain active and fully operational during code verification, preventing forced logouts on concurrent background queries.
- **Session Revocation on Telegram Servers**: Implemented automatic sign-out of the old Telegram session key upon successful credentials verification to clean up active devices.
- **AUTH_RESTART RPC Resolution**: Purged cached session files before requesting verification codes to resolve MTProto connection restarts.

---

## [v0.2.0]

- **Desktop Version**: `0.2.0`
- **Server Version**: `0.1.0`

### 🌟 New Features

- **Mermaid Diagram Support**: Integrated ESM-based Mermaid rendering support for markdown blocks (`language-mermaid`) within the Markdown Preview components, natively adjusting styles to dark/light themes.
- **Layout & Typographical Visibility**: Enabled overflow-visible properties on SVG containers, foreignObjects, and node labels to prevent clipping. Refactored container size calculations with unified 16px typography.
- **Media & Image Showcase**: Added preview screenshots demonstrating the application interface in action under the Showcase section in project README documents.

---

## [v0.1.3]

- **Desktop Version**: `0.1.3`
- **Server Version**: `0.1.0`

### 🌟 New Features

- **Dynamic File Icons**: Added system-wide support for custom-rendered file icons mapping specific formats (`AudioIcon`, `CodeIcon`, `CsvIcon`, `PresentationIcon`).
- **Upload Cancellation**: Enabled client-side cancellation triggers that communicate with the server backend to abort ongoing chunk uploads.
- **Filename Constraints**: Enforced name length boundaries and special character validation checks prior to starting file transfers to prevent storage issues.

### 📝 Documentation

- Standardized monorepo README templates across all workspaces (`desktop`, `server`, `web`).
- Separated the Web static marketing portal documentation from the Electron desktop storage client references.

---

## [v0.1.2]

### 🌟 New Features

- **Saved Accounts Portal**: Integrated a "Saved Accounts" selection step into the onboarding wizard, allowing users to log in directly using local session profiles.
- **Direct-to-Disk Transfers**: Bypassed Chromium's buffer stream for downloads on desktop. Added native OS `dialog.showSaveDialog` intercepts piping responses straight to disk files to avoid leaving quarantine tmp files (e.g. `.com.github.Electron.xxxxx`) on macOS.
- **Real-time Progress Streaming**: Added Server-Sent Events (SSE) support to the backend (`/files/upload-progress/stream`) and connected it to the client progress bar.

### 🐛 Bug Fixes

- Fixed a critical memory leak caused by temporary file descriptors remaining open after download failure.
- Fixed string-serialization format mismatches for 64-bit user/channel IDs causing Javascript precision errors.

---

## [v0.1.1]

### 🌟 New Features

- **MacOS Borderless Layout**: Configured frameless Electron setups on macOS (`titleBarStyle: 'hidden'`) integrating windows buttons naturally into the design canvas.
- **Dynamic Theme Sync**: Standardized dark-default displays which automatically adapt to preferences specified in system parameters (`prefers-color-scheme`).
- **Multi-Platform Installers**: Configured `electron-builder` release pipelines to package cross-platform installer binaries (`dmg`, `zip`, `nsis`, `deb`, `AppImage`).

---

## [v0.1.0]

- Initial release of the Telegramonic Cloud Storage Monorepo prototype.
- Implemented Axum HTTP API Gateway communicating with Telegram MTProto Data Centers via the async `grammers` Rust client.
- Created a 4-step secure configuration wizard (Phone Number, API Credentials, OTP verification, Dashboard loader).
- Added core file explorer layouts supporting grid/list lists, drive mounting (Telegram channels), and folders navigation.
