import fs from 'node:fs'
import { join, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import markdownIt from 'markdown-it'

import menu from '../src/assets/menu.js'
import { parseFrontMatter } from './md/md-parse-utils.js'
import { sharedMdOptions } from './md/md-rules.js'
import mdPluginBlockquote from './md/md-plugin-blockquote.js'
import { capitalize, slugify } from './utils.js'

const hiddenPageRE = /__[a-zA-Z0-9_-]+\.md$/
const thisFolder = import.meta.dirname

// the nav's own labels, leaf included, by page url
const menuByUrl = {}

function menuWalk(node, path, names) {
  const url = path + (node.path ? `/${node.path}` : '')
  const trail = [...names, node.name]

  if (node.children !== void 0) {
    node.children.forEach(n => {
      menuWalk(n, url, trail)
    })
  } else if (!node.external) {
    menuByUrl[url] = trail
  }
}

menu.forEach(n => {
  menuWalk(n, '', [])
})

const mdPagesDir = join(thisFolder, '../src/pages')
const mdPagesList = globSync('**/*.md', { cwd: mdPagesDir })
  .filter(file => !hiddenPageRE.test(file))
  .map(key => {
    const parts = key.slice(0, -3).split('/')
    const len = parts.length
    const urlParts =
      parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts
    const url = '/' + urlParts.join('/')

    return {
      file: join(mdPagesDir, key),
      url,
      menu: menuByUrl[url],
      // for a page the nav leaves out: its folders' names, then its title
      parents: urlParts
        .slice(0, -1)
        .map(entry => entry.split('-').map(capitalize).join(' '))
    }
  })

function getJsonSize(content) {
  return (content.length / 1024).toFixed(2) + 'kb'
}

// the very pipeline that renders the pages, so a fence the site treats as
// code can never reach the index as prose. The blockquote plugin is the
// one that strips the alert markers. Typography stays off: smart quotes
// would make the indexed text stop matching what a reader types.
const mdParser = markdownIt({ ...sharedMdOptions, typographer: false }).use(
  mdPluginBlockquote
)

const levelName = 'l'
const maxLevel = 6

let objectID = 1
const getObjectID = () => objectID++

const rankList = new Set()

function parseRank(rank) {
  rankList.add(rank - 1)
  return rank - 1
}

// a heading opening at `rank` ends every section nested below it
function levelsBelow(rank) {
  const levels = {}
  for (let level = rank + 1; level <= maxLevel; level++) {
    levels[levelName + level] = null
  }
  return levels
}

const createIndex = data => ({
  menu: [],
  title: null,
  ...levelsBelow(0),
  keys: null,
  content: '',
  anchor: '',
  ...data
})

const cleanObject = item => {
  if (item.content === '') {
    delete item.content
  }

  if (item.menu.length === 0) {
    delete item.menu
  }

  item.url = item.url + (item.anchor ? '#' + item.anchor : '')
  delete item.anchor

  const keys = Object.keys(item)
  for (const key in keys) {
    if (item[keys[key]] === null) {
      delete item[keys[key]]
    }
  }
  return item
}

// makes sure there is content before adding to array
const addItem = (entries, item) => {
  entries.push(
    cleanObject({
      id: getObjectID(),
      ...item
    })
  )
}

/**
 * The prose an inline token holds. Emphasis, links and the rest are
 * structure rather than words, so only their text survives; inline code
 * does count as content, since a page documenting `<img>` has to stay
 * findable by it. Raw HTML contributes nothing - it is layout, and it is
 * what used to reach the index as searchable text.
 */
function inlineText(token) {
  let out = ''

  for (const child of token.children || []) {
    if (child.type === 'text' || child.type === 'code_inline') {
      out += child.content
    } else if (child.type === 'softbreak' || child.type === 'hardbreak') {
      out += ' '
    }
  }

  return out
}

// the heading pipeline derives the rendered id from every child's raw
// content, so the anchor has to be built from the same string
const rawInlineText = token =>
  (token.children || []).reduce((acc, child) => acc + child.content, '')

const cardRE = /<(DocApi|DocInstall|DocExample)\b([^>]*)>/g
const attr = (attrs, name) =>
  new RegExp(`\\b${name}="([^"]*)"`).exec(attrs)?.[1]

/**
 * The card headings a raw HTML block renders through the page's components,
 * each an anchor to find. The ids mirror the components (DocCardTitle,
 * DocInstall) the way build/md/page-ids.js does.
 */
function* cardHeadings(html) {
  for (const [, tag, attrs] of html.matchAll(cardRE)) {
    if (tag === 'DocApi') {
      const file = attr(attrs, 'file')
      if (file !== void 0) {
        const title = `${file} API`
        yield { title, anchor: slugify(title) }
      }
    } else if (tag === 'DocInstall') {
      const title = attr(attrs, 'title') ?? 'Installation'
      yield { title, anchor: slugify(title) }
    } else {
      const title = attr(attrs, 'title')
      const file = attr(attrs, 'file')
      if (title !== void 0 && file !== void 0) {
        yield {
          title,
          anchor: `example--${file.toLowerCase()}--${slugify(title)}`
        }
      }
    }
  }
}

const processMarkdown = (tokens, entries, entry) => {
  const contents = []
  let type = 'page-content'
  let parent = { ...entry }
  // the heading the walk is under: how deep, and what it says
  let rank = 0
  let headingText = ''

  const handleAnchor = () => {
    if (contents.length !== 0) {
      const text = contents
        .join(' ')
        .replaceAll(/\s\s+/g, ' ') // change multi-space to 1 space
        .trim()

      if (text === '') {
        // if text is empty, it's a link (ie: H2) with no
        // content, but it will be a parent (ie: to an H3)
        type = 'page-link'
      }

      // handle text from previous
      addItem(entries, { ...parent, content: text, type })

      // start a new index
      parent = { ...parent, content: '' }

      // clean up contents array
      contents.splice(0)
    }
  }

  tokens.forEach((token, index) => {
    if (token.type === 'heading_open') {
      handleAnchor()

      const inline = tokens[index + 1]
      rank = parseRank(Number(token.tag.slice(1)))
      headingText = inlineText(inline).trim()

      parent = {
        ...parent,
        ...levelsBelow(rank),
        [levelName + rank]: headingText,
        anchor: slugify(rawInlineText(inline)),
        type: 'page-link'
      }

      // a heading is a place to navigate to whether or not it introduces
      // prose, so it always opens a section of its own
      contents.push('')
      type = 'page-link'
    } else if (token.type === 'inline') {
      // the inline of a heading was consumed with it above
      if (tokens[index - 1]?.type === 'heading_open') return

      contents.push(inlineText(token))
      type = 'page-content'
    } else if (token.type === 'blockquote_open') {
      // an alert's title is the page's prose when the page wrote it; the
      // default label is not
      if (token.meta?.ownTitle) {
        contents.push(inlineText(mdParser.parseInline(token.meta.title, {})[0]))
      }
    } else if (token.type === 'fence' || token.type === 'code_block') {
      // code is structure the renderer owns, so it carries no prose to
      // search through - but a heading introducing nothing else is still
      // an anchor worth finding, so it keeps its entry
      contents.push('')
    } else if (token.type === 'html_block') {
      // raw HTML is layout, not prose; what it does carry is the card
      // headings the page's components render, one level under the
      // heading the block sits in
      for (const card of cardHeadings(token.content)) {
        // an example named after its heading is where that heading's
        // entry already leads
        if (card.title.toLowerCase() === headingText.toLowerCase()) continue

        addItem(entries, {
          ...parent,
          [levelName + (rank + 1)]: card.title,
          anchor: card.anchor,
          content: null,
          type: 'page-link'
        })
      }

      contents.push('')
    }
  })

  // handle last bits on the page
  handleAnchor()
}

function processPage(page, entries) {
  const { file, parents, url } = page

  const contents = fs.readFileSync(file, 'utf8')
  const frontMatter = parseFrontMatter(contents)
  const { title, desc, keys, heading } = frontMatter.data

  const entryItem = createIndex({
    menu: page.menu ?? [...parents, title],
    title,
    url,
    keys: keys ? keys.replaceAll(',', ' ') : null,
    content: desc,
    type: 'page-link',
    // a page opting out of the title heading renders no #introduction to
    // scroll to, so its entry has to lead to the page itself
    anchor: heading === false ? '' : 'introduction'
  })

  addItem(entries, entryItem)

  processMarkdown(mdParser.parse(frontMatter.content, {}), entries, entryItem)
}

// -- Begin processing

const run = () => {
  const start = Date.now()

  const entries = []

  mdPagesList.forEach(page => {
    processPage(page, entries)
  })

  const distDir = resolve(thisFolder, '../dist')
  const fileName = join(distDir, 'indices.json')
  const content = JSON.stringify(entries, null, 2)

  fs.mkdirSync(distDir, { recursive: true })
  fs.writeFileSync(fileName, content)

  const end = Date.now()
  const time = end - start

  console.log('Headings found:', rankList)
  console.log(`Finished ${entries.length} indices in ${time}ms`)
  console.log(`Generated ${fileName}`)
  console.log(`File size: ${getJsonSize(content)}`)
}

run()
