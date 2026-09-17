---
title: Docs Syntax Guide
desc: What a documentation page can be written with, each element rendered next to the source that produces it.
examples: QAvatar
overline: Title overline
badge: title badge
related:
  - /style/spacing
  - /style/visibility
  - /layout/grid/column
  - /layout/grid/gutter
  - /layout/grid/flex-playground
scope:
  tree:
    l: '.'
    c:
      - l: public
        e: Pure static assets (directly copied)
        url: '/quasar-cli-vite/handling-assets#static-assets-public'
      - l: src
        c:
          - l: assets/
            e: Dynamic assets (processed by Vite)
            url: '/quasar-cli-vite/handling-assets#regular-assets-src-assets'
          - l: components/
            e: '.vue components used in pages & layouts'
            url: '/start/how-to-use-vue#vue-single-file-components-sfc'
          - l: css
            e: CSS/Sass/... files for your app
            c:
              - l: app.sass
              - l: quasar.variables.sass
                e: Quasar Sass variables for you to tweak
                url: '/style/sass-scss-variables'
          - l: layouts/
            e: Layout .vue files
            url: '/layout/layout'
          - l: pages/
            e: Page .vue files
          - l: boot/
            e: Boot files (app initialization code)
            url: '/quasar-cli-vite/boot-files'
          - l: router
            e: Vue Router
            url: '/quasar-cli-vite/page-routing-with-vue-router'
            c:
              - l: index.js
                e: Vue Router definition
              - l: routes.js
                e: App Routes definitions
          - l: stores
            e: Pinia Stores
            url: '/quasar-cli-vite/state-management-with-pinia'
            c:
              - l: index.js
                e: Pinia initialization
              - l: '<store>'
                e: Pinia stores...
              - l: '<store>...'
          - l: App.vue
            e: Root Vue component of your App
      - l: index.html
        e: Template for index.html
      - l: src-ssr/
        e: SSR specific code (like production Node.js webserver)
        url: '/quasar-cli-vite/developing-ssr/introduction'
      - l: src-electron/
        e: Electron specific code (like "main" thread)
        url: '/quasar-cli-vite/developing-electron-apps/introduction'
      - l: src-bex/
        e: BEX (browser extension) specific code (like "main" thread)
        url: '/quasar-cli-vite/developing-browser-extensions/introduction'
---

This page is for whoever writes the documentation. Every page under `docs/src/pages` is a markdown file compiled into a Vue component, so it takes markdown, the elements below and any globally registered Quasar component. Each element is rendered here, followed by the source that produces it.

## Frontmatter

Every page starts with a YAML block. `title` and `desc` are required. A test fails on a key that is not in this table and on a value of the wrong shape (`docs/build/md/frontmatter-rules.js`).

| Key        | Purpose                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | The page title (the H1) and the browser title.                                                                                                                        |
| `desc`     | The meta description, also what the search and the AI forms of the docs list the page with.                                                                           |
| `keys`     | The names the page documents (`QTabs,QTab,QRouteTab`): components, plugins, directives, composables, functions. The search and the MCP server match the page by them. |
| `examples` | The folder under `docs/src/examples` holding this page's example components. Required by the example cards.                                                           |
| `related`  | A list of routes rendered as cards at the end of the page. Each must be a page of the menu, or the production build fails.                                            |
| `overline` | A line of text above the title.                                                                                                                                       |
| `badge`    | A badge next to the title.                                                                                                                                            |
| `heading`  | `false` drops the title row, for a page that draws its own.                                                                                                           |
| `editLink` | `false` drops the "edit this page" button.                                                                                                                            |
| `scope`    | Any data, handed to the page as `scope` (see [Tree](#tree)).                                                                                                          |

<details>
<summary>Source</summary>

```yaml
---
title: Docs Syntax Guide
desc: What a documentation page can be written with.
keys: QAvatar
examples: QAvatar
overline: Title overline
badge: title badge
related:
  - /style/spacing
  - /layout/grid/column
---
```

</details>

## The menu

`docs/src/assets/menu.js` is the sidebar, and more than that: the previous / next links at the end of a page follow its order, a `related` route is looked up in it, the search shows its labels as the breadcrumb of a result, and the AI forms write the pages it lists. Every page has to be in it, or in the header links (`docs/src/assets/links.header.js`): a test fails on a page nothing leads to. The exceptions are named in `docs/build/unlisted-pages.js`: this page is one, reached by its URL alone, so it is on no menu, in no search index and in neither of the AI forms.

| Key          | Purpose                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | The label.                                                                                                                                           |
| `path`       | One segment of the route, relative to the parent entry: the page of an entry is the paths from the root down, joined. A group may have none.         |
| `children`   | Makes the entry a group. Only an entry without children is a page.                                                                                   |
| `icon`       | A Material icon name, for a top-level entry.                                                                                                         |
| `badge`      | A small label next to the name, like `new`.                                                                                                          |
| `opened`     | `true` shows the group expanded from the start.                                                                                                      |
| `external`   | `true` for an entry that is not a markdown page: its `path` is then a full URL, or the absolute route of a Vue page of the site (`/layout-builder`). |
| `llmExclude` | Holds the page, or every page of the group, out of the AI forms. See [Whole pages](#whole-pages).                                                    |
| `llmOnly`    | Names the AI forms the page is in. See [Whole pages](#whole-pages).                                                                                  |

The page of an entry is `src/pages/<route>.md`, or `src/pages/<route>/<last segment>.md` when the page has a folder of its own (`layout/layout/layout.md` lives at `/layout/layout`). Tests fail on an entry with no such file, on two entries with the same route, and on an `external` path that is neither a URL nor an absolute route.

```js
{
  name: 'Layout and Grid',
  icon: 'view_quilt',
  path: 'layout',
  children: [
    {
      name: 'Grid System',
      path: 'grid',
      opened: true,
      children: [
        { name: 'Row', path: 'row' }, // src/pages/layout/grid/row.md
        { name: 'Flex Playground', path: 'flex-playground', llmExclude: true }
      ]
    },
    { name: 'Layout', path: 'layout', badge: 'new' }, // src/pages/layout/layout/layout.md
    { name: 'Layout Builder', path: '/layout-builder', external: true }
  ]
}
```

## Headings

An H2 and an H3 make the table of contents of the page. Every heading gets an id slugified from its text, a click on it copies its anchor, and two headings of a page cannot share a text: a duplicate id is reported in dev and fails the production build.

## Heading H2

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading H3

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

#### Heading H4

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

##### Heading H5

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

###### Heading H6

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu `fugiat nulla` pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa [qui officia](/vue-components/badge) deserunt mollit anim id est laborum.

### Heading with badge <q-badge label="v2.32+" />

A version badge goes in a heading only. In a paragraph write "(v2.32+)" as text: a badge inline in prose breaks the render of the page.

<details>
<summary>Source</summary>

```text
### Heading with badge <q-badge label="v2.32+" />
```

</details>

## Links and images

[An internal link](/vue-components/badge) starts with `/` (a route, optionally with a `#anchor`) or with `#` (an anchor of this page, like [Notes and alerts](#notes-and-alerts)) and navigates inside the site. [Anything else](https://github.com/quasarframework/quasar) opens in a new tab. A test follows every internal link and fails on a route or an anchor that does not exist.

An image is served from `docs/public`:

![Flexbox Container](/img/flexbox-container.svg)

<details>
<summary>Source</summary>

```text
[An internal link](/vue-components/badge)
[An anchor of this page](#notes-and-alerts)
[An external link](https://github.com/quasarframework/quasar)

![Flexbox Container](/img/flexbox-container.svg)
```

</details>

## Notes and alerts

A plain blockquote is a neutral note. A blockquote opening with one of GitHub's five alert markers is a colored one, under GitHub's name and hue. Any other marker fails the build.

| Marker         | Label     | Color  | Use it for                                                       |
| -------------- | --------- | ------ | ---------------------------------------------------------------- |
| `[!NOTE]`      | NOTE      | blue   | information worth noticing even when skimming                    |
| `[!TIP]`       | TIP       | green  | optional advice to do something better or more easily            |
| `[!IMPORTANT]` | IMPORTANT | purple | key information needed to succeed                                |
| `[!WARNING]`   | WARNING   | amber  | urgent information needing immediate attention to avoid problems |
| `[!CAUTION]`   | CAUTION   | red    | the risks or negative outcomes of an action                      |

The marker is the first line of the blockquote, alone on it, in uppercase. A first line in bold, alone in its paragraph, is the title of the alert (the docs' own convention: GitHub shows it as a bold line); without it the alert shows the default label of its marker.

> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

> [!NOTE]
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> [!NOTE]
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

> [!TIP]
> **Tip container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> [!TIP]
> **Tip container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

> [!IMPORTANT]
> **Important container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> [!IMPORTANT]
> **Important container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

> [!WARNING]
> **Warning container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> [!WARNING]
> **Warning container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

> [!CAUTION]
> **Caution container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

<details>
<summary>Source</summary>

```text
> [!CAUTION]
> **Caution container title**
>
> For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
>
> - It is important that you specify all sections of a QLayout, even if you don't use them.
> - When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".
```

</details>

### Collapsed details

A collapsed block is a raw `<details>` element. Keep a blank line after the summary and before the closing tag, so what is in between is parsed as markdown.

<details>
<summary>Details container title</summary>

For a full list of our `wonderful` people who make Quasar happen, visit the [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.

- It is important that you specify all sections of a QLayout, even if you don't use them.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

</details>

<details>
<summary>Source</summary>

```html
<details>
  <summary>Details container title</summary>

  For a full list of our `wonderful` people who make Quasar happen, visit the
  [Backers](https://github.com/quasarframework/quasar/blob/dev/backers.md) page.
  - It is important that you specify all sections of a QLayout, even if you
  don't use them. - When QDrawer is set into overlay mode, **it will force it to
  go into fixed position**, regardless if QLayout's "view" prop is configured
  with "l/r" or "L/R".
</details>
```

</details>

## Call to action button

A `<q-btn>` written at the root level of the page, on a line of its own, gets this design with no class or color set on it. One nested in another element, or inside a paragraph, is a regular QBtn.

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

<details>
<summary>Source</summary>

```html
<q-btn
  icon-right="launch"
  label="Layout Builder"
  href="/layout-builder"
  target="_blank"
/>
```

</details>

## Keyboard tokens

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

<details>
<summary>Source</summary>

```html
- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd> - Linux:
<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd> - Windows:
<kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
```

</details>

## Code containers

A fence takes a language and, after it, an optional title for the card. The languages are `bash`, `js`, `ts`, `html` (use it for Vue too), `css`, `sass`, `scss`, `json`, `yaml`, `xml` and `nginx`; no language means plain text.

```js
export default function (ctx) {
  // can be async too
  console.log(ctx)

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO // ✅ It can only replace direct usage like this
}
```

```json A title for the card
{
  "min": 0,
  "super": false,
  "max": 100
}
```

```
No language: plain text
```

```bash
/home/your_user/bin:/home/your_user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/your_user/Android/Sdk/tools:/home/your_user/Android/Sdk/platform-tools
```

<details>
<summary>Source</summary>

````text
```js
export default function (ctx) { // can be async too
  console.log(ctx)

  const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
  process.env.FOO             // ✅ It can only replace direct usage like this
}
```

```json A title for the card
{
  "min": 0,
  "super": false,
  "max": 100
}
```

```
No language: plain text
```

```bash
/home/your_user/bin:/home/your_user/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/home/your_user/Android/Sdk/tools:/home/your_user/Android/Sdk/platform-tools
```
````

</details>

### Line notations

A trailing comment marks its line and is removed from what is shown: `[!code highlight]`, `[!code focus]`, `[!code ++]` and `[!code --]`. The first block below writes its highlighted lines as `dev: true, // [!code highlight]`, the second its changed ones as `"super": false, // [!code --]` and `"super": true, // [!code ++]`. The notations are consumed in every code block, this page's included, so they cannot be shown in one.

```js Using !code highlight and !code focus
export default function (ctx) {
  console.log(ctx) // [!code focus]

  return {
    dev: true, // [!code highlight]
    prod: false // [!code highlight]
  }
}
```

```json Using !code ++ and !code --
{
  "min": 0,
  "super": false, // [!code --]
  "super": true, // [!code ++]
  "max": 100 // [!code ++]
}
```

### Tabs

A `tabs` fence holds several blocks, each opened by a `<<| lang Tab title |>>` line. The title after `tabs` is the title of the card. The AI forms of the docs keep one tab of a group: Composition over Options API, TypeScript over JavaScript, pnpm over the other package managers.

```tabs quasar.config file
<<| js Basic |>>
export default function (ctx) {
  return {
    dev: true,
    prod: false
  }
}
<<| js Another tab |>>
const x = {
  dev: true,
  prod: false
}
<<| json Json |>>
{
  "dev": false,
  "prod": "yeah"
}
```

<details>
<summary>Source</summary>

````text
```tabs quasar.config file
<<| js Basic |>>
export default function (ctx) {
  return {
    dev: true,
    prod: false
  }
}
<<| js Another tab |>>
const x = {
  dev: true,
  prod: false
}
<<| json Json |>>
{
  "dev": false,
  "prod": "yeah"
}
```
````

</details>

### Collapsible regions

Wrap a block in `// #region <label>` and `// #endregion` markers and it renders folded by default. Users can expand it on demand. This is useful for hiding repetitive scaffolding (data arrays, boilerplate) that is needed to make the example run, but not so important when understanding the code. This way, the interesting parts are easier to spot. Supports all languages which use `//`, `/* */` or `<!-- -->` as comment markers, e.g., JavaScript, CSS, HTML, etc. The markers work the same way in the example components under `docs/src/examples`.

```js
function heavySetup() {
  // #region boilerplate
  const a = 1
  const b = 2
  const c = 3
  // #endregion

  return a + b + c
}
```

The source is this same block with a `// #region boilerplate` line before the three constants and a `// #endregion` line after them (the markers fold in any code block, this page's included, so they cannot be shown in one).

## LLM content control

Every page is also written as markdown for AI agents, in two forms: the `.md` sibling the site serves next to each page (`site`), and the slices the `quasar` and `@quasar/app-vite` packages ship for the MCP server (`mcp`). Two tags decide what each form carries.

| Element         | Site HTML | Markdown forms |
| --------------- | --------- | -------------- |
| `<llm-exclude>` | kept      | dropped        |
| `<llm-only>`    | dropped   | kept           |

Both take the same two attributes and nothing else: an attribute they do not know, or a missing `reason`, fails the build.

| Attribute | Required | Purpose                                                                                                                   |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `reason`  | yes      | Why the block is there, for whoever edits the page next. Never emitted.                                                   |
| `when`    | no       | `"site"` or `"mcp"`: the one markdown form the tag applies to. Without it the tag applies to both. Any other value fails. |

| `when`   | `<llm-exclude>`                         | `<llm-only>`                       |
| -------- | --------------------------------------- | ---------------------------------- |
| not set  | dropped from both forms                 | kept in both forms                 |
| `"site"` | dropped from the site's `.md` form only | kept in the site's `.md` form only |
| `"mcp"`  | dropped from the MCP slices only        | kept in the MCP slices only        |

```html
<llm-exclude
  when="mcp"
  reason="the installed package ships the file, pointed at below"
>
  <SassVariables />
</llm-exclude>

<llm-only when="mcp" reason="an agent in a project can read the file itself">
  The list is the `src/css/variables.sass` file of the installed `quasar`
  package.
</llm-only>

<llm-exclude reason="a JS copy of the TS block below"> ... </llm-exclude>
```

- The site HTML never changes with `when`: it always shows `<llm-exclude>` content and never shows `<llm-only>` content.
- Use `<llm-exclude>` for decoration, for interactive tools of the site, and for content that repeats what an agent already has. Add `when="mcp"` when the block links to a page the slices do not carry: the build names that case and asks for it.
- Use `<llm-only when="mcp">` for what only an agent working in a project can use, such as a pointer to a file of the installed package.
- Put the opening and the closing tag on lines of their own, with a blank line before and after the block. The tags pair up and do not nest.
- A tag inside code, a fence or an inline span, is code, which is how this page shows them.

### Whole pages

A page is written to both markdown forms by default. An entry of `docs/src/assets/menu.js`, or of `docs/src/assets/links.header.js` for a page only the header leads to, changes that with two optional flags, the page-wide counterparts of the tags, each `true`, `"site"` or `"mcp"`. `llmExclude` takes the forms it names away (`true` for both). `llmOnly` names the forms the page is in, whatever was inherited: `"site"` or `"mcp"` for that one alone, `true` for both (a page back in under an excluded group). A flag on a group covers every page under it, a deeper flag has the last word, and an entry setting both flags fails the build:

```js
// a page in neither form
{
  name: 'Why donate',
  icon: 'assignment_late',
  path: 'why-donate',
  llmExclude: true
}

// the pages of a group in the site's .md form only, but for two
{
  name: 'Group',
  path: 'group',
  llmOnly: 'site',
  children: [
    { name: 'A page', path: 'a-page' },
    { name: 'In the slices alone', path: 'another', llmOnly: 'mcp' },
    { name: 'In both forms', path: 'third', llmOnly: true }
  ]
}
```

For the MCP slices the flags only say whether a page may be in one: `docs/build/mcp/targets.js` lists the routes each package ships.

The "view as Markdown" button of a page and its `<head>` link follow from the same flags, at build time: a page out of the site form has neither, and there is nothing to set in the page itself.

## Tree

A `<DocTree>` draws a folder structure from a definition the page holds in its frontmatter, under `scope`. A node takes `l` (the label), `e` (an explanation, optional), `url` (a link, optional) and `c` (its children).

<DocTree :def="scope.tree" />

<details>
<summary>Source</summary>

```text
---
scope:
  tree:
    l: '.'
    c:
      - l: public
        e: Pure static assets (directly copied)
        url: '/quasar-cli-vite/handling-assets#static-assets-public'
      - l: src
        c:
          - l: assets/
            e: Dynamic assets (processed by Vite)
          - l: App.vue
            e: Root Vue component of your App
---

<DocTree :def="scope.tree" />
```

</details>

## Table

A markdown table renders as a QMarkupTable. The formatter (`pnpm lint`) aligns the columns.

| Prop name    | Description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `app`        | Vue app instance                                                                                             |
| `router`     | Instance of Vue Router from '/src/router/index.js'                                                           |
| `store`      | Instance of Pinia - **store only will be passed if your project uses Pinia (you have /src/stores)**          |
| `ssrContext` | Available only on server-side, if building for SSR. [More info](/quasar-cli-vite/developing-ssr/ssr-context) |

<details>
<summary>Source</summary>

```text
| Prop name    | Description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `app`        | Vue app instance                                                                                             |
| `router`     | Instance of Vue Router from '/src/router/index.js'                                                           |
| `store`      | Instance of Pinia - **store only will be passed if your project uses Pinia (you have /src/stores)**          |
| `ssrContext` | Available only on server-side, if building for SSR. [More info](/quasar-cli-vite/developing-ssr/ssr-context) |
```

</details>

## List

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

1. Quasar is initialized (components, directives, plugins, Quasar i18n, Quasar icon sets)
2. Quasar Extras get imported (Roboto font -- if used, icons, animations, ...)
3. Quasar CSS & your app's global CSS are imported
4. App.vue is loaded (not yet being used)

Lorem ipsum dolor sit amet, **consectetur adipiscing** elit, sed do _eiusmod_ tempor incididunt ut labore et dolore magna aliqua.

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R".

## Cards

The three cards are written at the root level of the page, each on a line of its own. The installation and the API cards add their own entry to the table of contents.

### Installation card

<DocInstall plugins="AppFullscreen" />

`<DocInstall>` shows how to enable something in each flavour of Quasar. It takes `components`, `directives` and `plugins` (one name, or an array bound with `:plugins="[ ... ]"`), `config` (the key of the `framework.config` object the feature reads) and `title` (the default is "Installation"; a page with two of these cards needs two titles, since the title makes the id).

<details>
<summary>Source</summary>

```html
<DocInstall plugins="AppFullscreen" />
<DocInstall plugins="Notify" config="notify" />
<DocInstall title="Configuration" config="dark" />
```

</details>

### API card

<DocApi file="QSelect" />

`<DocApi>` renders the API of a component, directive or plugin from its JSON descriptor. `file` is the name of the descriptor, without the extension: the ones the `quasar` package builds into `ui/dist/api`. The AI forms of the docs replace the card with the same API as text, so never repeat it in prose.

<DocApi file="TouchSwipe" />

<DocApi file="Loading" />

<details>
<summary>Source</summary>

```html
<DocApi file="QSelect" />
<DocApi file="TouchSwipe" />
<DocApi file="Loading" />
```

</details>

### Example card

<DocExample title="Title for example card" file="StandardSizes" />

`<DocExample>` mounts a component of the folder the `examples` frontmatter key names (`docs/src/examples/QAvatar/StandardSizes.vue` here) and shows its source. `file` is the name of the component without the extension, and it makes the ids of the card: a page cannot show the same example twice. The optional flags are `no-edit` (no "Edit in Codepen" button, for an example Codepen cannot run), `scrollable` (a fixed 500px tall, scrolling content area) and `overflow` (the content may scroll horizontally). The AI forms of the docs inline the source of the example in place of the card.

<details>
<summary>Source</summary>

```text
---
examples: QAvatar
---

<DocExample title="Title for example card" file="StandardSizes" />
<DocExample title="Inside a tall layout" file="StandardSizes" scrollable />
<DocExample title="Not for Codepen" file="StandardSizes" no-edit />
```

</details>

## Script doc

A page is compiled into a Vue single file component, and a `<script doc>` block is added to its `<script setup>`. Use it to import a component of the docs that is not registered globally, or to declare what the markup below it uses. One block per page is enough, anywhere at the root level; the AI forms of the docs drop it.

<details>
<summary>Source</summary>

```html
<script doc>
  import { ref } from 'vue'
  import ThemePicker from './ThemePicker.vue'

  const counter = ref(0)
</script>

<ThemePicker />

<q-btn label="Count" @click="counter++" />
```

</details>

## Vue in a page

Since the page is a Vue template, a few things follow:

- Any globally registered Quasar component can be written in the page, `<q-badge>` and `<q-btn>` included. The AI forms of the docs know the elements of this page; a component of the site they have not been taught stops their build, asking for a handler or for an `<llm-exclude>` around it.
- Mustache interpolation is live in prose and in inline code. Show it in a fenced code block instead, where it is safe:

```html
<div>{{ message }}</div>
```

- A raw HTML tag in prose is an element. To name one, put it in inline code, like `<q-btn>`.
