## Quasar Framework Roadmap

Where will Quasar be in one year, five years or ten years? It's up to you, the developers using Quasar.

You, the community, are Quasar. We listen to your opinions and your needs. Which is why we encourage you to directly contact us on [Discord](https://chat.quasar.dev) or submit [Feature Requests](https://github.com/quasarframework/quasar/issues/new/choose). We carefully ponder on all the ideas and we decide along with the community what are the next steps to be taken.

### Important!

If you want to speed up the development of Quasar please consider donating to the project. With proper funding, it allows more of the team to work on the project in a much more dedicated manner.

[Donations - https://donate.quasar.dev](https://donate.quasar.dev)

If you're in a company and using Quasar for commercial projects, explain to your management the importance of monthly donations (eg. $200+) for open source projects: you're the one using it every day and this makes you the best suited person to convince them. Be creative! :)

Quasar is saving your company tens of thousands of development hours (quite literally), which in turn is a pretty high money savings. Consider giving back a part of those savings to refuel the project itself ;)

## Support policy and schedule

All major Quasar UI releases are typically supported for at least 12 months.
LTS support ends 12 months after the release of a new major version.

| Packages              | Version | Status      | Released   | Active support ends | LTS support ends |
| --------------------- | ------- | ----------- | ---------- | ------------------- | ---------------- |
| Quasar UI (`quasar`)  | v3.x    | Planned     | -          | -                   | -                |
| Quasar UI (`quasar`)  | v2.x    | Active      | 2021-06-21 | Not planned yet     | Not planned yet  |
| `@quasar/app-vite`    | v3.x    | Active      | 2026-06-11 | Not planned yet     | Not planned yet  |
| `@quasar/app-vite`    | v2.x    | Maintenance | 2024-02-08 | 2027-06-11          | 2027-06-11       |
| `@quasar/extras`      | v2.x    | Active      | 2026-05-28 | Not planned yet     | Not planned yet  |
| `@quasar/extras`      | v1.x    | Inactive    | 2019-02-22 | 2026-05-28          | 2026-12-31       |
| `@quasar/vite-plugin` | v1.x    | Active      | 2021-10-25 | Not planned yet     | Not planned yet  |
| `@quasar/cli`         | v5.x    | Active      | 2026-05-28 | Never               | Never            |
| `@quasar/icongenie`   | v6.x    | Active      | 2026-06-12 | Never               | Never            |
| `@quasar/app-webpack` | v4.x    | Deprecated  | 2024-02-08 | 2026-12-31          | 2026-05-08       |

## Major milestones

We are updating this section constantly in order to keep you up to date with our current (and new!) efforts.

_The schedule may change based on unforeseen and/or out of the ordinary circumstances._

### Evergreens

- 🚧 (WIP) Gradually add more automated tests to Quasar UI. **We're searching for contributors**, get in touch with the team on our [Discord server](https://chat.quasar.dev/) if you're willing to help!

### Q3 2026

- ✌️ (DONE) Release of a new major version of `@quasar/app-vite` (v3): [Announcement](https://github.com/quasarframework/quasar/discussions/18295)
- ✌️ (DONE) New Quasar CLI mode: SSG in `@quasar/app-vite` (v3.1): [Announcement](https://github.com/quasarframework/quasar/discussions/18354)
- ✌️ (DONE) Release of `@quasar/icongenie` v6. An important update to handle all edge cases and add support for more iPhones & iPads.
- ✌️ (DONE) Revamp Quasar testing. Full testing for all Quasar packages.

### Q4 2026

- Plans for Quasar v3. We will need your input on some of the decisions that we will be taking for the new major version.
- ✌️ (DONE) Critical CSS path for SSR & SSG dev modes (avoids FOUC on development)

### Q1 2027

- Quasar v3 release, hopefully.

## Archive

### Q2 2026

- ✌️ (DONE) Release of `@quasar/extras` v2
- ✌️ (DONE) Release of `@quasar/cli` v5
- ✌️ (DONE) Release of `@quasar/icongenie` v5

### Q1 2026

- ✌️ (DONE) Release of `@quasar/app-vite` with Vite 8.
- ✌️ (DONE) Replace internal build system: esbuild with Rolldown, cssnano with lightningcss, eslint with oxfmt & oxlint.

### Q1-Q4 2025

- 🚫 (CANCELLED 😢) CLI Auto-routing -- our efforts are superseeded by Vue Router v5 having this out of the box

### Q2-Q4 2024

- ✌️ (DONE) Release of the new major version of `@quasar/app-vite`
- ✌️ (DONE) Release of the new major version of `@quasar/app-webpack`
- ✌️ (DONE) Rewrite Quasar UI automation testing (switching to vitest included)
- ✌️ (DONE) Rewrite internal build system for Quasar UI itself (q/app work included)

### Q1 2024

- ✌️ (DONE) New `@quasar/app-vite` major version -- beta release
- ✌️ (DONE) New `@quasar/app-webpack` major version -- beta release

### Q2-4 2023

- ✌️ (DONE) Support Capacitor 4 and related bugfixes ([#14226](https://github.com/quasarframework/quasar/pull/14226))
- ✌️ (DONE) Add Quasar entry in [Vite ecosystem CI](https://github.com/vitejs/vite-ecosystem-ci)
- June 30th 2023 marks the end of life for Quasar v1. It will no longer receive updates. (postponed for the second time, previously reported EOL was 31th of December 2022)

### Q1 2023

- ✌️ (DONE) Release new Quasar website
- ✌️ (DONE) Porting Quasar packages to ESM
- ✌️ (DONE) Support Vite 3 and 4 in `@quasar/app-vite` ([#14077](https://github.com/quasarframework/quasar/issues/14077)) (already supported via [workaround](https://github.com/quasarframework/quasar/issues/14077#issuecomment-1353213893))
- ✌️ (DONE) Publish official Quasar Organizational chart
- ✌️ (DONE) More triaging automation ([quasarframework/rfcs#10](https://github.com/quasarframework/rfcs/issues/10))
- ✌️ (DONE) Website update community survey

### Q4 2022

- ✌️ (DONE) New Quasar website [preview](https://new-docs.quasar.dev/) 🔥
- ✌️ (DONE) Refactor & enhance QPagination [#14609](https://github.com/quasarframework/quasar/pull/14609)
- ✌️ (DONE) Improve a11y for Quasar components [#14609](https://github.com/quasarframework/quasar/pull/14609)
- ✌️ (DONE) Support Cypress 10/11/12 into Quasar Cypress AE, [check it out](https://github.com/quasarframework/quasar-testing/tree/dev/packages/e2e-cypress)
- ✌️ (DONE) Support Vite 4 in `@quasar/vite-plugin` [#15125](https://github.com/quasarframework/quasar/pull/15125)

### Q3 2022

- ✌️ (DONE) Quasar.Conf 2022 - 9th of July - [Watch](https://bit.ly/qconf2022yt)
- ✌️ (DONE) Quasar v2 TypeScript projects created with Quasar CLI will have all files spawned in .ts format instead of .js for all Quasar modes (_modes had templates only in .js form by default_) ([#8572](https://github.com/quasarframework/quasar/issues/8572))
- ✌️ (DONE) Support PNPM [#13615](https://github.com/quasarframework/quasar/pull/13615)
- 🚫 (BLOCKED, workaround provided) Allow to save starter kit options as JSON profiles ([#5537](https://github.com/quasarframework/quasar/issues/5537))
- ✌️ (DONE) Add Vitest integration via Quasar Vitest AE, [check it out](https://github.com/quasarframework/quasar-testing/tree/dev/packages/unit-vitest)

### Q2 2022

- ✌️ (DONE) Stable release of the new CLI based on Vite.js
- ✌️ (DONE) Support Google Material Symbols ([#13437](https://github.com/quasarframework/quasar/pull/13437))
- ✌️ (DONE) Run automatic tests on Quasar UI via GitHub Actions for every PR [#13432](https://github.com/quasarframework/quasar/pull/13432)
- ✌️ (DONE) [Video tutorials for all Quasar components](https://youtube.com/playlist?list=PLFZAa7EupbB7xC-C0YwYk7aXIAbHYX1Xl). Subscribe at [QuasarCast](https://quasarcast.com/course) to be notified when first-party advanced Quasar paid courses will be available

### Q1 2022

- ✌️ (DONE) First beta of a new CLI for Quasar based on Vite.js instead of Webpack (will have its own life along with the current Webpack-based CLI)
- ✌️ (DONE) Fix intellisense problem for packages provided by `@quasar/app` ([#9235](https://github.com/quasarframework/quasar/issues/9235))
- ✌️ (DONE) Add automatic tests to Quasar UI ([#12047](https://github.com/quasarframework/quasar/pull/12047))
- ✌️ (DONE) Support Pinia out-of-the-box ([#12707](https://github.com/quasarframework/quasar/pull/12707))

### Q4 2021

- ✌️ (DONE) Volar support ([reference](https://github.com/quasarframework/quasar/discussions/10619))
- ✌️ (DONE) Vite.js plugin for Quasar v2 ([reference](https://github.com/quasarframework/quasar/issues/7815))
- ✌️ (DONE) Triaging enhancements ([quasarframework/rfcs#10](https://github.com/quasarframework/rfcs/issues/10))
- ✌️ (DONE) Support Cypress Component Testing into Quasar Cypress AE ([reference](https://github.com/quasarframework/quasar-testing/issues/163) [reference](https://github.com/quasarframework/quasar-testing/pull/185) [reference](https://github.com/quasarframework/quasar/discussions/11496))
- ✌️ (DONE) Enhance Quasar types to be more precise, provide guidelines for community contributions ([#8642](https://github.com/quasarframework/quasar/issues/8642), [#8493](https://github.com/quasarframework/quasar/issues/8493), [#11090](https://github.com/quasarframework/quasar/issues/11090), [#11043](https://github.com/quasarframework/quasar/issues/11043))

### Q3 2021

- ✌️ (DONE) Migration to Quasar v2 of official AEs ([reference](https://github.com/quasarframework/quasar/discussions/9560))
- ✌️ (DONE) Migration to Quasar v2 of most used testing AEs ([`@quasar/testing`](https://github.com/quasarframework/quasar-testing/tree/dev/packages/testing), [`@quasar/testing-unit-jest`](https://github.com/quasarframework/quasar-testing/tree/dev/packages/unit-jest), [`@quasar/testing-e2e-cypress`](https://github.com/quasarframework/quasar-testing/tree/dev/packages/e2e-cypress)) ([reference](https://github.com/quasarframework/quasar/discussions/10341))
- ✌️ (DONE) Quasar brand rework ([reference](https://dev.to/quasar/quasar-brand-refresh-and-new-partnership-ao1))
- 🚫 (CANCELLED 😢) ~~Quasar.Conf 2021~~ ([reference](https://twitter.com/quasarframework/status/1435177368352698375))

### Q2 2021

- ✌️ (DONE) Upgrade the App CLI for Quasar v2 to Webpack v5 ([reference](https://github.com/quasarframework/quasar/issues/8102))
- ✌️ (DONE) Quasar v2 will become officially the "latest" version of Quasar. The documentation website (https://quasar.dev) will point to v2 and the v1 docs will live under https://v1.quasar.dev. The end of life for Quasar v1 will be March 2022 and we will keep on backporting fixes and new features from v2 to it until then.
