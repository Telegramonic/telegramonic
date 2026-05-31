# Telegramonic

Telegramonic is a high-performance, minimalist cloud storage solution designed for digital craftsmen, developers, and tech professionals.

This project is a modernized React application focused on providing a fast, secure, and ergonomic workspace for managing and organizing digital assets.

## Core Technology Stack

- **Framework**: [React 18+](https://reactjs.org/)
- **UI Library**: [Chakra UI v3](https://chakra-ui.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Panda CSS](https://panda-css.com/) (Chakra UI v3 underlying engine)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Testing**: [Jest](https://jestjs.io/) & [Cypress](https://www.cypress.io/)
- **Package Manager**: [Yarn 4.x (Berry)](https://yarnpkg.com/)

## Design System

The application utilizes a custom **Modern Corporate / Utility Minimalism** design system powered by **Inter**:

- **Branding**: Telegram Blue (`#0088CC`) as primary accent, Deep Charcoal (`#212529`) for typography.
- **Surfaces**: Tiered neutral system with soft gray background (`#F8F9FA`) and pure white container cards (`#FFFFFF`) defined by thin borders (`#E9ECEF`).
- **Shapes**: Rounded element edges with 8px radius for controls and 16px radius for large modals/panels.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- Yarn 4.x

### Installation

```bash
yarn install
```

### Development

```bash
# Run web React application
yarn web:start

# Run Rust server backend
yarn server:start

# Run Electron desktop app
yarn desktop:start
```

### Build

```bash
# Build web React application
yarn web:build

# Build Rust server backend
yarn server:build
```

### Testing

```bash
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
```

### Linting & Formatting

```bash
# Run ESLint for web
yarn workspace telegramonic-web lint

# Format code with Prettier
yarn workspace telegramonic-web run prettier:write
```

## Infrastructure

- **CI/CD**: GitHub Actions for automated building, linting, testing, and FTP deployment.
- **Localization**: Internationalization support via `i18next`.
- **Theme**: Robust dark/light mode support with system preference detection and Telegramonic design tokens.

---

© {{year}} telegramonic.com | All rights reserved
