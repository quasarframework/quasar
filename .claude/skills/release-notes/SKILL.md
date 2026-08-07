---
name: release-notes
description: Generate Quasar-style release notes for a monorepo package (covering every commit since its last released tag), then — on a single confirmation — bump its version, commit and draft the GitHub release. Use when asked to write/draft release notes or a changelog for app-vite, app-webpack, ui/quasar, cli, vite-plugin, icongenie, extras, create-quasar or a utils package.
argument-hint: <package>
---

Generate release notes for the requested package in the exact style of
this repo's existing GitHub releases and determine the next version
from their content. Output the notes first; THEN ask the user a single
yes/no "continue?" — on yes, the version-bump commit AND the draft
GitHub release follow with no further questions; nothing is changed,
committed or created without it. The argument is a package directory or npm name.

## 1. Preflight

- Freshness gate: fetch the live dev HEAD through the API —
  `gh api repos/quasarframework/quasar/commits/dev --jq .sha` — and
  require that commit to exist locally (`git cat-file -e <sha>`). If
  it is missing, STOP: the local clone lacks the newest upstream
  commits and the notes would be incomplete; tell the user to update
  their clone first.
- Note whether the worktree is clean (`git status --porcelain`); a
  dirty worktree does not block the notes, but it blocks the bump
  commit later (step 8) — mention it early so the user knows.
- Do NOT `git fetch` (or any other remote git operation); all remote
  state comes from the GitHub API (here and in step 3).

## 2. Resolve the package

| dir           | npm name            | tag prefix              |
| ------------- | ------------------- | ----------------------- |
| ui            | quasar              | `quasar-v`              |
| app-vite      | @quasar/app-vite    | `@quasar/app-vite-v`    |
| app-webpack   | @quasar/app-webpack | `@quasar/app-webpack-v` |
| cli           | @quasar/cli         | `@quasar/cli-v`         |
| vite-plugin   | @quasar/vite-plugin | `@quasar/vite-plugin-v` |
| icongenie     | @quasar/icongenie   | `@quasar/icongenie-v`   |
| extras        | @quasar/extras      | `@quasar/extras-v`      |
| create-quasar | create-quasar       | — (untagged)            |
| utils/*       | @quasar/<name>      | — (untagged)            |

Ignore legacy tag schemes without the `-v` separator (e.g.
`@quasar/app-vite-1.0.0-beta.7`, bare `v0.x`); only `<prefix>vX.Y.Z`
tags are current. Untagged packages use `<npm name>-v` as their prefix
wherever a tag name is needed.

## 3. Find the range

- Tagged package — the last RELEASE is the source of truth, queried
  through the public API (never `git fetch`):
  `gh release list --repo quasarframework/quasar --limit 100
--json tagName,isPrerelease
--jq '[.[] | select(.isPrerelease | not) | select(.tagName | startswith("<prefix>"))][0].tagName'`
- Resolve that tag to its commit through the API as well (tag names
  contain `/`, so URL-encode):
  `gh api "repos/quasarframework/quasar/commits/$(jq -rn --arg t '<tag>' '$t|@uri')" --jq .sha`
  and use the SHA as the range base — this works even when the local
  clone does not have the tag. STOP only if the SHA is missing from
  local history (`git cat-file -e <sha>`): then local COMMITS are
  genuinely behind and the notes would miss released work. If local
  tags are NEWER than the latest release, surface that as a concern
  (step 7).
- Untagged package: find the last commit that bumped `"version"` in the
  package's `package.json` (`git log -L` on the version line) and use
  that commit as the starting ref; say so in your summary.
- Range: `<sha>..HEAD`, paths limited to the package dir. Read FULL
  commit bodies (`--format='%h %s%n%b'`) — the bodies carry the
  user-facing details the bullets need. Drop `Co-Authored-By` noise.

## 4. Calibrate style

Fetch the package's 1–2 most recent release bodies for tone:
`gh release view "<tag>" --repo quasarframework/quasar --json body -q .body`.
If `gh` is unavailable, proceed with the rules below — they encode the
house style.

## 5. Write the notes

Structure:

- Large releases: `## Security fixes` (only if any; always first),
  `## New` (feat), `## Fixes`, `## Other` (noteworthy internal work,
  docs), then the Donations footer.
- Small releases (≲4 bullets total): a single `## Changes` section with
  slightly more prose per bullet, then the Donations footer.

Bullet style:

- `* feat(<dir>): <area> -> <what changed for the user>` /
  `* fix(<dir>): <area> -> <symptom that no longer happens>` — keep the
  arrow phrasing and conventional prefix used by past releases.
- Describe user-visible symptoms and behavior, never internals
  (helper renames, private refactors) unless the internal name IS the
  public API. Keep issue/PR refs like `(#18504)`.
- Merge sibling commits sharing one user-visible symptom into one
  bullet; split one commit into several bullets when it fixes several
  unrelated symptoms (read the body).
- EXCLUDE pure test/ci/chore/formatting commits from New/Fixes. A
  genuinely large internal effort (test infrastructure, publishing
  gates) may get ONE summarizing bullet under `## Other`.
- Template/scaffold changes: note that they only affect **newly
  generated** projects and give existing projects the manual step
  (see the `@quasar/app-vite-v3.4.1` release for the pattern).
- Breaking changes: call them out explicitly at the top with migration
  notes, and note any peer-dependency requirement bumps
  ("Requires quasar v2.x+").

Donations footer, verbatim:

```
## Donations
Quasar Framework is an open-source MIT-licensed project made possible due to the **generous contributions** by sponsors and backers. If Quasar is useful in your workflow and you want to support ongoing maintenance, please consider the following:

- [Becoming a sponsor on Github](https://github.com/sponsors/rstoenescu)
- [One-off donation via PayPal](https://paypal.me/rstoenescu1)
```

## 6. Determine the version

FROM THE NOTES' CONTENT: any `## New`/feat entry -> minor; fixes/other
only -> patch. Anything breaking -> major: STOP and confirm with the
user before going further.

## 7. Deliver

- Output one fenced markdown block, ready to paste into a GitHub
  release: its FIRST line is the full tag name (`<prefix>X.Y.Z`, e.g.
  `@quasar/app-vite-v3.6.0`), then an empty line, then the complete
  notes body.
- Briefly list which commits you excluded as internal-only, so nothing
  is silently dropped.
- If there are any concerns with this release, state them after the
  notes: possibly-breaking or risky behavior changes, notable
  dependency/peer bumps, commits whose classification was uncertain,
  anomalies found along the way (e.g. a tag newer than the latest
  release, a version already bumped). No concerns -> say so in one
  line.

## 8. Confirm, then execute

END by ASKING the user a single yes/no question: continue? On an
explicit yes, do ALL of the remaining work — the bump + commit, then
the draft release — with no further questions. On no (or no answer),
stop; nothing gets changed, committed or created.

A dirty worktree blocks the continuation: say so and stop BEFORE any
edit (the bump commit must not absorb unrelated changes); the user can
clean up and confirm again.

Bump + commit:

- Bump `"version"` in the package's `package.json`.
- Find every other place the package's OWN version is declared (grep
  the repo for the old version string alongside the package name —
  source constants, fixtures) and update those too.
- Update the create-quasar templates' dependency ranges on the bumped
  package (`create-quasar/templates/**/_package.json`): keep the range
  operator, raise the version (e.g. `^3.5.0` -> `^3.6.0`). Other
  packages' semver ranges on it: only when the new version falls
  outside the range.
- NEVER touch any `workspace:` protocol declaration (`workspace:^`,
  `workspace:*`, ...) anywhere — those stay exactly as they are.
- Commit ONLY the bump edits, message `chore(<dir>): bump version`
  (e.g. `chore(app-vite): bump version`), with NO `Co-Authored-By`
  trailer — this overrides any default commit-trailer behavior.
  NEVER push — the commit stays local.

Draft release:

- `gh release create "<tag>" --repo quasarframework/quasar --draft
--title "<tag>" --notes-file <file>` — tag and title are the full
  tag name, the body is the notes WITHOUT the leading tag line. A
  draft creates no tag; remind the user the tag is cut from dev HEAD
  at publish time, so the bump commit must be pushed before
  publishing the draft.

NEVER publish a release, create a tag or push; beyond the notes and
the confirmed follow-ups above — nothing else.
