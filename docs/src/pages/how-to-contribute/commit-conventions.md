---
title: Commit Conventions
desc: Quasar commit conventions
---

## Goals

- Allow ignoring commits by git bisect (not important commits like formatting)
- Provide better information when browsing the history

::: warning
This rule applies to ALL [Quasar repositories](https://github.com/quasarframework).
:::

A well-cared log is a beautiful and useful thing. `git blame`, `revert`, `rebase`, `log`, `shortlog` and other subcommands come to life. Reviewing others' commits and pull requests becomes something worth doing, and suddenly can be done independently. Understanding why something happened months or years ago becomes not only possible but efficient.

## The Rules of a Great Git Commit Message

1. Separate subject from body with a blank line
2. Limit the subject line to 70 characters
3. Do not end the subject line with a period
4. Use the imperative mood in the subject line
5. Wrap the body at 80 characters
6. Use the body to explain what and why vs. how

## Format of a Commit Message

```
<type>(<scope>): <subject> (fix #<github-ref-id>)

<body>

<footer>
```

### Example of a Commit Message

```
fix(ui): QVirtualScroll SSR-rendered padding mismatching the client's (fix #12345)

The initial window rendered on the server used the default size for every
entry, while the client recomputed it from the actual viewport, producing
a hydration mismatch. Compute the initial window identically on both sides.
```

## Message Subject (First Line)

The first line cannot be longer than 70 characters, the second line is always blank. The type and scope should always be lowercase. Start the subject in lowercase too - words are only capitalized when they are proper names (`QVirtualScroll`, `Screen` plugin, `SSR`, `Electron`, ...).

**Allowed `<type>` values:**

- **feat** - new feature for the user, not a new feature for build script
- **fix** - bug fix for the user, not a fix to a build script
- **docs** - documentation only changes
- **style** - changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **refactor** - refactoring production code, a code change that neither fixes a bug nor adds a feature
- **chore** - other changes that don't modify src or test files (_no production code change_) and dependency updates
- **perf** - change that improves performance
- **revert** - reverts a previous commit
- **test** - adding missing tests, refactoring tests; no production code change
- **build** - changes that affect the build system or external dependencies (e.g. `ui/build/*`)
- **ci** - changes to our Continuous Integrations configuration files and scripts (e.g. GitHub Actions)

**Example `<scope>` values:**

- Directory/package related: ui, cli, app-vite, docs, etc.
- Feature related: api, TouchSwipe, QTime, etc.

::: tip
The `<scope>` can contain more values separated by ampersand(`&`). Example: `feat(app-vite&app-webpack): add Capacitor mode`.

The `<scope>` can be empty (e.g. if the change is global), in which case the parentheses are omitted. Example: `style: use semicolons`
:::

If the commit resolves a reported issue, append `(fix #xxxx)` (#xxxx is the issue id) to the subject - it links the issue and produces a better release log.

## Message Body

- uses the imperative, present tense: "change" not "changed" nor "changes"
- includes motivation for the change and contrasts with previous behavior

## Message Footer

### Breaking Changes

All breaking changes have to be mentioned as a breaking change block in the footer, which should start with the word BREAKING CHANGE: with a space or two newlines. The rest of the commit message is then the description of the change, justification and migration notes.

```
BREAKING CHANGE: the `port-runner` command line option has changed
    to `runner-port`.

    To migrate your project, change all the commands where you use
    `--port-runner` to `--runner-port`.
```

### Referencing Issues

Closed issues should be listed on a separate line in the footer prefixed with the "Closes" keyword like this:

`Closes #234`

or in the case of multiple issues:

`Closes #123, #245, #992`
