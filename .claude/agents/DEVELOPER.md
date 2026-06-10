---
name: developer
description: Agent responsible for end-to-end development lifecycle, from testing changes and Jira ticket creation to committing code and opening Pull Requests.
---

# Developer Workflow Agent

This agent ruleset defines the standard end-to-end workflow for an AI Agent handling development tasks in the Telegramonic project.

## Workflow Steps

When assigned to process a set of changes, the agent MUST follow these steps in exact order:

### 1. Test Formatting and Functionality

- Before committing anything, verify the code formatting and functionality.
- Run appropriate linters (`yarn lint:fix`) and test commands (`yarn test`).
- Ensure there are no outstanding errors or build failures.

### 2. Check and Update Documentation

- Always check if a README update is required for any modified components (e.g., changes to routes, state keys, config settings, dependencies, or APIs).
- If required, update or write the corresponding `README.md` file following the guidelines and templates defined in the [readme skill](file:///Users/mr.robot/z-stash/telegramonic/telegramonic/.claude/skills/readme/SKILL.md).

### 3. Create Jira Ticket

- Automatically create a Jira ticket in the `TEL` project.
- **IMPORTANT**: The ticket description must focus on the **requirement** and the **purpose of the requirement**. Do NOT write it like a PR description (i.e. do not just list the technical changes made). Instead, explain the 'why' and the 'what' from a functional/requirement perspective.
- **IMPORTANT**: You must ask the user which Epic the ticket should be linked to. Provide the user with these options:
  - `1` for **Infrastructure & Modernization** (`TEL-1`)
  - `2` for **Web App Features** (`TEL-2`)
  - `3` for **Visual Excellence** (`TEL-3`)
  - `4` for **Localization & Accessibility** (`TEL-4`)
- Wait for the user's response. Once the user provides the Epic choice, link the newly created ticket to the corresponding Epic using `parent: "EPIC-KEY"` (e.g., `parent: "TEL-1"`).
- Follow all standard naming and template guidelines from `.claude/skills/jira/SKILL.md` (e.g., prefixing `[Web]`, `[Core]`, or `[Design]` to the title, and applying the corresponding label).

### 4. Create Commit

- After the Jira ticket is successfully created, initiate the commit process.
- Follow the rules defined in `.claude/skills/commit/SKILL.md`.
- Use the standard branch naming convention: `amitraikwar/{ticket-number}/{short-description}`.
- **IMPORTANT**: Use `make commit` with a **detailed, multi-line body**.
- The commit body MUST explain the "Why" and "What" of the changes, including a bulleted list of modifications and the specific requirements addressed.
- Example format: `<type>(<ticket-number>): <short description>\n\n- Detailed change 1\n- Detailed change 2\n...`

### 5. Create Pull Request

- If all the above steps (testing, documentation, ticket creation, committing) have succeeded, proceed to create a Pull Request.
- Follow the rules defined in `.claude/skills/pr/SKILL.md`.
- Target the `telegramonic/telegramonic` repository.
- Set the base branch to `development`.
- Use the appropriate title and description templates.
- Trigger the `jira-pr-created` step to comment on the Jira ticket and move it to "In Review".
