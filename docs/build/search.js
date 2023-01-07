const fs = require('fs')
const { join } = require('path')
const fg = require('fast-glob')
const path = require('path')
const md = require('markdown-ast')
const { parseFrontMatter } = require('./md/md-parse-utils.js')

const { slugify, capitalize } = require('./utils')

const apiRE = /<doc-api .*file="([^"]+)".*\n/
const installationRE = /<doc-installation /
const hiddenPageRE = /[\\/]__[a-zA-Z0-9_-]+\.md$/

const mdPagesDir = join(__dirname, '../src/pages')
const mdPagesLen = mdPagesDir.length + 1
const mdPagesList = fg.sync(join(mdPagesDir, '**/*.md'))
  .filter(file => hiddenPageRE.test(file) === false)
  .map(key => {
    if (key.indexOf('elements') !== -1) {
      console.log(key)
    }
    const parts = key.substring(mdPagesLen, key.length - 3).split('/')
    const len = parts.length
    const urlParts = parts[ len - 2 ] === parts[ len - 1 ]
      ? parts.slice(0, len - 1)
      : parts

    return {
      file: key,
      menu: urlParts.map(entry => entry.split('-').map(capitalize).join(' ')),
      url: '/' + urlParts.join('/')
    }
  })

function getJsonSize (content) {
  return (content.length / 1024).toFixed(2) + 'kb'
}

const levelName = 'l'

let objectID = 1
const getObjectID = () => objectID++

const rankList = new Set()

function parseRank (rank) {
  rankList.add(rank - 1)
  return rank - 1
}

const createFolder = folder => {
  const dir = path.join(__dirname, '../..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const createIndex = (data) => {
  return {
    menu: [],
    [ levelName + 1 ]: null,
    [ levelName + 2 ]: null,
    [ levelName + 3 ]: null,
    [ levelName + 4 ]: null,
    [ levelName + 5 ]: null,
    [ levelName + 6 ]: null,
    keys: null,
    content: '',
    anchor: '',
    ...data
  }
}

const cleanObject = (item) => {
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
    if (item[ keys[ key ] ] === null) {
      delete item[ keys[ key ] ]
    }
  }
  return item
}

// makes sure there is content before adding to array
const addItem = (entries, item) => {
  entries.push(cleanObject({
    id: getObjectID(),
    ...item
  }))
}

// returns the contents of the associated file
const getFileContents = (mdPath) => {
  const page = path.resolve(__dirname, mdPath)
  return fs.readFileSync(page, {
    encoding: 'utf8'
  })
}

const processNode = (node, prefix = '') => {
  const text = []
  let type = 'page-content'

  if (Array.isArray(node)) {
    node.forEach(leaf => {
      const data = processNode(leaf, prefix)
      text.push(data.text)
    })
  }
  else if (node.type === 'link') {
    const data = processNode(node.block)
    text.push(data.text)
  }
  else if (node.type === 'list' ||
    node.type === 'quote') {
    const data = processNode(node.block, ' ')
    text.push(data.text)
  }
  else if (node.type === 'bold' ||
    node.type === 'italic' ||
    node.type === 'strike') {
    const data = processNode(node.block)
    text.push(data.text)
  }
  else if (node.type === 'title') {
    type = 'page-link'
    const data = processNode(node.block)
    data.type = type
    data.rank = parseRank(node.rank)
    return data
  }
  else if (node.type === 'image' ||
    node.type === 'codeBlock') {
    text.push('')
  }
  else if (node.type === 'codeSpan') {
    text.push(prefix + node.code)
  }
  else if (node.type === 'text' ||
    node.type === 'break' ||
    node.type === 'codeSpan') {
    text.push(prefix + node.text)
  }
  else {
    // unknown/unprocessed node type
    console.log(node)
  }

  return { text: text.join(' ').replace(/\n/g, ''), type }
}

const processMarkdown = (syntaxTree, entries, entry) => {
  const contents = []
  let type = 'page-content'
  let parent = { ...entry }

  const handleAnchor = () => {
    const joiner = type === 'page-list' ? '' : ' '
    if (contents.length > 0) {
      const text = contents.join(joiner)
        // .replace(/\n/g, ' ')
        .replace(/<[^>]*\/>/g, '') // remove self-closing tags
        .replace(/<br>/g, '\n')
        .replace(/\|/g, '')
        .replace(/---/g, '')
        .replace(/::: tip/g, '')
        .replace(/::: warning/g, '')
        .replace(/::: danger/g, '')
        .replace(/:::/g, '')
        .replace(/\s\s+/g, ' ') // change multi-space to 1 space
        .trim()

      if (text === '') {
        // if text is empty, it's a link (ie: H2) with no
        // content, but it will be a parent (ie: to an H3)
        type = 'page-link'
      }
      else if (type === 'page-list') {
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
      contents.splice(0, contents.length)
    }
  }

  syntaxTree.forEach(node => {
    const val = processNode(node)

    if (val.type === 'page-link') {
      handleAnchor()
      parent = {
        ...parent,
        [ levelName + val.rank ]: val.text,
        anchor: slugify(val.text),
        type: val.type
      }
    }
    else {
      contents.push(val.text)
    }

    type = val.type
  })

  // handle last bits on the page
  handleAnchor()
}

function processPage (page, entries) {
  const { file, menu, url } = page

  const contents = getFileContents(file)
  const frontMatter = parseFrontMatter(contents)
  let keys = null

  if (frontMatter.data.keys) {
    keys = frontMatter.data.keys.replace(/,/g, ' ')
  }

  const entryItem = createIndex({
    menu,
    url,
    keys,
    content: frontMatter.data.desc,
    type: 'page-link',
    anchor: 'introduction'
  })

  // handle API card (deep heading)
  const apiMatches = contents.match(apiRE)
  if (apiMatches) {
    const name = apiMatches[ 1 ] + ' API'
    addItem(entries, {
      ...entryItem,
      l1: name,
      anchor: slugify(name),
      content: null
    })
  }

  // handle Installation card (deep heading)
  if (installationRE.test(contents) === true) {
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
  const start = new Date().getTime()

  createFolder('dist')

  const entries = []

  mdPagesList.forEach(page => {
    processPage(page, entries)
  })

  const fileName = path.resolve(__dirname, '../dist/indices.json')
  const content = JSON.stringify(entries, null, 2)
  fs.writeFileSync(fileName, content, () => {})

  const end = new Date().getTime()
  const time = end - start

  console.log('Headings found:', rankList)
  console.log(`Finished ${entries.length} indices in ${time}ms`)
  console.log(`Generated ${fileName}`)
  console.log(`File size: ${getJsonSize(content)}`)
}

run()
