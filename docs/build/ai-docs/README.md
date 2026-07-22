# AI Docs Extractor

Converts `docs/src/pages/**/*.md` (Quasar-flavored markdown with custom Vue tags) into standalone, LLM-friendly markdown in `dist/`.

## Run

```bash
# from docs/
pnpm generate:ai-docs
pnpm test
```

Requires `ui/dist/api/*.json` (build the UI package first).

## How it works

markdown-it parses each page with the same parsing rules as the live site (`../md/md-rules.js`). A token walker (`emit/walker.js`) serializes the tokens back to plain markdown through registered emitters. No HTML round-trip.

- `emit/prose.js` — standard markdown constructs
- `emit/containers.js` — `::: tip/warning/danger` → GitHub alerts, `::: details` → `<details>`
- `emit/tabs.js` — prunes tab groups (Composition > Options, TS > JS, pnpm > yarn/npm)
- `emit/doc-*.js` — Quasar tags (DocApi, DocExample, DocInstall, DocTree, DocLink)
- `api-render/` — renders `ui/dist/api` JSON as indented-bullet API docs
- `emit/collapse-markers.js` — `#region`/`#endregion` blocks in examples → placeholder
- `emit/llm-content-control.js` — `<llm-only>` / `<llm-exclude>` source tags

Page selection comes from the site menu (`menu.js`: flat-menu + header links). Non-menu pages are reported as orphans and skipped.

## Serving

`pnpm build` copies `dist/` into the SSG output, so the docs deploy ships a `.md` sibling for every page (`/vue-components/button.md`) plus `/llms.txt`. Also, in the hosting layer (outside the repo):

- Make sure `.md` files are served with `Content-Type: text/markdown; charset=utf-8`.
- Optional, but nice to have: when a page is requested with an `Accept: text/markdown` header, respond with a 302 to the `.md` sibling. Send `Vary: Accept` on that response so that the CDN caches stay valid.

## Warnings

`fatal` (page failed) and `config` (broken handler or build input) fail the build. `source` (docs authoring issues) don't.

## Adding a tag handler

Create `emit/doc-foo.js` exporting a handler factory, register it in `registerAllEmitters()` in `extract.js`. See `emit/doc-link.js` for the smallest example.
