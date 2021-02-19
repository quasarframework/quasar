const fs = require('fs')
const path = require('path')
const jsYaml = require('js-yaml')
const SimpleMarkdown = require('simple-markdown')

const levelName = 'l'

// get the menu from assets folder
const menu = require(path.resolve(__dirname, '../src/assets/menu.js'))
// markdown parser (not perfect, but works well enough)
const mdParse = SimpleMarkdown.defaultBlockParse
// eslint-disable-next-line no-useless-escape
const yamlBlockPattern = /^(?:\-\-\-)(.*?)(?:\-\-\-|\.\.\.)/s
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
    objectID: getObjectID(),
    [ levelName + '0' ]: null,
    [ levelName + '1' ]: null,
    [ levelName + '2' ]: null,
    [ levelName + '3' ]: null,
    [ levelName + '4' ]: null,
    [ levelName + '5' ]: null,
    [ levelName + '6' ]: null,
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

// returns the contents of the associated file
const getFileContents = (mdPath) => {
  const page = path.resolve(__dirname, mdPath)
  return fs.readFileSync(page, {
    encoding: 'utf8'
  })
}

// retrieves yaml from a markdown page
const getYaml = (md) => {
  return yamlBlockPattern.exec(md)[ 1 ]
}

// returns title and desc yaml field
const getYamlFields = (yaml) => {
  return {
    title: jsYaml.load(yaml).title,
    desc: jsYaml.load(yaml).desc
  }
}

const buildParagraph = (content, text2 = '', skip = 0) => {
  const text = []

  const addText = (data) => {
    text.push(data)
  }

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

const processNode = (node) => {
  const text = []
  if (Array.isArray(node)) {
    node.forEach(leaf => {
      const data = processNode(leaf)
      text.push(data.text)
    })
  }
  else if (node.type === 'list' && node.items && Array.isArray(node.items)) {
    node.items.forEach(leaf => {
      const data = buildParagraph(leaf)
      text.push(data.text)
    })
  }
  else if (node.type === 'paragraph' && Array.isArray(node.content)) {
    if (node.content[ 0 ].type === 'text' && node.content[ 0 ].content.startsWith('#')) {
      let text = ''
      let remaining = ''
      let index = 0
      for (; index < node.content.length; ++index) {
        const content = node.content[ index ].content
        const parts = content.split('\n')
        text += parts[ 0 ]
        if (parts.length > 1) {
          parts.shift()
          remaining += parts.join('')
          break
        }
      }
      const level = text.indexOf(' ')
      const subheading = text.slice(level + 1)
      const id = {
        [ levelName + (level) ]: subheading,
        anchor: subheading
      }
      const data = buildParagraph(node.content, remaining, index + 1)
      id.content = data.text
      return id
    }

    const data = buildParagraph(node.content)
    text.push(data.text)
  }
  else if (node.type === 'heading') {
    const data = buildParagraph(node.content)
    const subheading = data.text
    const level = node.level
    const id = {
      [ levelName + (level) ]: subheading,
      anchor: subheading
    }
    return id
  }
  else if (node.type === 'blockQuote') {
    const data = processNode(node.content)
    text.push(data.text)
  }
  else {
    if (node.type !== 'table' && node.type !== 'codeBlock') {
      const data = buildParagraph(node.content)
      text.push(data.text)
    }
  }
  return { text: text.join(' ') }
}

const processMarkdown = (syntaxTree, entries, entry) => {
  const contents = []

  const handleAnchor = (val = null) => {
    if (contents.length > 0) {
      const text = contents.join(' ')
        .replace(/\n/g, ' ')
        .replace(/<br>/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/::: tip/g, '')
        .replace(/::: warning/g, '')
        .replace(/::: danger/g, '')
        .replace(/:::/g, '')
        .trim()

      // handle text from previous
      const data = cleanObject(createIndex({ ...entry, content: text }))
      entries.push(data)

      if (val !== null) {
        // start a new subheading
        entry = { ...entry, ...val, content: '' }
      }

      // clean up contents array
      contents.splice(0, contents.length)
    }
  }

  syntaxTree.forEach((node, index) => {
    // skip first one which is the yaml
    if (index > 1) {
      const val = processNode(node)
      if (val.anchor) {
        handleAnchor(val)
      }
      // don't accept components embedded into the page
      else if (val.text.charAt(0) !== '<' && val.text.charAt(val.text.length - 1) !== '>') {
        contents.push(val.text)
      }
    }
  })

  // handle last bits on the page
  handleAnchor()
}

const processPage = (page, entry, entries, level = 0) => {
  const md = getFileContents(page)
  const yaml = getYaml(md)
  const { title, desc } = getYamlFields(yaml)

  const entryItem = {
    ...entry,
    [ levelName + level ]: title,
    content: desc,
    anchor: 'Introduction'
  }

  entries.push(cleanObject(createIndex(entryItem)))

  const syntaxTree = mdParse(md)
  processMarkdown(syntaxTree, entries, entryItem)
}

const processChildren = (parent, entry, entries, level) => {
  if (parent.children) {
    parent.children.forEach(menuItem => {
      if (menuItem.external !== true) {
        let entryChild = { ...entry }
        if (menuItem.path) {
          entryChild = {
            ...entry,
            [ levelName + (level) ]: menuItem.name,
            url: entry.url + '/' + menuItem.path,
            anchor: menuItem.name
          }
        }

        if (menuItem.children) {
          processChildren(menuItem, entryChild, entries, level + 1)
        }
        else {
          processPage(intro + entryChild.url + '.md', entryChild, entries, level + 1)
        }
      }
    })
  }
}

const processMenuItem = (menuItem, entries, level = 0) => {
  const entryItem = {
    [ levelName + level ]: menuItem.name,
    content: '',
    anchor: '',
    url: '/' + menuItem.path
  }

  if (menuItem.external !== true) {
    if (menuItem.children) {
      const entryChild = {
        ...entryItem,
        [ levelName + level ]: menuItem.name,
        anchor: menuItem.name
      }
      processChildren(menuItem, entryChild, entries, level)
    }
    else {
      processPage(intro + entryItem.url + '.md', entryItem, entries, level)
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
