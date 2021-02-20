const fs = require('fs')
const path = require('path')
const SimpleMarkdown = require('simple-markdown')
const { parseFrontMatter } = require('./md-loader-utils.js')

const { slugify } = require('./utils')

const levelName = 'l'
const stripEmptyContent = true

// get the menu from assets folder
const menu = require(path.resolve(__dirname, '../src/assets/menu.js'))

// markdown parser (not perfect, but works well enough)
const mdParse = SimpleMarkdown.defaultBlockParse

// // eslint-disable-next-line no-useless-escape
// const yamlBlockPattern = /^(?:\-\-\-)(.*?)(?:\-\-\-|\.\.\.)/s

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

// responsible for collecting the text
const buildParagraph = (content, remaining = '', skip = 0) => {
  const text = []

  const addText = (data) => {
    text.push(data)
  }

  addText(remaining)

  content.forEach((node, index) => {
    if (index >= skip) {
      if (node.type === 'text' || node.type === 'inlineCode') {
        addText(node.content)
      }
      else {
        if (node.content && Array.isArray(node.content)) {
          const data = buildParagraph(node.content)
          addText(data.text)
        }
        else if (node.items && Array.isArray(node.items)) {
          node.items.forEach(leaf => {
            const data = buildParagraph(leaf)
            addText(data.text)
          })
        }
        else {
          if (node.type !== 'image' && node.type !== 'codeBlock') {
            console.log('Unknown node:', node)
          }
        }
      }
    }
  })

  return { text: text.join('') }
}

const processNode = (node, entry) => {
  const text = []
  let type = 'page-content'
  if (Array.isArray(node)) {
    node.forEach(leaf => {
      const data = processNode(leaf)
      text.push(data.text)
    })
  }
  else if (node.type === 'list' && node.items && Array.isArray(node.items)) {
    type = 'page-list'
    node.items.forEach(leaf => {
      const data = buildParagraph(leaf)
      text.push('* ' + data.text)
    })
  }
  else if (node.type === 'paragraph' && Array.isArray(node.content)) {
    if (node.content[ 0 ].type === 'text' && node.content[ 0 ].content.startsWith('#')) {
      let text = ''
      let remaining = ''
      let index = 0
      for (; index < node.content.length; ++index) {
        let content = node.content[ index ].content
        if (Array.isArray(content)) {
          content = buildParagraph(content).text
        }
        const parts = content.split('\n')
        text += parts[ 0 ]
        if (parts.length > 1) {
          parts.shift()
          remaining += parts.join('')
          break
        }
      }
      const level2 = text.indexOf(' ')
      const subheading = text.slice(level2 + 1)
      const level = getNextLevel(entry, subheading)
      const entryItem = {
        [ levelName + (level) ]: subheading,
        anchor: slugify(subheading)
      }
      const data = buildParagraph(node.content, remaining, index + 1)
      entryItem.content = data.text
      return entryItem
    }

    const data = buildParagraph(node.content)
    text.push(data.text)
  }
  else if (node.type === 'heading') {
    type = 'page-heading'
    const data = buildParagraph(node.content)
    const subheading = data.text
    const level = getNextLevel(entry, subheading)
    const id = {
      [ levelName + (level) ]: subheading,
      anchor: slugify(subheading)
    }
    return id
  }
  else if (node.type === 'blockQuote') {
    // type = 'page-quote'
    type = 'page-content'
    const data = processNode(node.content, entry)
    text.push(data.text)
  }
  else {
    if (node.type !== 'table' && node.type !== 'codeBlock' && node.type !== 'newline') {
      const data = buildParagraph(node.content)
      text.push(data.text)
    }
  }
  return { text: text.join(' '), type }
}

const processTip = (val) => {
  const start = val.text.indexOf('\n')
  const end = val.text.lastIndexOf('\n')
  // val.type = 'page-tip'
  val.type = 'page-content'
  val.text = val.text.substr(start + 1, val.text.length - start - (val.text.length - end) - 1)
  return val
}

const processMarkdown = (syntaxTree, entries, entry) => {
  const contents = []
  let type = 'page-content'
  let parent = { ...entry }

  const handleAnchor = (val = null) => {
    const joiner = type === 'page-list' ? '' : ' '
    if (contents.length > 0) {
      const text = contents.join(joiner)
        // .replace(/\n/g, ' ')
        .replace(/<br>/g, '\n')
        .replace(/\|/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/::: tip/g, '')
        .replace(/---/g, '')
        .replace(/::: warning/g, '')
        .replace(/::: danger/g, '')
        .replace(/:::/g, '')
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
    let val = processNode(node, parent)

    if (val.text !== void 0 && val.text !== '') {
      if (val.text.startsWith(':::') && val.text.endsWith(':::')) {
        val = processTip(val)
      }

      if (val.anchor || type !== val.type) {
        handleAnchor(val)
        contents.push(val.text)
      }
      // don't accept components embedded into the page
      else if (val.text.charAt(0) !== '<' && val.text.charAt(val.text.length - 1) !== '>') {
        contents.push(val.text)
      }

      type = val.type
    }
  })

  // handle last bits on the page
  handleAnchor()
}

const processPage = (page, entry, entries) => {
  const md = getFileContents(page)
  const frontMatter = parseFrontMatter(md)
  let keys = null

  if (frontMatter.data.keys) {
    keys = frontMatter.data.keys.split(',').join(' ')
  }

  const entryItem = {
    ...entry,
    keys,
    l0: frontMatter.data.title,
    content: frontMatter.data.desc,
    type: 'page-header',
    anchor: 'introduction'
  }

  addItem(entries, entryItem)

  const syntaxTree = mdParse(frontMatter.content)
  processMarkdown(syntaxTree, entries, entryItem)
}

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
