import fs from 'node:fs'
import { join, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import md from 'markdown-ast'

import { parseFrontMatter } from './md/md-parse-utils.js'
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

// a hand-written tag's attributes are layout, and they were reaching the
// index as prose (an <img> contributed its src and style). Only a tag
// holding a quoted attribute value is removed, which is what separates
// markup from the angle brackets these pages legitimately talk about:
// Promise<void | RolldownOptions>, <T = any>, a placeholder such as
// <ext-id>, or a sentence naming a <script> tag. Runs on text nodes
// rather than on the joined result so a code span keeps its own.
const stripHtmlTags = str =>
  str
    .replaceAll(/<br\s*\/?>/g, '\n')
    .replaceAll(/<\/?[a-zA-Z][a-zA-Z0-9-]*\s[^<>]*=\s*["'][^<>]*>/g, '')

const processNode = (node, prefix = '') => {
  const text = []
  let type = 'page-content'

  if (Array.isArray(node)) {
    node.forEach(leaf => {
      const data = processNode(leaf, prefix)
      text.push(data.text)
    })
  } else if (node.type === 'link') {
    const data = processNode(node.block)
    text.push(data.text)
  } else if (node.type === 'list' || node.type === 'quote') {
    const data = processNode(node.block, ' ')
    text.push(data.text)
  } else if (
    node.type === 'bold' ||
    node.type === 'italic' ||
    node.type === 'strike'
  ) {
    const data = processNode(node.block)
    text.push(data.text)
  } else if (node.type === 'title') {
    type = 'page-link'
    const data = processNode(node.block)
    data.type = type
    data.rank = parseRank(node.rank)
    return data
  } else if (node.type === 'image' || node.type === 'codeBlock') {
    text.push('')
  } else if (node.type === 'codeSpan') {
    text.push(prefix + node.code)
  } else if (node.type === 'text' || node.type === 'break') {
    text.push(prefix + stripHtmlTags(node.text))
  } else if (node.type === 'linkDef') {
    // do nothing
  } else {
    // unknown/unprocessed node type
    console.error('Unprocessed:', node)
  }

  return { text: text.join(' ').replaceAll('\n', ''), type }
}

const processMarkdown = (syntaxTree, entries, entry) => {
  const contents = []
  let type = 'page-content'
  let parent = { ...entry }

  const handleAnchor = () => {
    const joiner = type === 'page-list' ? '' : ' '
    if (contents.length !== 0) {
      const text = contents
        .join(joiner)
        // .replace(/\n/g, ' ')
        // a tag holding markdown (e.g. <DocExample title="a-[b] slot" />)
        // is split across nodes, so it only becomes strippable once the
        // pieces are joined back together
        .replaceAll(/<[^>]*\/>/g, '') // remove self-closing tags
        .replaceAll('<br>', '\n')
        .replaceAll('|', '')
        .replaceAll('---', '')
        .replaceAll('::: tip', '')
        .replaceAll('::: warning', '')
        .replaceAll('::: danger', '')
        .replaceAll(':::', '')
        .replaceAll(/\s\s+/g, ' ') // change multi-space to 1 space
        .trim()

      if (text === '') {
        // if text is empty, it's a link (ie: H2) with no
        // content, but it will be a parent (ie: to an H3)
        type = 'page-link'
      } else if (type === 'page-list') {
        // page-list is needed because lists have no breaks
        // when the text is joined, we need it done with a space
        // here, we translate back to page-content
        type = 'page-content'
      }

      // handle text from previous
      addItem(entries, { ...parent, content: text, type })

      // start a new index
      parent = { ...parent, content: '' }

      // clean up contents array
      contents.splice(0)
    }
  }

  syntaxTree.forEach(node => {
    const val = processNode(node)

    if (val.type === 'page-link') {
      handleAnchor()
      parent = {
        ...parent,
        [levelName + val.rank]: val.text,
        anchor: slugify(val.text),
        type: val.type
      }
    } else {
      contents.push(val.text)
    }

    type = val.type
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

  // get markdown ast
  const ast = md(frontMatter.content)

  // process ast
  processMarkdown(ast, entries, entryItem)
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
