const fs = require('fs')
const path = require('path')
const fg = require('fast-glob')
const jsYaml = require('js-yaml')
const SimpleMarkdown = require('simple-markdown')

const mdParse = SimpleMarkdown.defaultBlockParse
// eslint-disable-next-line no-useless-escape
const yamlBlockPattern = /^(?:\-\-\-)(.*?)(?:\-\-\-|\.\.\.)/s

const folders = '../src/pages/**/*.md'
const intro = '../src/pages/'
// const base = 'https://next.quasar.dev/'

let objectID = 1
const getObjectID = () => objectID++

const slugify = (str) => {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

const createFolder = (folder) => {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

const createIndex = (data) => {
  const requiredFields = [ 'hierarchy_lvl0', 'hierarchy_lvl1', 'url' ]
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
    hierarchy_radio_lvl0: null,
    hierarchy_radio_lvl1: null,
    hierarchy_radio_lvl2: null,
    hierarchy_radio_lvl3: null,
    hierarchy_radio_lvl4: null,
    hierarchy_radio_lvl5: null,
    hierarchy_lvl0: null,
    hierarchy_lvl1: null,
    hierarchy_lvl2: null,
    hierarchy_lvl3: null,
    hierarchy_lvl4: null,
    hierarchy_lvl5: null,
    hierarchy_lvl6: null,
    content: null,
    anchor: null,
    ...data
  }
}

// returns the contents of the assciated file
const getFileContents = (mdPath) => {
  return fs.readFileSync(path.resolve(__dirname, mdPath), {
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
            console.log(node)
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
      const slug = slugify(subheading)
      const id = {
        anchor: slug,
        [ 'hierarchy_lvl' + (level - 1) ]: subheading
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
    const slug = slugify(subheading)
    const id = {
      anchor: slug,
      [ 'hierarchy_lvl' + (level - 1) ]: subheading
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
  syntaxTree.forEach((node, index) => {
    // skip first one which is the yaml
    if (index > 1) {
      const val = processNode(node)
      if (val.anchor) {
        const text = contents.join(' ')
          .replace(/\n/g, ' ')
          .replace(/<br>/g, '')
          .replace(/\s\s+/g, ' ')
          .trim()

        // handle text from previous
        const data = createIndex({ ...entry, content: text })
        entries.push(data)

        // start a new subheading
        entry = { ...entry, ...val, content: '' }

        // clean up contents array
        contents.splice(0, contents.length)
      }
      // don't accept components embedded into the page
      else if (val.text.charAt(0) !== '<' && val.text.charAt(val.text.length - 1) !== '>') {
        contents.push(val.text)
      }
    }
  })
}

const processFile = (page, entries) => {
  const key = page.replace(intro, '').replace('.md', '')
  const url = '/' + key

  console.log('Processing', page, url)

  const md = getFileContents(page)
  const yaml = getYaml(md)
  const { title, desc } = getYamlFields(yaml)

  const syntaxTree = mdParse(md)

  const entry = {
    hierarchy_lvl0: title,
    hierarchy_lvl1: desc,
    content: '',
    anchor: 'Introduction',
    url
  }

  processMarkdown(syntaxTree, entries, entry)
}

// -- Begin processing

const run = () => {
  const start = new Date().getTime()

  createFolder('search')

  const entries = []

  // retrieve all the markdown pages paths
  const pages = fg.sync(folders, {
    cwd: __dirname
  })

  pages.forEach(mdPage => {
    processFile(mdPage, entries)
  })

  fs.writeFileSync(path.resolve(__dirname, '../search/indices.json'), JSON.stringify(entries, null, 2), () => {})

  const end = new Date().getTime()
  const time = end - start
  console.log(`Finished ${pages.length} pages with ${entries.length} indices in ${time}ms`)
}

run()
