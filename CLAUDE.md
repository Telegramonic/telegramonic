# CLAUDE.md

This file provides a high-level entry point for Claude-based tools working in the **Telegramonic** repository.

## Overview

This is a **React Web Application** built with Create React App (using Craco for configuration).

- **Framework**: React 18.3+
- **Styling**: Chakra UI, Tailwind CSS
- **State Management**: Zustand, React Query
- **Icons**: Custom SVG icons via `@assets/icons`

## 📘 Primary Documentation

For comprehensive technical documentation, architectural decisions, file conventions, and agent-specific skills, always refer to:

👉 **[AGENT.md](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/AGENT.md)**

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
