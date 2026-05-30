# Telegramonic Agent Guide

This file serves as the primary source of truth for AI agents working on the **Telegramonic** project. It provides architectural context, directory structures, and established development patterns.

---

## 1. Project Overview

| Core Stack | Technology |
| :--- | :--- |
| **Framework** | [React 18.3+](https://react.dev/) |
| **UI Library** | [Chakra UI v3](https://chakra-ui.com/) |
| **State Management** | [Zustand v5](https://zustand.docs.pmnd.rs/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Styling** | Vanilla CSS + Chakra UI v3 (Panda CSS) |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) |
| **Testing** | Jest + React Testing Library (v16+) + Cypress |
| **Package Manager**| [Yarn 4 (Berry)](https://yarnpkg.com/) |
| **Aesthetic**       | Utilitarian Minimalism / Terminal-Luxury |
| **Brand Colors**    | Charcoal (#15111e) & Violet (#8b5cf6) |

---

## 2. Design & Product Identity

### Visual Language
- **Theme**: Dark mode by default. High contrast with subtle grain textures and glassmorphic overlays.
- **Typography**: Geist (Sans-serif) for primary UI, Geist Mono for technical data and code.
- **Components**: Crisp border-based separation and interactive micro-animations.

### Resource Taxonomy
The platform organizes resources into 13 primary verticals:
1. **AI & ML** | 2. **Privacy & Adblocking** | 3. **Streaming & Media** | 4. **Gaming & Emulation** | 5. **Education** | 6. **OS Specific (Linux/macOS/Mobile)** | 7. **Miscellaneous**.

---

## 3. Directory Structure

```text
/
├── .claude/                # Agent skills and settings
├── .github/                # CI/CD Workflows (Main, Deploy, Release)
├── public/                 # Static assets and index.html
├── src/
│   ├── assets/             # Images, Global Icons, Fonts
│   ├── components/         # Reusable UI components
│   │   └── Theme/          # Chakra UI v3 theme configuration & tokens
│   ├── data/               # Static data and mock JSONs
│   ├── hooks/              # Global custom React hooks
│   ├── localization/       # i18next configuration and locales (en/main.json)
│   ├── providers/          # Context Providers (Theme, Localization, Router, Query)
│   ├── routes/             # Route definitions and Lazy-loaded screen exports
│   ├── screens/            # Page-level screen components
│   ├── store/              # Zustand state management
│   │   ├── app/            # Application-level business logic
│   │   └── ui/             # UI-specific state (Modals, Loading, etc.)
│   ├── testUtils/          # Test wrappers and custom render functions
│   ├── App.tsx             # Main application entry point
│   └── index.tsx           # React DOM bootstrap
├── scripts/                # Task-specific bash scripts
├── tsconfig.json           # TS configuration (Target: ES2022, ModuleResolution: Bundler)
├── jest.js                 # Critical polyfills (TextEncoder/Decoder) for RRv7
└── .yarnrc.yml             # Yarn 4 configuration (installStatePath inside node_modules)
```

---

## 4. Development Patterns & Rules

### State Management (Zustand v5)
- **Selectors**: Always use `useShallow` when selecting multiple state variables to prevent unnecessary re-renders.
- **Testing**: State updates within tests MUST be wrapped in `act()` from `@testing-library/react`.
- **Resetting**: Stores should implement a `reset` pattern for test isolation (see `__mocks__/zustand.ts`).

### UI & Styling (Chakra v3)
- **Compound Components**: Use the standard v3 pattern (e.g., `<Dialog.Root>`, `<Menu.Content>`).
- **Icons**: Centralized in `src/assets/icons/`. Use the `TelegramonicIcon` enum system.
- **Theme**: Tokens are managed in `src/components/Theme/theme.ts`. Avoid hardcoded colors.

### Routing (React Router v7)
- Use standard `<Link>` and `useNavigate`.
- Note: `TextEncoder` and `TextDecoder` polyfills in `jest.js` are required for RRv7 compatibility in JSDOM environments.

### TypeScript
- All files use `.ts` or `.tsx`.
- Strictly adhere to path aliases defined in `tsconfig.path.json` (e.g., `@screens`, `@components`, `@store`).

---

## 5. Testing & Verification

- **Unit/Integration**: `yarn test`
  - Snapshots are located in `__snapshots__` directories adjacent to tests.
  - RTL `renderHook` is natively imported from `@testing-library/react`.
- **E2E**: `yarn cy:open`
- **Build**: `yarn build` (Always verify build compatibility after dependency updates).

---

## 6. Agent Workflow

1.  **Understand**: Review this file and `CLAUDE.md`.
2.  **Verify**: Always run `yarn lint:fix` and `yarn test` before declaring a task complete.
3.  **Governance**: Follow Conventional Commits and link all changes to the **Telegramonic** Jira project using `prefix/WOT-XXX` branch naming.

---
© 2026 Telegramonic | Confidential and Proprietary
