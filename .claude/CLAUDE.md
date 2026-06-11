# CLAUDE.md

This file provides a high-level entry point for Claude-based tools working in the **Telegramonic** repository.

## Overview

This is a **React Web Application** (using Craco for configuration) and **Axum Rust Server** representing the Telegramonic cloud storage solution.

- **Web Framework**: React 18.3+
- **Styling**: Chakra UI (Inter typography, brand colors) and Tailwind CSS
- **State Management**: Zustand, React Query
- **Backend**: Axum with Tokio runtime and Grammers MTProto client

## 📘 Primary Documentation

For comprehensive technical documentation, architectural decisions, file conventions, and agent-specific skills, always refer to the Agent Guide section:

👉 **[Agent Guide](#AGENT)**

## 💻 Code Style Guidelines

- **React Components**: Avoid using `React.FC` or `React.FunctionComponent` to define functional components. Instead, type props directly in the function arguments: `const MyComponent = ({ prop1 }: Props) => { ... }`.

## Essential Commands

These are the most common commands for development:

```bash
yarn install                   # Install all dependencies across workspaces

# Web App Workspace
yarn web:start                 # Start web local development server
yarn web:dev                   # Start web local development server (alias)
yarn web:build                 # Create production build for web
yarn web:test                  # Run Jest tests for web
yarn workspace telegramonic-web run lint:fix # Run ESLint and fix web issues

# Common UI & Logic Workspace
yarn common:test               # Run Jest tests specifically for common workspace

# Rust Server Workspace
yarn server:start              # Run the Rust server (cargo run)
yarn server:build              # Build the Rust server (cargo build)
yarn server:test               # Test the Rust server (cargo test)

# Desktop App Workspace
yarn desktop:start             # Run the Electron desktop app in development
yarn desktop:build             # Compile the React production bundle for desktop
yarn desktop:dist:mac          # Generate macOS installer packages (DMG & Zip)
yarn desktop:dist:win          # Generate Windows installer packages (NSIS & Zip)
yarn desktop:dist:linux        # Generate Linux packages (deb & AppImage)
yarn desktop:dist:all          # Package for all desktop platforms concurrently

make commit                    # Conventional commit helper
```

## Antigravity Skills

Advanced agent instructions are modularized in the `.claude/skills/` directory.

- [Commit Workflow](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/commit/SKILL.md)
- [Jira Management](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/jira/SKILL.md)
- [Pull Request Skill](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/pr/SKILL.md)
- [Frontend Design](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/frontend-design/SKILL.md)
- [Web Development](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/web/SKILL.md)
- [README Guidelines](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/readme/SKILL.md)

## 🌐 Localization Guidelines

All user-facing copy strings (headings, paragraphs, labels, button texts, tooltips, placeholders, etc.) MUST be defined in the localization JSON files located in `shared/common/src/localization/locales/` (`client.json`, `web.json`, `common.json`, and `error.json` under each locale directory) and retrieved dynamically in code using the `useTranslation` hook (`t('key')`). Never hardcode text strings directly in component files.

Always ensure that any newly added or updated translation keys are copied and synchronized across all supported languages (`en/`, `hi/`, `es/`, `ru/`, `zh/`, `ja/`) to guarantee proper fallback resolution.

## 🧪 Testing Guidelines

Always add or update the unit tests (and their snapshots) to align with the requested feature implementations or changes. Run the test suite using `yarn web:test` or `yarn web:test -u` to verify that all changes are fully covered, correct, and pass successfully.

---

# AGENT

This section serves as the primary source of truth for AI agents working on the **Telegramonic** project. It provides architectural context, directory structures, and established development patterns.

## 1. Project Overview

| Core Stack           | Technology                                                                             |
| :------------------- | :------------------------------------------------------------------------------------- |
| **Framework (Web)**  | [React 18.3+](https://react.dev/)                                                      |
| **Desktop Shell**    | [Electron v31](https://www.electronjs.org/)                                            |
| **Desktop Packager** | [electron-builder](https://www.electron.build/)                                        |
| **UI Library**       | [Chakra UI v3](https://chakra-ui.com/)                                                 |
| **State Management** | [Zustand v5](https://zustand.docs.pmnd.rs/)                                            |
| **Routing**          | [React Router v7](https://reactrouter.com/)                                            |
| **Styling**          | Vanilla CSS + Chakra UI v3 (Panda CSS)                                                 |
| **Language**         | [TypeScript 5.x](https://www.typescriptlang.org/) & [Rust](https://www.rust-lang.org/) |
| **Testing**          | Jest + React Testing Library (v16+) + Cypress                                          |
| **Backend (Server)** | [Axum v0.7](https://github.com/tokio-rs/axum) (Tokio Runtime)                          |
| **Telegram MTProto** | [Grammers v0.7](https://github.com/Lonami/grammers)                                    |
| **Package Manager**  | [Yarn 4 (Berry)](https://yarnpkg.com/)                                                 |
| **Aesthetic**        | Utilitarian Minimalism / Terminal-Luxury                                               |
| **Brand Colors**     | Charcoal (#15111e) & Violet (#8b5cf6)                                                  |

## 2. Design & Product Identity

### Visual Language

- **Theme**: Dark mode by default. High contrast with subtle grain textures and glassmorphic overlays.
- **Typography**: Geist (Sans-serif) for primary UI, Geist Mono for technical data and code.
- **Components**: Crisp border-based separation and interactive micro-animations.

### Resource Taxonomy

The platform organizes resources into 13 primary verticals:

1. **AI & ML** | 2. **Privacy & Adblocking** | 3. **Streaming & Media** | 4. **Gaming & Emulation** | 5. **Education** | 6. **OS Specific (Linux/macOS/Mobile)** | 7. **Miscellaneous**.

## 3. Directory Structure

```text
/
├── .claude/                # Agent skills and settings
├── .github/                # CI/CD Workflows (Main, Deploy, Release)
├── apps/                   # Execution Targets & Wrappers
│   ├── desktop/            # Electron desktop application (Yarn Workspace)
│   │   ├── main.js         # Electron main entry script (frameless, window setup)
│   │   ├── preload.js      # Secure contextBridge API / diagnostics bridge
│   │   ├── craco.config.js # Custom Webpack and Babel settings
│   │   └── src/            # React UI code
│   ├── mobile/             # Tauri mobile client app (Yarn Workspace)
│   │   ├── src-tauri/      # Tauri Rust native configuration
│   │   └── src/            # React UI code
│   ├── web/                # React browser web application (Yarn Workspace)
│   │   ├── public/         # Static assets and index.html
│   │   ├── src/            # Pages, routes, static data, and context providers
│   │   └── craco.config.js # Craco configuration layer
│   └── server/             # Axum Rust HTTP server (Yarn Workspace / Cargo)
│       ├── src/            # Rust handlers, services, and configuration
│       └── Cargo.toml      # Rust package manifest
├── shared/                 # Shared Monorepo Code packages
│   ├── common/             # Shared UI components, theme, and assets (Yarn Workspace)
│   │   └── src/
│   │       ├── assets/     # Reusable SVG icons & logo
│   │       ├── components/ # Reusable UI components & theme
│   │       ├── localization/ # i18next translation json locales
│   │       └── testUtils/  # Shared testing wrappers
│   └── client-common/      # Shared client React views and logic (Yarn Workspace)
│       └── src/            # Screen views, Zustand store slices, hooks, and services
├── scripts/                # Task-specific helper scripts
├── package.json            # Root workspace configuration
└── .yarnrc.yml             # Yarn 4 configuration
```

## 4. Development Patterns & Rules

### State Management (Zustand v5)

- **Selectors**: Always use `useShallow` when selecting multiple state variables to prevent unnecessary re-renders.
- **Testing**: State updates within tests MUST be wrapped in `act()` from `@testing-library/react`.
- **Resetting**: Stores should implement a `reset` pattern for test isolation (see `web/__mocks__/zustand.ts`).

### UI & Styling (Chakra v3)

- **Compound Components**: Use the standard v3 pattern (e.g., `<Dialog.Root>`, `<Menu.Content>`).
- **Icons**: Use inline SVGs or define local custom SVG components directly within the files where they are needed.
- **Theme**: Tokens are managed in `shared/common/src/components/theme/theme.ts`. Avoid hardcoded colors.

### Routing (React Router v7)

- Use standard `<Link>` and `useNavigate`.
- Note: `TextEncoder` and `TextDecoder` polyfills in `web/jest.js` are required for RRv7 compatibility in JSDOM environments.

### TypeScript

- All files use `.ts` or `.tsx`.
- Strictly adhere to path aliases defined in `apps/web/tsconfig.path.json` (e.g., `@screens`, `@components`, `@store`).

### Rust Backend (Axum)

- **Architecture**: Modular setup divided into HTTP `handlers/`, business logic `services/` (mock and Grammers MTProto clients), and environment `config.rs`.
- **Handlers**: Write Axum handlers that return JSON payloads (`Json<T>`) or explicit statuses.
- **Testing**: Write unit/integration tests and run using `cargo test` (or `yarn server:test` at root). Use `services/mock.rs` to mock Telegram connections.
- **README Maintenance**: Any change made to files inside `apps/server/` (new endpoints, changed payloads, new dependencies, new environment variables, new files, behaviour changes) **MUST** also update [`apps/server/README.md`](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/apps/server/README.md) to keep it accurate, following the rules in the [readme skill](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/readme/SKILL.md). This includes but is not limited to: adding/removing routes in `handlers/mod.rs`, changing request/response types in handlers, changing `TelegramService` trait methods, adding new Cargo dependencies, and modifying `config.rs`.

### Desktop Application (Electron)

- **Process Isolation**: Securely expose APIs via `apps/desktop/preload.js` contextBridge. Do not enable nodeIntegration in renderer processes.
- **Window Dimensions**: The desktop main process dynamically initializes at **80%** of the user's available screen width and height.
- **Diagnostics**: Polling status indicator queries the local diagnostics server (`127.0.0.1:8080`) every 5 seconds. Runs silently in the background.
- **Theme Defaulting**: Defaults automatically to system theme settings (`prefers-color-scheme`) using Chakra UI / NextThemes, with no theme-override controls in UI.
- **Packaging (electron-builder)**: Uses `apps/desktop/electron-builder.json` to generate builds. Ensure DMG layout remains clean and system files (`.background.tiff`, `.VolumeIcon.icns`) are not declared inside `dmg.contents` to prevent rendering them to users.
- **Native File Downloads**: Bypasses Chromium's standard download manager by using an IPC handler `download-file-directly` in `apps/desktop/main.js`. It utilizes `dialog.showSaveDialog` to prompt the user, streams the download from the local Axum server directly to disk via Node.js `fs.createWriteStream`, and cleans up any partial/failed files.

## 5. Testing & Verification

- **Unit/Integration**: `yarn web:test`
  - Snapshots are located in `__snapshots__` directories adjacent to tests.
  - RTL `renderHook` is natively imported from `@testing-library/react`.
- **E2E**: `yarn workspace telegramonic-web cy:open`
- **Build**: `yarn web:build` (Always verify build compatibility after dependency updates).

## 6. Agent Workflow

1.  **Understand**: Review this file and `.claude/CLAUDE.md`.
2.  **Verify**: Always run `yarn workspace telegramonic-web lint` and `yarn web:test` before declaring a task complete.
3.  **Documentation**: Always check if a README update is required for any modified components. If so, update the corresponding `README.md` following the guidelines in the [readme skill](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/readme/SKILL.md).
4.  **Governance**: Follow Conventional Commits and link all changes to the **Telegramonic** Jira project using `prefix/TEL-XXX` branch naming.

---

© 2026 Telegramonic | Confidential and Proprietary
