---
name: commit
description: Manage Conventional Commits, branch naming conventions, and interactive commit workflows using the project's standardized makefile commands.
trigger: /commit
---

# Commit Command

This file provides guidance for using Claude Code to commit changes following the project's Commit Workflow.

> [!IMPORTANT]
> You MUST always use `make commit` to initiate a commit. This ensures all commits follow the conventional commit standard.

## Commit Workflow

1. Create a feature branch: `git checkout -b amitraikwar/{ticket-number}/{short-description}`
2. Stage your changes: `git add <files>`
3. Create initial commit: `make commit` (opens interactive conventional commit prompt)
4. Amend with detailed message: `git commit --amend` to add requirements and detailed descriptions of changes
5. Amend with detailed message: `git commit --amend` to add requirements and detailed descriptions of changes.

## Branch Naming

All feature and fix branches MUST follow this naming pattern:

`amitraikwar/{ticket-number}/{short-description}`

**Example:**
`amitraikwar/TEL-18/update-branding`

## Commit Message Format

> [!IMPORTANT]
> Always use `make commit` for the initial commit. DO NOT use `git commit -m`.
> **Every commit MUST include a detailed body.** A single-line description is NOT sufficient.

When using Claude Code to commit changes:

- **Initial Commit**: Use the `/commit` skill or run `make commit` with a detailed body.
- **Body Content**: The commit body MUST explain:
  - **Why**: The rationale behind the changes.
  - **What**: A summary of key modifications (use bullet points for multiple items).
  - **Requirements**: List any specific requirements or JIRA criteria addressed.
- **Format**: `<type>(<ticket-number>): <short description>` followed by a detailed body.

## Examples

### Initial Commit with Detailed Message

To provide a high-quality commit message in one go:

```bash
# Pattern: printf "tag_index\nscope\ntitle\nDetailed body explanation with bullet points.\n\n" | make commit
printf "3\TEL-19\nadd branding and skills\n- Implement Telegramonic branding across core components.\n- Add custom SVG icons for the new design system.\n- Update global styles to use the vibrant Telegramonic color palette.\n- Adhere to requirements specified in TEL-19 for visual excellence.\n\n" | make commit
```

### Initial Commit (Interactive)

```bash
git add src/components/NewFeature.tsx
make commit
# Select type: feat, fix, etc.
# Enter ticket number as scope (e.g. TEL-19)
# Enter brief description
```

### Amend Commit

```bash
git commit --amend
# Edit the commit message to add:
# - Detailed description of changes
# - Requirements addressed
# - Any breaking changes or special notes
```

## Best Practices

- Keep subject line under 50 characters
- Use body to explain "why" not just "what"
- Reference related issues if applicable
- Ensure commit passes linting and tests before pushing
