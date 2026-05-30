.PHONY: coverage
coverage:
	echo "Running coverage tests"
	yarn test:cov
	open -a "Google Chrome" coverage/lcov-report/index.html

.PHONY: branch-clean
branch-clean:
	git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs git branch -D


.PHONY: commit

# suppress tput errors in CI where TERM is not set.
ifndef TERM
TPUT_ARGS := -T xterm-256color
endif
# define standard colors for use in Strings
RED := $(shell tput ${TPUT_ARGS} setaf 1)
GREEN := $(shell tput ${TPUT_ARGS} setaf 2)
BLUE := $(shell tput ${TPUT_ARGS} setaf 6)
RESET := $(shell tput ${TPUT_ARGS} sgr0)

commit: ## Uses staged files and some questions to help you write commit messages in `tag(scope): message` format
	@if [[ -z $$(git diff --name-only --cached) ]]; then \
		echo "${RED}Nothing to commit${RESET}" && echo "" && \
		git status; \
	else \
		echo "committing the following staged files to ${BLUE}$(shell git branch --show-current)${RESET}: " && \
		echo "${GREEN}" && \
		git status --short | grep '^[MARCDT]' && \
		echo "${RESET}" && \
		export PS3="${BLUE}Tag? ${RESET}" && \
		export tags=(fix docs feat refactor test build chore) && \
		select tag in "$${tags[@]}"; do \
			if [[ " $${tags[@]} " =~ " $$tag " ]]; then \
				export TAG=$$tag && break; \
				else \
					echo "Invalid option ${RED}$$REPLY${RESET}"; \
				fi; \
		done && \
		read -ep "${BLUE}Scope? ->${RESET} " SCOPE && \
		export OLD_IFS=$$IFS && \
		read -ep "${BLUE}Commit title? ->${RESET} $${TAG}($${SCOPE}): " TITLE && \
		export BODY="" && \
		printf "${BLUE}Commit body? (optional, newlines OK, ⏎ ⏎ to complete) ->${RESET} " && \
		while read -e line; [ -n "$$line" ]; do \
			export BODY="$$BODY\n$$line"; \
		done && \
		echo "" && \
		export TITLE="$$(echo "$${TITLE}" | sed 's|"|\\"|g')" && \
		export BODY="$$(echo "$${BODY}" | sed 's|"|\\"|g')" && \
		export COMMIT_CMD="git commit -m\"$${TAG}($${SCOPE}): $${TITLE}\"" && \
		if [[ -n $$BODY ]]; then export COMMIT_CMD="$$COMMIT_CMD -m\"$$BODY\""; fi && \
		echo "Commit message will be: " && \
		echo "" && \
		echo "${BLUE}Title: ${GREEN}$${TAG}($${SCOPE}): $${TITLE}${RESET}" && \
		echo "" && \
		echo "${BLUE}Body:" && \
		echo "${RESET}$${BODY}" && \
		echo "" && \
		eval "$$COMMIT_CMD"; \
	fi
