---
name: release-notes
description: Generate Quasar-style release notes for a monorepo package (covering every commit since its last released tag), then — on a single confirmation — bump its version, commit and draft the GitHub release. Use when asked to write/draft release notes or a changelog for app-vite, app-webpack, ui/quasar, cli, vite-plugin, icongenie, extras, create-quasar or a utils package.
argument-hint: <package>
---

Generate release notes for the requested package (a directory or npm
name) in the house style, determine the next version from their
content, and output them. THEN ask one yes/no "continue?" — on yes,
the version-bump commit AND the draft GitHub release follow with no
further questions; without it nothing is changed, committed or
created.

All remote state comes from the GitHub API (`gh`) — NEVER `git fetch`
or any other remote git operation. NEVER publish a release, create a
tag or push.

## 1. Preflight

- Freshness gate: the live dev HEAD
  (`gh api repos/quasarframework/quasar/commits/dev --jq .sha`) must
  exist locally (`git cat-file -e <sha>`); otherwise STOP and tell the
  user to update their clone.
- Note whether the worktree is clean (`git status --porcelain`) — a
  dirty one doesn't block the notes, but blocks step 8's commit;
  mention it early.

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

Only `<prefix>vX.Y.Z` tags are current (ignore legacy schemes without
the `-v` separator). Untagged packages use `<npm name>-v` as their
prefix wherever a tag name is needed.

## 3. Find the range

- Base = the last PUBLISHED release; drafts and prereleases are never
  the base:
  `gh release list --repo quasarframework/quasar --limit 100
--json tagName,isPrerelease,isDraft
--jq '[.[] | select((.isPrerelease or .isDraft) | not) | select(.tagName | startswith("<prefix>"))][0].tagName'`
  Note any prefix-matching DRAFT for steps 7/8.
- Resolve the tag to its commit (URL-encode — tag names contain `/`):
  `gh api "repos/quasarframework/quasar/commits/$(jq -rn --arg t '<tag>' '$t|@uri')" --jq .sha`
  and use the SHA as the base even when the local clone lacks the tag.
  STOP only if the SHA is missing locally (`git cat-file -e`) — local
  commits are behind. Local tags NEWER than the latest release: a
  step-7 concern.
- Untagged package: base = the last commit bumping `"version"` in its
  `package.json` (`git log -L` on that line); say so in the summary.
- Range: `<sha>..HEAD`, paths limited to the package dir. Read FULL
  commit bodies (`--format='%h %s%n%b'`); drop `Co-Authored-By` noise.
- An EMPTY range -> "nothing new since <tag>", STOP (no notes, no
  version, no ask). ONLY internal commits (test/ci/chore/formatting)
  -> list them, state there is nothing release-worthy, stop unless the
  user explicitly wants an internal-only release.

## 4. Calibrate style

Fetch the package's 1–2 latest release bodies for tone:
`gh release view "<tag>" --repo quasarframework/quasar --json body -q .body`.
If `gh` is unavailable, the rules below encode the house style.

## 5. Write the notes

Structure:

- Large releases: `## Security fixes` (only if any; always first),
  `## New` (feat), `## Fixes`, `## Other` (noteworthy internal work,
  docs), then the Donations footer.
- Small releases (≲4 bullets total): a single `## Changes` section
  with slightly more prose per bullet, then the Donations footer.

Bullet style:

- `* feat(<dir>): <area> -> <what changed for the user>` /
  `* fix(<dir>): <area> -> <symptom that no longer happens>` — keep
  the arrow phrasing and conventional prefix.
- User-visible symptoms and behavior, never internals, unless the
  internal name IS the public API. Keep issue/PR refs like `(#18504)`.
- Merge sibling commits sharing one user-visible symptom; split one
  commit into several bullets when it fixes unrelated symptoms.
- EXCLUDE pure test/ci/chore/formatting commits from New/Fixes; a
  genuinely large internal effort may get ONE summarizing `## Other`
  bullet.
- Template/scaffold changes: note they only affect **newly generated**
  projects and give existing projects the manual step (pattern:
  the `@quasar/app-vite-v3.4.1` release).
- Breaking changes: called out explicitly at the top with migration
  notes, plus any peer-dependency bumps ("Requires quasar v2.x+").

Donations footer, verbatim:

```
## Donations
Quasar Framework is an open-source MIT-licensed project made possible due to the **generous contributions** by sponsors and backers. If Quasar is useful in your workflow and you want to support ongoing maintenance, please consider the following:

- [Becoming a sponsor on Github](https://github.com/sponsors/rstoenescu)
- [One-off donation via PayPal](https://paypal.me/rstoenescu1)
```

## 6. Determine the version

From the NOTES' content: any `## New`/feat entry -> minor; fixes/other
only -> patch. Anything breaking -> major: STOP and confirm first.

## 7. Deliver

- One fenced markdown block, paste-ready: FIRST line is the full tag
  name (e.g. `@quasar/app-vite-v3.6.0`), then an empty line, then the
  notes body.
- List the commits excluded as internal-only — nothing silently
  dropped.
- State any concerns after the notes (risky behavior changes, notable
  dependency/peer bumps, uncertain classifications, anomalies: a tag
  newer than the latest release, an already-bumped version, an
  existing draft for the tag). No concerns -> one line saying so.

## 8. Confirm, then execute

End by asking ONE yes/no question: continue? Yes -> do ALL of the
following with no further questions; no (or no answer) -> stop. A
dirty worktree stops the continuation BEFORE any edit — the bump
commit must not absorb unrelated changes.

Bump + commit:

- Bump `"version"` in the package's `package.json`, plus every other
  place the package's OWN version is declared (grep the old version
  string alongside the package name — source constants, fixtures).
- Raise the create-quasar templates' dependency ranges on the bumped
  package (`create-quasar/templates/**/_package.json`), keeping the
  range operator (`^3.5.0` -> `^3.6.0`). Other packages' ranges on it:
  only when the new version falls outside the range.
- NEVER touch any `workspace:` protocol declaration.
- Commit ONLY the bump edits, message `chore(<dir>): bump version`,
  with NO `Co-Authored-By` trailer (overrides any default). The
  commit stays local.

Draft release — never a duplicate:

- `utils/*` packages get NO draft (not direct public-facing): their
  continuation ends at the bump + commit — say so when asking.
- Release label: ONLY the ui package is marked "Latest"
  (`--latest`); every other package passes `--latest=false` (label
  "None"). Apply on BOTH create and edit.
- If a release for the tag already exists (`gh release view "<tag>"
--repo quasarframework/quasar --json isDraft` — finds drafts too):
  PUBLISHED -> stop, report the anomaly; DRAFT -> update it in place
  (`gh release edit "<tag>" ... --draft --title "<tag>"
--notes-file <file>`).
- Otherwise `gh release create "<tag>" --repo quasarframework/quasar
--draft --title "<tag>" --notes-file <file>` — tag and title are
  the full tag name; the body is the notes WITHOUT the leading tag
  line. A draft creates no tag (it is cut from dev HEAD at publish
  time) — remind the user to push the bump commit before publishing.
