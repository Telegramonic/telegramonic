---
name: pr
description: Standardized workflows for Pull Request creation and lifecycle management, including branch naming, templates, and agent-led Jira status automation.
trigger: /pr
---

# Pull Request Management Skill

This ruleset defines the standard patterns for creating and managing Pull Requests in this repository. **All Pull Requests MUST be created in the telegramonic-tools repository.**

## 1. Target Repository

- **Owner:** `onemanfighter`
- **Repository:** `telegramonic-tools`
- **Default Base Branch:** `main`

> [!IMPORTANT]
> Every Pull Request created MUST use `owner: "onemanfighter"` and `repo: "telegramonic-tools"`.

## 2. Pull Request Types

### Feat (Feature)

Use this for new features or enhancements.

**Title Format:**
`feat(ticket-number): {Short title}`

**Description Template:**

```markdown
# Description of changes

## Requirement

- {Requirement 1}
- {Requirement 2}

## Implementation

- {Focus on functional changes, not just code details}

Ticket: {Link to Jira ticket}
Author: {Name}
```

### Fix (Bug Fix)

Use this for bug fixes or resolving issues.

**Title Format:**
`fix(ticket-number): {Short title}`

**Description Template:**

```markdown
## Issue:

- {Description of the bug or issue}

## Rootcause:

- {What was causing the issue}

## Fix

- {How it was fixed}

### Implementation

- {Focus on functional changes, not just code details}

Ticket: {Link to Jira ticket}
Author: {Name}
```

## 3. Branch Naming Convention

All feature and fix branches MUST follow this naming pattern (consistent with `COMMIT.md`):

`{username}/{ticket-number}/{short-description}`

**Example:**
`amitraikwar/TEL-20/update-jira-skills`

## 4. GitHub MCP Server Integration

When creating a PR using the `github-mcp-server` tool, ensure:

1. The `owner` and `repo` are set to `onemanfighter` and `telegramonic-tools`.
2. The `title` strictly follows the format above.
3. The `body` (description) strictly follows the corresponding template.
4. The `head` branch strictly follows the naming convention: `{username}/{ticket-number}/{short-description}`.
5. The `base` branch is `main`.
6. Always set the PR **Assignee** to `ar022` and add `ar1603` as a **Reviewer**.
7. Apply platform-specific **Labels** (`Web`, `Core`, or `Desktop`) to the PR.

## 5. Best Practices

- Always link the Jira ticket.
- Keep titles concise but descriptive.
- Descriptions should explain the "Why" and the functional impact of the changes.
- Ensure the PR is created as a `draft` if it's still a work in progress.

### skill: jira-pr-created

**Trigger:** After creating a Pull Request.

1. Extract the Ticket ID from the branch name using: `{{pullRequest.sourceBranch.substringAfter("/").substringBefore("/")}}`.
2. Use `addCommentToJiraIssue` (with `contentFormat: "markdown"`) to add a comment: `Pull Request raised: [{{pullRequest.title}}]({{pullRequest.url}})`.
3. Use `transitionJiraIssue` to move the ticket to `In Review` (Transition ID: `31`).

### skill: jira-pr-merged

**Trigger:** After merging a Pull Request.

1. Extract the Ticket ID from the branch name.
2. Extract the implementation summary using: `{{pullRequest.description.match("(?s)## Implementation\s*(.*?)\r?\n\r?\nTicket:")}}`.
3. Extract the original PR Author using: `{{pullRequest.description.substringAfter("Author:").trim()}}`.
4. Use `addCommentToJiraIssue` (with `contentFormat: "markdown"`) to add a comment:

   ```text
   The changes in this PR have been merged.

   *Summary of changes:*
   {extracted_summary}

   *Author:* {extracted_author}
   *Merged by:* {{pullRequest.mergedBy.displayName}}
   *PR Link:* [{{pullRequest.title}}]({{pullRequest.url}})
   ```

5. Use `transitionJiraIssue` to move the ticket to `Done` (Transition ID: `41`).

### Smart Values Reference

- **Summary Extraction**: `{{pullRequest.description.substringAfter("## Implementation").substringBefore("Ticket:").trim()}}`
- **Ticket ID from Branch**: `{{pullRequest.sourceBranch.substringAfter("/").substringBefore("/")}}`
