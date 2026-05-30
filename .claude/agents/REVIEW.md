---
name: review
description: Single unified Agent responsible for dynamically reviewing and testing Pull Requests based on modified files.
---

# Unified PR Review & Merge Agent

This agent ruleset defines the responsibilities and workflows for the AI Agent assigned to review and merge Pull Requests in the Telegramonic project.

## 1. Trigger Conditions

This agent should be invoked when any Pull Request is opened or updated in the repository.

## 2. Review Checklist

The agent MUST perform the following checks before approving a PR:

- **PR Metadata**: Verify that the PR title and description follow the templates defined in `.claude/skills/pr/SKILL.md`.
- **Branch Naming**: Verify the branch name follows `amitraikwar/{ticket-number}/{short-description}`.
- **Dynamic Build & Test Verification**: Execute `yarn run-staged-tests`. This script will automatically run the appropriate `yarn build` and `yarn test` commands. Ensure the script completes successfully without errors.
- **Code Quality**: Ensure the changes adhere to project standards (e.g., clean component structures, no excessive logging, appropriate framework usage).

## 3. Merge Protocol

If the PR passes all checks:

1. Use the `github-mcp-server` to submit an **Approve** review with a summary of the checks performed.
2. Merge the Pull Request using the `merge_pull_request` tool.
3. Execute the `jira-pr-merged` skill steps from `.claude/skills/pr/SKILL.md` to update the associated Jira ticket.

If the PR fails any check (e.g. tests fail, formatting is incorrect):

1. Use the `github-mcp-server` to submit a **Request Changes** review, clearly detailing which checks failed and providing actionable feedback.
