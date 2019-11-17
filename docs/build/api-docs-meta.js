const fs = require('fs'),
  path = require('path'),
  readline = require('readline')

const componentsPath = path.join(__dirname, '../src/pages/vue-components'),
  examplesPath = path.join(__dirname, '../src/examples'),
  outputFolder = path.join(__dirname, '../src/statics/api')

module.exports.outputFolder = outputFolder

function toPascalCase (str) {
  str = str.split('-')
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length)
  }
  return str.join('')
}

function toKebabCase (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function readExample (exampleName, exampleTitle, examplePath, componentKebabCase, componentName, api, docsMeta, priority = false) {
  const rl = readline.createInterface({
    input: fs.createReadStream(examplePath),
    output: () => {}
  })
  let readingComponent = false,
    declarationIdentation = 0,
    readingExampleMeta = false,
    exampleMetaString = '',
    exampleMeta = null
  rl.on('line', line => {
    // parse example meta
    if (line === '</example>') {
      readingExampleMeta = false
      exampleMeta = JSON.parse(exampleMetaString)
    }
    if (readingExampleMeta) {
      exampleMetaString += line
    }
    if (line === '<example>') {
      readingExampleMeta = true
    }

    // check component tag start
    const isDeclarationLine = line.includes(componentKebabCase)
    if (isDeclarationLine) {
      declarationIdentation = line.indexOf('<')
    }

    // read attrs
    if (readingComponent || isDeclarationLine) {
      line = `${line}\n`
      const attrsRegex = /([:@#]*)([\w-:]+?)(=".+?"|\n| |>|\n)/g
      readingComponent = !line.endsWith('/>')
      let attrMatch
      while ((attrMatch = attrsRegex.exec(line)) !== null) {
        let attrType = attrMatch[1],
          attr = attrMatch[2],
          value = attrMatch[3]

        let apiType
        if (attrType === '#' || attr.startsWith('v-slot')) {
          apiType = value && value.startsWith('=') ? 'scopedSlots' : 'slots'
          attr = attr.replace('v-slot', '').replace(':', '')
          if (attr === '') {
            attr = 'default'
          }
        }
        else if (attrType === '@') {
          apiType = 'methods'
        }
        else {
          apiType = 'props'
        }
        if (api[apiType] && api[apiType][attr]) {
          let attrDocsMeta = docsMeta[apiType][attr]
          if (!attrDocsMeta) {
            attrDocsMeta = docsMeta[apiType][attr] = {
              examples: []
            }
          }
          !attrDocsMeta.examples.some(e => e.example === exampleName) && attrDocsMeta.examples[priority ? 'unshift' : 'push']({
            title: exampleMeta ? exampleMeta.title : exampleTitle,
            example: exampleMeta ? `${componentName}/api/${exampleName}` : exampleName,
            description: exampleMeta ? exampleMeta.description : null
          })
        }
      }
    }

    // check component tag close
    if (
      readingComponent &&
      (
        (line.includes(`</${componentKebabCase}>`) && line.indexOf('<') === declarationIdentation) ||
        (line.endsWith('/>') && line.indexOf('/') === declarationIdentation)
      )
    ) {
      readingComponent = false
    }
  })

  rl.on('close', () => {
    fs.writeFileSync(path.join(outputFolder, `${componentName}.json`), JSON.stringify(docsMeta, null, 2))
  })
}

module.exports.generate = () => {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder)
  }

  fs.readdirSync(componentsPath).forEach(componentPage => {
    const page = fs.readFileSync(path.join(componentsPath, componentPage)).toString(),
      apiRegex = /<doc-api file="(\S+)"/g

    let apiMatch
    while ((apiMatch = apiRegex.exec(page)) !== null) {
      const componentName = apiMatch === null ? toPascalCase(`q-${componentPage.replace('.md', '')}`) : apiMatch[1],
        componentKebabCase = `q-${toKebabCase(componentName.slice(1))}`,
        api = require(`quasar/dist/api/${componentName}.json`),
        exampleRegex = /<doc-example title="(.+)" file="(.+)" \/>/gm,
        docsMeta = {
          props: {},
          methods: {},
          slots: {},
          scopedSlots: {}
        }

      let exampleMatch
      while ((exampleMatch = exampleRegex.exec(page)) !== null) {
        const title = exampleMatch[1],
          exampleName = exampleMatch[2],
          examplePath = path.join(examplesPath, `${exampleName}.vue`)

        readExample(exampleName, title, examplePath, componentKebabCase, componentName, api, docsMeta)
      }

      const apiExamplesPath = path.join(examplesPath, componentName, 'api')
      fs.existsSync(apiExamplesPath) && fs.readdirSync(apiExamplesPath).forEach((example, index) => {
        readExample(
          example.replace('.vue', ''),
          null,
          path.join(apiExamplesPath, example),
          componentKebabCase,
          componentName,
          api,
          docsMeta,
          true
        )
      })
    }
  })
}
