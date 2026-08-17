/**
 * A page's DOM ids do not all come from the markdown. DocPage writes
 * id="introduction" on the page's own h1, DocCardTitle derives one from the
 * title handed to DocApi and DocExample, DocInstall derives one from its own.
 * Each is correct in isolation and none of them can see the others, so a
 * collision only exists here - the md stage is where the page's markdown and
 * the attributes it hands those components are both in view.
 */

import { slugify } from '../utils.js'

// Captures the tag an id sits on, so a heading is told apart from an id a
// page author wrote by hand (flex-playground.md puts one on a demo
// component). `[^>]*?` cannot cross into the next tag, so each id is
// attributed to the tag that opened it.
const idRE = /<(\w[\w-]*)\b[^>]*?\sid="([^"]+)"/g

// The markdown writes each of these on a single line and none of their
// attribute values carries a ">", so stopping at the first one is safe.
const docApiRE = /<DocApi\b([^>]*)>/g
const docInstallRE = /<DocInstall\b([^>]*)>/g
const docExampleRE = /<DocExample\b([^>]*)>/g

function attr(attrs, name) {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1]
}

/**
 * Every id the rendered page can put in the document, tagged with what puts
 * it there: the pair of sources is what tells a heading colliding with its
 * twin apart from a heading colliding with a component.
 *
 * The derivations below mirror their components by necessity; page-ids.test.js
 * pins each one against the component that owns it.
 *
 * @param {string} html the page's rendered markdown
 * @param {object} frontMatter the page's front matter
 * @returns {Array<{ id: string, source: string }>}
 */
export function collectPageIds(html, frontMatter = {}) {
  const ids = []
  const add = (id, source, text, line) => ids.push({ id, source, text, line })

  // What md-plugin-heading wrote down as it rendered each heading, queued per
  // id: two headings reading alike share one id, and it is precisely those
  // two whose lines have to be told apart. Both lists run in document order,
  // so taking the next unused record for an id pairs them off correctly, and
  // a heading with no record (raw <h2> in the markdown) simply gets none.
  const headingSources = new Map()
  for (const heading of frontMatter.headingSources ?? []) {
    const queue = headingSources.get(heading.id)
    if (queue === void 0) headingSources.set(heading.id, [heading])
    else queue.push(heading)
  }

  // DocPage renders the page's own h1 unless the page opts out of it
  if (frontMatter.heading !== false) {
    add('introduction', 'DocPage h1', frontMatter.title)
  }

  for (const [, tag, id] of html.matchAll(idRE)) {
    if (/^h[1-6]$/.test(tag)) {
      const heading = headingSources.get(id)?.shift()
      add(id, 'heading', heading?.text, heading?.line)
    } else {
      add(id, `<${tag}>`)
    }
  }

  // DocApi names its DocCardTitle after the API it loads. That name comes
  // from the API file at runtime; the `file` attribute is what the md stage
  // can see of it, and the TOC entry is built from the same attribute.
  for (const [, attrs] of html.matchAll(docApiRE)) {
    const file = attr(attrs, 'file')
    if (file !== void 0) {
      add(slugify(`${file} API`), 'DocApi', `${file} API`)
    }
  }

  // DocInstall puts the id on its own card, defaulting the title
  for (const [, attrs] of html.matchAll(docInstallRE)) {
    const title = attr(attrs, 'title') ?? 'Installation'
    add(slugify(title), 'DocInstall', title)
  }

  for (const [, attrs] of html.matchAll(docExampleRE)) {
    const title = attr(attrs, 'title')
    const file = attr(attrs, 'file')

    // DocExample folds the file into the prefix it hands DocCardTitle, so two
    // examples keep their ids apart on a title they share. It reads the file
    // unguarded, so an example without one has no id - it throws instead.
    if (title !== void 0 && file !== void 0) {
      add(
        `example--${file.toLowerCase()}--${slugify(title)}`,
        'DocExample',
        title
      )
    }

    // in the document only while the example is expanded - but a page lets
    // the reader expand every one of them at once
    if (file !== void 0) {
      add(`example-src--${slugify(file)}`, 'DocExample source', file)
    }
  }

  return ids
}

/** What the author would call this thing: what it is, plus what they typed */
function nameOf({ source, text }) {
  return text === void 0 || text === '' ? source : `${source} "${text}"`
}

/** Where they wrote it, when the emitter was able to say */
function lineOf({ line }) {
  return line === void 0 ? '' : ` on line ${line}`
}

/** Where a link ends up instead, named the most precise way available */
function reachOf({ line }) {
  return line === void 0 ? 'the first' : `line ${line}`
}

/**
 * Everything wrong with a page's ids, as lists of ready-to-print strings.
 *
 * A TOC key claimed twice is deliberately NOT among them. Every TOC entry is
 * one of the ids collected above, so the only way v-for can be handed one key
 * twice is an id that is already in `duplicates` - saying it again names one
 * fault twice and leaves the reader counting which is which.
 *
 * `orphanTocEntries` is not implicit in the same way: it holds the TOC and the
 * rendered ids against each other, and only the two derivations disagreeing
 * can produce it.
 *
 * @param {string} html the page's rendered markdown
 * @param {object} frontMatter the page's front matter, TOC already collected
 * @returns {{ duplicates: string[], orphanTocEntries: string[] }}
 */
export function findPageIdIssues(html, frontMatter = {}) {
  const ids = collectPageIds(html, frontMatter)
  const toc = frontMatter.toc ?? []

  const owner = new Map()
  const duplicates = []

  for (const entry of ids) {
    const { id } = entry
    const first = owner.get(id)

    if (first === void 0) {
      owner.set(id, entry)
    } else {
      // Written to be searched for as much as read: the words the author
      // typed are quoted, so the offending line can be grepped for in the
      // page without un-slugifying anything, and the id is quoted too.
      duplicates.push(
        `${nameOf(entry)}${lineOf(entry)} takes the id "${id}",` +
          ` already taken by ${nameOf(first)}${lineOf(first)}` +
          ` - a link to #${id} only ever reaches ${reachOf(first)}`
      )
    }
  }

  // the TOC has to name the ids the page rendered, not ids of its own:
  // renumbering one side alone leaves every entry pointing nowhere
  const orphanTocEntries = toc
    .filter(({ id }) => !owner.has(id))
    .map(({ id }) => id)

  return { duplicates, orphanTocEntries }
}

/**
 * The same issues as one flat list of sentences. Both places a page author
 * can be standing - the terminal running the dev server and the page open in
 * the browser - say the same words about the same page, so neither has to be
 * translated into the other.
 *
 * @param {string} html the page's rendered markdown
 * @param {object} frontMatter the page's front matter, TOC already collected
 * @returns {string[]} one line per issue, empty when the page is sound
 */
export function formatPageIdIssues(html, frontMatter = {}) {
  const { duplicates, orphanTocEntries } = findPageIdIssues(html, frontMatter)

  return [
    ...duplicates,
    ...orphanTocEntries.map(
      id =>
        `the table of contents links to #${id}, which no element on the page has`
    )
  ]
}

/**
 * The page a module id belongs to, said the way the author would say it: the
 * path from the docs root, which is both what their editor opens and what
 * they would grep. Vite hands over an absolute path.
 *
 * @param {string} pageId the module id being transformed
 * @returns {string}
 */
export function pageLabel(pageId) {
  const at = pageId.indexOf('src/pages/')
  return at === -1 ? pageId : pageId.slice(at)
}

/**
 * Names each issue on the console the way flat-menu.js names a bad related
 * link. Deliberately not a throw: md-vite-plugin turns one into a Vite
 * overlay and a failed build, which is far too much for a page that renders
 * perfectly well and merely points some of its anchors at the wrong section.
 *
 * One line per issue, each opening with the same `[page-ids]` tag and the
 * page it belongs to, so a run of them can be grepped by tag, by page, or by
 * the quoted id.
 *
 * @param {string[]} issues from formatPageIdIssues
 * @param {string} pageId the module id being transformed
 */
export function reportPageIdIssues(issues, pageId) {
  const label = pageLabel(pageId)

  for (const issue of issues) {
    console.error(`[page-ids] ${label} - ${issue}`)
  }
}
