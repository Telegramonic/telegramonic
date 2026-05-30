# CLAUDE.md

This file provides a high-level entry point for Claude-based tools working in the **Telegramonic** repository.

## Overview

This is a **React Web Application** built with Create React App (using Craco for configuration) representing the Telegramonic cloud storage solution.

- **Framework**: React 18.3+
- **Styling**: Chakra UI (Inter typography, Telegram Blue brand colors) and Tailwind CSS
- **State Management**: Zustand, React Query
- **Icons**: Local SVG components defined inline within components

## 📘 Primary Documentation

For comprehensive technical documentation, architectural decisions, file conventions, and agent-specific skills, always refer to:

👉 **[AGENT.md](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/AGENT.md)**

## 💻 Code Style Guidelines

- **React Components**: Avoid using `React.FC` or `React.FunctionComponent` to define functional components. Instead, type props directly in the function arguments: `const MyComponent = ({ prop1 }: Props) => { ... }`.

## Essential Commands

These are the most common commands for development:

```bash
yarn install    # Install dependencies
yarn start      # Start local development server (craco start)
yarn build      # Create production build (craco build)
yarn test       # Run tests (jest)
yarn lint:fix   # Run ESLint and fix issues
make commit     # Conventional commit helper
```

## Antigravity Skills

Advanced agent instructions are modularized in the `.claude/skills/` directory.

- [Commit Workflow](file:///.claude/skills/commit/SKILL.md)
- [Jira Management](file:///.claude/skills/jira/SKILL.md)
- [Pull Request Skill](file:///.claude/skills/pr/SKILL.md)
- [Frontend Design](file:///.claude/skills/frontend-design/SKILL.md)
- [Web Development](file:///.claude/skills/web/SKILL.md)

## 🌐 Localization Guidelines

All user-facing copy strings (headings, paragraphs, labels, button texts, tooltips, placeholders, etc.) MUST be defined in the localization JSON files located in `src/localization/locales/` (e.g. `main.json`) and retrieved dynamically in code using the `useTranslation` hook (`t('key')`). Never hardcode text strings directly in component files.

## 🧪 Testing Guidelines

Always add or update the unit tests (and their snapshots) to align with the requested feature implementations or changes. Run the test suite using `yarn test` or `yarn test -u` to verify that all changes are fully covered, correct, and pass successfully.
