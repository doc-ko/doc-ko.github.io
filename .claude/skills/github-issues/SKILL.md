---
name: github-issues
description: How to file, label and link GitHub issues for this site's repo (doc-ko/doc-ko.github.io). Use whenever the user asks to create, file, track, label, link or update an issue, says "issue: ...", wants to "track the work", or asks for sub-issues, blocked-by links or labels, even if they never say "GitHub".
---

# GitHub issues for the personal site

Issues here track development, configuration and maintenance work, plus bugs and design. New posts and small fixes don't get one; see "Tracking work" in `AGENTS.md` for when an issue is required. The repo is `doc-ko/doc-ko.github.io`.
Confirm with `gh repo view --json nameWithOwner -q .nameWithOwner` if unsure.

## Pick a route

Prefer the GitHub MCP tools (`mcp__plugin_github_github__*`, loaded through ToolSearch). They need no shell approval and return the issue's database `id`, which sub-issue links require.

If the MCP server failed to connect, use `gh` instead.
The usual cause is that `GITHUB_PERSONAL_ACCESS_TOKEN` is not set in the environment Claude Code started from, so the plugin sends a bare `Bearer ` header and GitHub rejects it as badly formatted.
`gh` authenticates separately (`GH_TOKEN` or the keyring) and normally works.
Tell the user about the broken server once, then carry on with `gh`.

## Before creating

Issues are public the moment they exist, so how much to confirm depends on who chose the content:

- The user dictated the issue ("issue: ..."): create it, then report the number and link.
- You are proposing issues (from TODOs, notes, or a review): list the candidates with a line each and let the user pick before creating anything.

Search for duplicates first (`search_issues`, or `gh issue list --search`).
Read the relevant code before writing a bug, so the issue can name the likely cause and the file. A bug report that points at `src/styles/global.css` is far easier to pick up than one that only describes the symptom.

Never put the contact email address in an issue. The site stores it reversed in `src/data/contact.js` to dodge scrapers, and a public issue would defeat that.

## Writing the issue

Titles are short and say what is wrong or wanted ("Mobile: AI-generated text note can't be dismissed"), not "Bug".

Use whichever shape fits:

- **Bug:** Problem, Likely cause (with file paths), Expected, Notes.
- **Planned work:** Background, Goal, Scope or To do, Open decisions, Related.

Link other issues with `#N` and design artifacts by URL.
If the work changes `homepage.yaml` or components, add a line saying the docs under `docs/modules/ROOT/pages/` need updating in the same change, as `AGENTS.md` requires.

Issue numbers share one sequence with pull requests, so the first issue may not be #1. Say so if the user is surprised by a high number.

## Labels

The repo has GitHub's defaults plus two custom labels:

| Label | Use for |
|---|---|
| `bug` | Something is broken |
| `enhancement` | New feature or implementation work |
| `documentation` | Docs under `docs/` |
| `design` | Visual design, layout, the design brief |
| `content` | Copy and written content |
| `question` | Open decisions that need discussion |

Set labels when creating: `issue_write` takes a `labels` array, and `gh issue create` takes `--label`. That saves a second call.
Check `gh label list` before assuming a label exists.
Create a missing one with `gh label create <name> --color <hex> --description "..."` rather than skipping it, but prefer an existing label when one fits.
Work can carry more than one label (an implementation of a design is `enhancement` and `design`).

## Relationships

Use GitHub's native links instead of prose, so progress shows up on the parent.

- **Sub-issue** (the umbrella issue contains the implementation):
  `gh api -X POST repos/OWNER/REPO/issues/PARENT/sub_issues -F sub_issue_id=<child database id>`
- **Blocked by** (one issue waits on another's decision):
  `gh api -X POST repos/OWNER/REPO/issues/BLOCKED/dependencies/blocked_by -F issue_id=<blocking database id>`

Both calls take the issue's database `id`, not its number.
Get it from the MCP create response, or with `gh api repos/OWNER/REPO/issues/N --jq .id`.
Use `-F` (not `-f`) so the id is sent as a number.

Choose the relationship by meaning. A sub-issue means the parent is not finished until the child is, so use it for an umbrella and its implementation. Use blocked-by for "cannot start or finish until that is decided".
Mention in the issue body when a relationship exists, so it reads correctly outside GitHub's UI.
Standalone bugs and small tasks need no relationship. Planned work often does: use a sub-issue for an umbrella and its implementation, and blocked-by when one decision gates another.
Add a link only when the dependency is real, not to make issues look connected.

## Linking to PRs

Pull requests are handled by the `git-commit` skill, which covers branches, commits and opening the PR.
The only issue-side rule is to write `Closes #N` in the PR body so merging closes the issue, and to link related issues with `#N`.

## Updating

`issue_write` with `method: update` replaces the whole body. Read the current body first (`issue_read`) and send the full new text, so nothing is lost.
Close issues with a `state_reason` (`completed`, `not_planned` or `duplicate`).

## After acting

Report the issue numbers with links, the labels applied, and any relationships created. Keep it to a few lines.
