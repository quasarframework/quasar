const fs = require('fs')
const path = require('path')
const md = require('markdown-ast')
const { parseFrontMatter } = require('./md-loader-utils.js')

const { slugify } = require('./utils')

const levelName = 'l'
const stripEmptyContent = true

// get the menu from assets folder
const menu = require(path.resolve(__dirname, '../src/assets/menu.js'))

// where the markdown lives
const intro = '../src/pages'

let objectID = 1
const getObjectID = () => objectID++

const createFolder = (folder) => {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const createIndex = (data) => {
  const requiredFields = [ levelName + '0', 'url' ]
  const missingFields = requiredFields.filter(
    (requiredField) => !data[ requiredField ]
  )
  if (missingFields.length) {
    throw new Error(
      `Missing fields for indexing page ${data.url}: ${missingFields.join(
        ', '
      )}`
    )
  }
  return {
    id: getObjectID(),
    [ levelName + '0' ]: null,
    [ levelName + '1' ]: null,
    [ levelName + '2' ]: null,
    [ levelName + '3' ]: null,
    [ levelName + '4' ]: null,
    [ levelName + '5' ]: null,
    [ levelName + '6' ]: null,
    keys: null,
    content: null,
    anchor: null,
    ...data
  }
}

const cleanObject = (item) => {
  const keys = Object.keys(item)
  for (const key in keys) {
    if (item[ keys[ key ] ] === null) {
      delete item[ keys[ key ] ]
    }
  }
  return item
}

const getNextLevel = (item, text) => {
  for (let index = 0; index < 7; ++index) {
    if (item[ levelName + index ] === void 0 || item[ levelName + index ] === text) {
      return index
    }
  }
  return 6 // highest
}

// makes sure there is content before adding to array
const addItem = (entries, item) => {
  if (stripEmptyContent === true && (item.content === null || item.content === '')) {
    return
  }
  entries.push(cleanObject(createIndex(item)))
}

// returns the contents of the associated file
const getFileContents = (mdPath) => {
  const page = path.resolve(__dirname, mdPath)
  return fs.readFileSync(page, {
    encoding: 'utf8'
  })
}

const processNode = (node, entry, prefix = '') => {
  const text = []
  let type = 'page-content'

  if (Array.isArray(node)) {
    node.forEach(leaf => {
      const data = processNode(leaf, entry, prefix)
      text.push(data.text)
    })
  }
  else if (node.type === 'link') {
    const data = processNode(node.block, entry)
    text.push(data.text)
  }
  else if (node.type === 'list' ||
    node.type === 'quote') {
    type = 'page-list'
    const data = processNode(node.block, entry, ' ')
    text.push(data.text)
  }
  else if (node.type === 'bold' ||
    node.type === 'italic' ||
    node.type === 'strike') {
    const data = processNode(node.block, entry)
    text.push(data.text)
  }
  else if (node.type === 'title') {
    type = 'page-heading'
    const data = processNode(node.block, entry)
    const level = getNextLevel(entry, data.text)
    const entryItem = {
      [ levelName + (level) ]: data.text,
      anchor: slugify(data.text)
    }
    return entryItem
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

      // handle text from previous
      addItem(entries, { ...parent, content: text, type })

      // start a new index
      parent = { ...entry, content: '' }

      // clean up contents array
      contents.splice(0, contents.length)
    }
  }

  syntaxTree.forEach((node, index) => {
    const val = processNode(node, parent)

    if (val.anchor || type !== val.type) {
      handleAnchor()
      if (val.anchor) {
        parent = { ...parent, ...val }
      }
      else {
        contents.push(val.text)
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

const processPage = (page, entry, entries) => {
  const contents = getFileContents(page)
  const frontMatter = parseFrontMatter(contents)
  let keys = null

  if (frontMatter.data.keys) {
    keys = frontMatter.data.keys.split(',').join(' ')
  }

  const entryItem = {
    ...entry,
    keys,
    l0: frontMatter.data.title,
    content: frontMatter.data.desc,
    type: 'page-link',
    anchor: 'introduction'
  }

  addItem(entries, entryItem)

  // get markdown ast
  const ast = md(frontMatter.content)

  // process ast
  processMarkdown(ast, entries, entryItem)
}

// process child entries from menu.js
const processChildren = (parent, entry, entries) => {
  if (parent.children) {
    parent.children.forEach(menuItem => {
      if (menuItem.external !== true) {
        let entryChild = { ...entry }
        if (menuItem.path) {
          const level = getNextLevel(entry, menuItem.name)
          entryChild = {
            ...entry,
            [ levelName + (level) ]: menuItem.name,
            url: entry.url + '/' + menuItem.path,
            anchor: slugify(menuItem.name)
          }
        }

        if (menuItem.children) {
          processChildren(menuItem, entryChild, entries)
        }
        else {
          processPage(intro + entryChild.url + '.md', entryChild, entries)
        }
      }
    })
  }
}

const processMenuItem = (menuItem, entries) => {
  let level = 0
  const entryItem = {
    [ levelName + level ]: menuItem.name,
    content: '',
    anchor: '',
    url: '/' + menuItem.path
  }

  if (menuItem.external !== true) {
    if (menuItem.children) {
      level = getNextLevel(entryItem, menuItem.name)
      const entryChild = {
        ...entryItem,
        [ levelName + level ]: menuItem.name,
        anchor: slugify(menuItem.name)
      }
      processChildren(menuItem, entryChild, entries)
    }
    else {
      processPage(intro + entryItem.url + '.md', entryItem, entries)
    }
  }
}

// -- Begin processing

const run = () => {
  const start = new Date().getTime()

  createFolder('dist')

  const fileName = path.resolve(__dirname, '../dist/indices.json')
  const entries = []

  menu.forEach(item => {
    processMenuItem(item, entries)
  })

  fs.writeFileSync(fileName, JSON.stringify(entries, null, 2), () => {})

  const end = new Date().getTime()
  const time = end - start
  console.log(`Finished ${entries.length} indices in ${time}ms`)
  console.log(`Generated ${fileName}`)
}

run()
