import fs from 'node:fs'
import { join, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import markdownIt from 'markdown-it'

import { parseFrontMatter } from './md/md-parse-utils.js'
import { registerAllParsing, sharedMdOptions } from './md/md-rules.js'
import { capitalize, slugify } from './utils.js'

const apiRE = /<DocApi .*file="([^"]+)".*\n/
const docInstallRE = /<DocInstall /
const hiddenPageRE = /__[a-zA-Z0-9_-]+\.md$/
const thisFolder = import.meta.dirname

const mdPagesDir = join(thisFolder, '../src/pages')
const mdPagesList = globSync('**/*.md', { cwd: mdPagesDir })
  .filter(file => !hiddenPageRE.test(file))
  .map(key => {
    const parts = key.slice(0, -3).split('/')
    const len = parts.length
    const urlParts =
      parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts

    return {
      file: join(mdPagesDir, key),
      menu: urlParts.map(entry => entry.split('-').map(capitalize).join(' ')),
      url: '/' + urlParts.join('/')
    }
  })

function getJsonSize(content) {
  return (content.length / 1024).toFixed(2) + 'kb'
}

// the very pipeline that renders the pages, so a fence the site treats as
// code can never reach the index as prose. Typography stays off: smart
// quotes would make the indexed text stop matching what a reader types.
const mdParser = markdownIt({ ...sharedMdOptions, typographer: false })
registerAllParsing(mdParser)

const levelName = 'l'

let objectID = 1
const getObjectID = () => objectID++

const rankList = new Set()

function parseRank(rank) {
  rankList.add(rank - 1)
  return rank - 1
}

const createIndex = data => ({
  menu: [],
  [levelName + 1]: null,
  [levelName + 2]: null,
  [levelName + 3]: null,
  [levelName + 4]: null,
  [levelName + 5]: null,
  [levelName + 6]: null,
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

const processMarkdown = (tokens, entries, entry) => {
  const contents = []
  let type = 'page-content'
  let parent = { ...entry }

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

      parent = {
        ...parent,
        [levelName + parseRank(Number(token.tag.slice(1)))]:
          inlineText(inline).trim(),
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
    } else if (
      token.type === 'fence' ||
      token.type === 'code_block' ||
      token.type === 'html_block'
    ) {
      // code and raw HTML are structure the renderer owns, so they carry
      // no prose to search through - but a heading introducing nothing
      // else is still an anchor worth finding, so it keeps its entry
      contents.push('')
    }
  })

  // handle last bits on the page
  handleAnchor()
}

function processPage(page, entries) {
  const { file, menu, url } = page

  const contents = fs.readFileSync(file, 'utf8')
  const frontMatter = parseFrontMatter(contents)
  let keys = null

  if (frontMatter.data.keys) {
    keys = frontMatter.data.keys.replaceAll(',', ' ')
  }

  const entryItem = createIndex({
    menu,
    url,
    keys,
    content: frontMatter.data.desc,
    type: 'page-link',
    // a page opting out of the title heading renders no #introduction to
    // scroll to, so its entry has to lead to the page itself
    anchor: frontMatter.data.heading === false ? '' : 'introduction'
  })

  // handle API card (deep heading)
  const apiMatches = contents.match(apiRE)
  if (apiMatches) {
    const name = apiMatches[1] + ' API'
    addItem(entries, {
      ...entryItem,
      l1: name,
      anchor: slugify(name),
      content: null
    })
  }

  // handle Installation card (deep heading)
  if (docInstallRE.test(contents)) {
    addItem(entries, {
      ...entryItem,
      l1: 'Installation',
      anchor: 'installation',
      content: null
    })
  }

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

  const fileName = resolve(thisFolder, '../dist/indices.json')
  const content = JSON.stringify(entries, null, 2)

  try {
    // create the folder if it doesn't exists yet
    fs.mkdirSync(resolve(thisFolder, '../dist'))
  } catch {}

  fs.writeFileSync(fileName, content, () => {})

  const end = Date.now()
  const time = end - start

  console.log('Headings found:', rankList)
  console.log(`Finished ${entries.length} indices in ${time}ms`)
  console.log(`Generated ${fileName}`)
  console.log(`File size: ${getJsonSize(content)}`)
}

run()
