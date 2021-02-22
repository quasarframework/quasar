const fs = require('fs')
const path = require('path')
const md = require('markdown-ast')
const { parseFrontMatter } = require('./md-loader-utils.js')

const { slugify } = require('./utils')

const levelName = 'l'

// get the menu from assets folder
const menu = require('../src/assets/menu.js')

// where the markdown lives
const intro = '../src/pages'

let objectID = 1
const getObjectID = () => objectID++

const rankList = new Set()

function parseRank (rank) {
  rankList.add(rank - 1)
  return rank - 1
}

const createFolder = (folder) => {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const createIndex = (data) => {
  return {
    group: null,
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

  syntaxTree.forEach((node, index) => {
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

const processPage = (page, entry, entries) => {
  const contents = getFileContents(page)
  const frontMatter = parseFrontMatter(contents)
  let keys = null

  if (frontMatter.data.keys) {
    keys = frontMatter.data.keys.split(',').join(' ')
  }

  const entryItem = createIndex({
    ...entry,
    keys,
    content: frontMatter.data.desc,
    type: 'page-link',
    anchor: 'introduction'
  })

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
          entryChild = {
            ...entry,
            menu: entry.menu.concat(menuItem.name),
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
  const entryItem = createIndex({
    group: menuItem.name,
    url: '/' + menuItem.path
  })

  if (menuItem.external !== true) {
    if (menuItem.children) {
      const entryChild = {
        ...entryItem,
        anchor: slugify(menuItem.name)
      }
      processChildren(menuItem, entryChild, entries)
    }
    else {
      processPage(intro + entryItem.url + '.md', entryItem, entries)
    }
  }
}

function getJsonSize (content) {
  return (content.length / 1024).toFixed(2) + 'kb'
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
