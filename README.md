# Telegramonic

Telegramonic is a website for all free stuff on the internet.

This project is a modernized React application focused on providing free comprehensive resources for developers, designers, and data scientists.

## Core Technology Stack

- **Framework**: [React 18+](https://reactjs.org/)
- **UI Library**: [Chakra UI v3](https://chakra-ui.com/)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Panda CSS](https://panda-css.com/) (Chakra UI v3 underlying engine)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Testing**: [Jest](https://jestjs.io/) & [Cypress](https://www.cypress.io/)
- **Package Manager**: [Yarn 4.x (Berry)](https://yarnpkg.com/)

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
yarn start
```

### Build

```bash
yarn build
```

### Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:cov

# Open Cypress for E2E testing
yarn cy:open
```

### Linting & Formatting

```bash
# Run ESLint
yarn lint

# Format code with Prettier
yarn healthier
```

## Infrastructure

- **CI/CD**: GitHub Actions for automated building, linting, testing, and FTP deployment.
- **Localization**: Internationalization support via `i18next`.
- **Theme**: Robust dark/light mode support with system preference detection.

---

© {{year}} telegramonic.com | All rights reserved
