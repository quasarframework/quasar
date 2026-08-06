---
name: release-notes
description: Generate Quasar-style release notes for a monorepo package, covering every commit since its last released tag. Use when asked to write/draft release notes or a changelog for app-vite, app-webpack, ui/quasar, cli, vite-plugin, icongenie, extras, create-quasar or a utils package.
argument-hint: <package> [<from-ref>]
---

Generate release notes for the requested package, in the exact style of
this repo's existing GitHub releases. The argument is a package
directory or npm name; an optional second argument overrides the
starting ref (tag/commit) when the auto-detected one is wrong.

## 1. Resolve the package

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
tags are current.

## 2. Find the range

- Tagged package: `git tag --sort=-creatordate -l '<prefix>*' | head -1`
  (cross-check with `--sort=-v:refname`; prefer the higher version if
  they disagree).
- Untagged package: find the last commit that bumped `"version"` in the
  package's `package.json` (`git log -L` on the version line) and use
  that commit as the starting ref; say so in your summary.
- Range: `<ref>..HEAD`, paths limited to the package dir. Read FULL
  commit bodies (`--format='%h %s%n%b'`) — the bodies carry the
  user-facing details the bullets need. Drop `Co-Authored-By` noise.

## 3. Calibrate style

Fetch the package's 1–2 most recent release bodies for tone:
`gh release view "<tag>" --repo quasarframework/quasar --json body -q .body`.
If `gh` is unavailable, proceed with the rules below — they encode the
house style.

## 4. Write the notes

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

## 5. Deliver

- Suggest the next version: patch for fixes-only, minor for any feat,
  major for breaking — and print the full tag name (`<prefix>X.Y.Z`).
- Output the complete notes body in one fenced markdown block, ready to
  paste into a GitHub release.
- Briefly list which commits you excluded as internal-only, so nothing
  is silently dropped.
- Do NOT create tags or releases; only draft the notes (unless
  explicitly asked to publish).
