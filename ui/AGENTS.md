# ui Agent Guide

Supplements the repo-root `AGENTS.md`. Run all commands from `/ui`, not
`/ui/test`.

## Test specifications

Read `test/README.md` before creating or editing `src/**/*.test.js`.

1. `pnpm test:specs --target <source_file>` (no extension); use a subpath
   relative to `/ui/src` when a filename is ambiguous (`utils/date/date`,
   not `date`).
2. Accept every required case the Specs script offers; never skip or
   ignore one merely to pass validation.
3. Replace every generated `test.todo()` with a real behavioral test; no
   `.todo()`/`.skip()` may remain on any `describe()`/`test()`.
4. Preserve the generated `describe()` statements and identifiers; align
   failing files with the exact hierarchy the script reports.
5. Rerun the same target until the script reports success.
6. Focused Vitest file while developing; root `pnpm test` after editing
   any test file.

If the Specs script itself changes, also run the extra validation from
`test/README.md`: `pnpm test:specs --dry-run`, `pnpm test:specs:check`,
then root `pnpm test`.

### Test design

- Test public behavior and reusable structure, not a snapshot of the
  implementation.
- For generic prop/emit declaration tests, use the `$props()`/`$emits()`
  matchers from `test/vitest.setup.js`; don't duplicate exact names,
  types, defaults, validators or ordering just to prove a declaration
  valid — changing an unrelated prop/event must not break such a test.
- DO assert an exact prop, event, default, validator or payload when that
  specific behavior is the subject of the test.
- Same principle for other exported definitions: prefer structural
  matchers (`$objectValues()`, `$arrayValues()`); if a recurring form has
  no matcher, add a reusable one to `test/vitest.setup.js` instead of
  repeating implementation-specific assertions.
- Keyboard-interaction and ARIA coverage goes in a top-level
  `[Accessibility]` describe, not under the prop describes; `[Generic]`
  is the catch-all for other non-API behavior. These two are the only
  valid hand-written categories (see `test/README.md`).

## Directives

- Never add or remove a directive across renders (conditional
  `withDirectives()`, a vnode key that flips with the condition): Vue does
  not mount a directive that appears on an already-mounted vnode. Keep it
  attached and gate its VALUE. TouchPan/TouchSwipe/TouchHold/TouchRepeat/
  Scroll/ScrollFire/Intersection/Mutation disarm on a non-function value;
  Ripple and ClosePopup disarm on `false` only (ClosePopup treats
  `undefined` as depth 1).

## Accessibility

Component a11y work (roles, `aria-*` state, keyboard maps, focus
handling) follows the WAI-ARIA APG patterns; its tests go in the
`[Accessibility]` describe (see Test design). Any a11y behavior change
must update, in the same change set, the "Accessibility" section of the
component's docs page AND — whenever the one-line summary there stops
matching — the component's matrix row on
`docs/src/pages/options/accessibility.md`.

Localized screen-reader strings are lang-pack keys. Adding one touches:
every `ui/lang/*.js` pack (the ui build validates each pack against
en-US's shape, so none may lag), the strict enumeration in
`src/plugins/lang/Lang.test.js`, both label blocks in
`src/plugins/lang/Lang.json`, and `types/lang.d.ts` (keep new a11y keys
optional so third-party packs still compile). Consumer code needs
optional chaining only for a brand-new lang-pack SECTION (third-party
packs lack it); new keys in existing sections resolve to `undefined`
safely.

## Hydration tests

`pnpm test:hydration` (separate from the Specs workflow): colocated
`src/**/*.hydration.test.js` + sibling `*.hydration.fixtures.js`,
rendered by the built server bundle AND by ui/src — keep `dist` fresh
and fixtures deterministic. The harness contract (takeover rule,
`quasarOptions`, `setupApp`/router) is documented in
`test/hydration/hydrate.js`.

`pnpm test:hydration:pwa` covers the `__QUASAR_SSR_PWA__` gate — the
server-rendered vs PWA-shell boot modes (see `test/hydration-pwa/`).

`pnpm test:e2e:ssr` SSR-loads every playground route in a real browser
and fails on hydration console output — playground pages must keep
their server-rendered data deterministic (no `Math.random()`/`uid()`/
live clocks in SSR markup; client-only data goes in `onMounted`).
Set `E2E_SERVER_URL` to audit an already-running `dev:ssr` session
instead of booting one. `pnpm test:umd` drives `test/umd/` against both
built UMD bundles × both global Vue builds (dev Vue surfaces
runtime-compiler warnings) in a real browser: the window.Quasar surface
vs the src export lists, every lang-pack/icon-set UMD asset, in-DOM
(runtime-compiler) boot, install config and the missing-Vue guard.
`pnpm test:sweep` (on-demand, never part of `pnpm test`) drives the
self-verdicting playground page `/web-tests/regression-sweep` across
chromium (a plain and a touch-capable pass)/firefox/webkit, plus
`--safari` (needs `safaridriver --enable` once) and `--ios` (needs full
Xcode); `SWEEP_SERVER_URL` reuses a running playground dev server.
A NEW scenario must pass `--ios` before handoff, not just the desktop
engines: components that behave differently on touch platforms pass
everywhere else and fail there (QTabs hides its arrows on mobile unless
`mobile-arrows` is set).
`pnpm test` runs all five suites concurrently on dev machines
(serially on CI) via `test/parallel.js`.
