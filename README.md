# Telegramonic

Telegramonic is a high-performance, minimalist cloud storage solution designed for digital craftsmen, developers, and tech professionals.

This project is a modernized React application focused on providing a fast, secure, and ergonomic workspace for managing and organizing digital assets.

## Core Technology Stack

- **Framework**: [React 18+](https://reactjs.org/)
- **UI Library**: [Chakra UI v3](https://chakra-ui.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/) + [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [TanStack Form v1](https://tanstack.com/form/latest)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Panda CSS](https://panda-css.com/) (Chakra UI v3 underlying engine)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
- **Backend**: [Rust](https://www.rust-lang.org/) via [Axum](https://github.com/tokio-rs/axum) (HTTP bridge to Telegram MTProto)
- **Desktop Shell**: [Electron](https://www.electronjs.org/)
- **Package Manager**: [Yarn 4.x (Berry)](https://yarnpkg.com/)

## Architecture Overview

The monorepo is organized into four workspaces:

```
telegramonic/
├── common/          # Shared utilities (design tokens, icons, translations, test utils)
├── desktop/         # Electron desktop app containing core file management and login
│   ├── main.js      # Electron main entry script (frameless, 80% screen dimensions)
│   ├── preload.js   # Secure API/diagnostics bridge
│   └── src/
│       ├── components/         # Desktop-specific components (Icon, Logo)
│       ├── providers/          # App-level providers (Chakra, Router, Query, Modal)
│       ├── routes/             # Desktop routing and lazy-loaded screens
│       ├── screens/
│       │   ├── dashboard/      # Decomposed file explorer UI
│       │   └── loginPage/      # Multi-step login flow wizard
│       ├── services/
│       │   ├── apiClient.ts    # HTTP client for Rust server (port 50065)
│       │   ├── hooks.ts        # TanStack Query custom hooks for backend integration
│       │   ├── types.ts        # API type definitions
│       │   └── const.ts        # API routes constants
│       └── store/              # Zustand stores (app credentials, UI modals)
├── web/             # React web application (marketing portal, download page, docs viewer)
│   └── src/
│       ├── providers/          # UI-level providers (Theme, Localization, Query)
│       ├── routes/             # Routing and lazy-loaded screen paths
│       └── screens/
│           ├── landingPage/    # Main landing and OS-detection download screen
│           ├── DocsPage/       # Documentation viewer with sidebar navigation
│           └── MdPage/         # Legal page renderer (privacy, terms, disclaimer)
└── server/          # Rust/Axum HTTP server (MTProto gateway, default port: 50065)
```

## Design System

The application utilizes a custom **Modern Corporate / Utility Minimalism** design system powered by **Inter**:

- **Branding**: Telegram Blue (`#0088CC`) as primary accent, Deep Charcoal (`#212529`) for typography.
- **Surfaces**: Tiered neutral system with soft gray background (`#F8F9FA`) and pure white container cards (`#FFFFFF`) defined by thin borders (`#E9ECEF`).
- **Shapes**: Rounded element edges with 8px radius for controls and 16px radius for large modals/panels.
- **Dark Mode**: Full dark mode support with system preference detection.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Yarn 4.x
- Rust toolchain (for server development)

### Installation

```bash
yarn install
```

### Development

```bash
# Run Electron desktop app (React UI)
yarn desktop:start

# Run Rust server backend (required for API calls)
yarn server:start

# Run web React application (browser-only mode)
yarn web:start
```

> The desktop app connects to the Rust server at **`http://localhost:50065`**. Start the server before using the app.

### Build

```bash
# Build web React application
yarn web:build

# Build Rust server backend
yarn server:build

# Build and package Electron desktop application
yarn desktop:dist:mac          # Generate macOS installer packages (DMG & Zip)
yarn desktop:dist:win          # Generate Windows installer packages (NSIS & Zip)
yarn desktop:dist:linux        # Generate Linux packages (deb & AppImage)
yarn desktop:dist:all          # Package for all desktop platforms concurrently

# Build React UI for both web and desktop components together
yarn build:all

# Package React UI and desktop apps for all targets together
yarn dist:all
```

### Testing

```bash
# Run Jest unit tests for the desktop app
yarn desktop:test

# Run Jest tests for web
yarn web:test

# Run Jest tests specifically for common workspace
yarn common:test

# Run Cargo tests for Rust server
yarn server:test

# Run tests with coverage for web
yarn workspace telegramonic-web test:cov

# Open Cypress for E2E testing
yarn workspace telegramonic-web cy:open

# Run tests on staged git changes (pre-commit)
yarn run-staged-tests

# Run tests on committed/pushed git changes (CI)
yarn run-pushed-files-tests
```

#### Test Structure

Tests are co-located with their source in `__tests__/` folders:

| Folder | What's tested |
|---|---|
| `screens/dashboard/__tests__/` | `Dashboard` integration test |
| `screens/dashboard/components/__tests__/` | `TopNavBar`, `SideNavBar`, `Breadcrumbs`, `FilesTable`, `SuggestedSection`, `UploadProgressBanner`, `const` helpers |
| `screens/loginPage/__tests__/` | `LoginPage` flow, `COUNTRIES` constant |
| `services/` | `apiClient`, `hooks` |
| `store/app/`, `store/ui/` | Zustand selectors and slices |
| `providers/` | Each provider wrapper |

### Linting & Formatting

```bash
# Run ESLint for web
yarn workspace telegramonic-web lint

# Format code with Prettier
yarn workspace telegramonic-web run prettier:write
```

## Login Flow

The desktop login is a 4-step wizard:

1. **Phone Number** — Enter your phone with country code selector (defaults to India +91)
2. **API Credentials** — Enter your Telegram `api_id` and `api_hash` from [my.telegram.org](https://my.telegram.org)
3. **OTP Verification** — Enter the 5-digit code sent to your Telegram account
4. **Success** — 3-second animation then redirect to the Dashboard

A back button (icon) allows returning to the previous step from steps 2 and 3.

## Native File Downloads & Temporary File Fix

In the desktop Electron shell, downloads bypass Chromium's default download manager. This resolves issues where temporary quarantine files (e.g., `.com.github.Electron.xxxxx`) were left behind in the Downloads directory.

1. **Secure IPC Stream**: When a download is requested, the renderer calls the main process via `ipcRenderer.invoke('download-file-directly')`.
2. **Native Save Dialog**: The main process displays a native `showSaveDialog` letting the user choose the target save path.
3. **Streaming to Disk**: The file is streamed chunk-by-chunk from the local Axum server directly to the disk write stream, preventing memory leaks and high memory usage.
4. **Error Cleanup**: If a download fails or is canceled midway, the partial file is automatically deleted.
5. **Web Fallback**: Standard `URL.createObjectURL(blob)` and simulated click downloads remain active in standard web browser contexts.

## Infrastructure

- **CI/CD**: GitHub Actions for automated building, linting, testing, and FTP deployment.
- **Localization**: Internationalization support via `i18next`.
- **Theme**: Robust dark/light mode support with system preference detection and Telegramonic design tokens.
- **Server Health**: TanStack Query polls `/health` every 5 seconds; the title bar reflects connectivity status.
- **Caching**: All API requests are cached via TanStack Query with configurable `staleTime` to prevent server flooding.
