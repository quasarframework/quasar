const
  fs = require('fs'),
  path = require('path')

const
  { logError, writeFile } = require('./build.utils'),
  typeRoot = path.resolve(__dirname, '../types'),
  distRoot = path.resolve(__dirname, '../dist/types'),
  resolvePath = file => path.resolve(distRoot, file),
  // eslint-disable-next-line no-useless-escape
  toCamelCase = s => s.replace(/(\-\w)/g, m => { return m[1].toUpperCase() })

function writeLine (fileContent, line = '', indent = 0) {
  fileContent.push(`${line.padStart(line.length + (indent * 4), ' ')}\n`)
}

function write (fileContent, text = '') {
  fileContent.push(`${text}`)
}

const typeMap = new Map([
  ['Array', 'any[]'],
  ['Any', 'any'],
  ['Component', 'Vue'],
  ['String', 'string'],
  ['Boolean', 'boolean'],
  ['Number', 'number']
])

function convertTypeVal (type, def) {
  const t = type.trim()

  if (typeMap.has(t)) {
    return typeMap.get(t)
  }

  if (t === 'Object') {
    if (def.definition) {
      const defs = getPropDefinitions(def.definition)
      return defs && defs.length > 0 ? `{\n        ${getPropDefinitions(def.definition).join('\n        ')} }` : 'any'
    }

    return 'any'
  }

  return t
}

function getTypeVal (def) {
  return Array.isArray(def.type)
    ? def.type.map(type => convertTypeVal(type, def)).join(' | ')
    : convertTypeVal(def.type, def)
}

function getPropDefinition (key, propDef) {
  const propName = toCamelCase(key)

  if (!propName.startsWith('...')) {
    const propType = getTypeVal(propDef)
    return `${propName}${!propDef.required ? '?' : ''} : ${propType}`
  }
}

function getPropDefinitions (propDefs) {
  const defs = []

  for (const key in propDefs) {
    const def = getPropDefinition(key, propDefs[key])
    def && defs.push(def)
  }

  return defs
}

function getMethodDefinition (key, methodDef) {
  let def = ''
  def += `${key} (`
  if (methodDef.params) {
    const params = getPropDefinitions(methodDef.params)
    def += params.join(', ')
  }
  const returns = methodDef.returns
  def += `): ${returns ? getTypeVal(returns) : 'void'}`

  return def
}

function getInjectionDefinition (injectionName, typeDef) {
  // Get property injection point
  for (var propKey in typeDef.props) {
    const propDef = typeDef.props[propKey]
    if (propDef.injectionPoint) {
      return getPropDefinition(injectionName, propDef)
    }
  }

  // Get method injection point
  for (var methodKey in typeDef.methods) {
    const methodDef = typeDef.methods[methodKey]
    if (methodDef.injectionPoint) {
      return getMethodDefinition(injectionName, methodDef)
    }
  }
}

function copyPredefinedTypes (dir, parentDir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.resolve(dir, file)
    const stats = fs.lstatSync(fullPath)
    if (stats.isFile()) {
      writeFile(
        resolvePath(parentDir ? parentDir + file : file),
        fs.readFileSync(fullPath)
      )
    }
    else if (stats.isDirectory()) {
      const p = resolvePath(parentDir ? parentDir + file : file)
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p)
      }
      copyPredefinedTypes(fullPath, parentDir ? parentDir + file : file + '/')
    }
  })
}

function writeIndexDTS (apis) {
  var contents = []
  var quasarTypeContents = []

  writeLine(contents, `import Vue, { VueConstructor } from 'vue'`)
  writeLine(contents)
  writeLine(quasarTypeContents, 'export as namespace quasar')
  writeLine(quasarTypeContents, `export * from './utils'`)

  const injections = {}

  apis.forEach(data => {
    const content = data.api
    const typeName = data.name

    // Declare class
    const extendsVue = (content.type === 'component' || content.type === 'mixin')
    writeLine(quasarTypeContents, `export const ${typeName}: ${extendsVue ? `VueConstructor<${typeName}>` : typeName}`)
    writeLine(contents, `export interface ${typeName} ${extendsVue ? 'extends Vue ' : ''}{`)

    // Write Props
    const props = getPropDefinitions(content.props)
    props.forEach(prop => writeLine(contents, prop, 1))

    // Write Methods
    for (const methodKey in content.methods) {
      write(contents, `    ${methodKey}(`)
      if (content.methods[methodKey].params) {
        const params = getPropDefinitions(content.methods[methodKey].params)
        write(contents, params.join(', '))
      }
      const returns = content.methods[methodKey].returns
      writeLine(contents, `): ${returns ? getTypeVal(returns) : 'void'}`)
    }

    // Close class declaration
    writeLine(contents, `}`)
    writeLine(contents)

    // Copy Injections for type declaration
    if (content.type === 'plugin') {
      if (content.injection) {
        const injectionParts = content.injection.split('.')
        if (!injections[injectionParts[0]]) {
          injections[injectionParts[0]] = []
        }
        let def = getInjectionDefinition(injectionParts[1], content)
        if (!def) {
          def = `${injectionParts[1]}: ${typeName}`
        }
        injections[injectionParts[0]].push(def)
      }
    }
  })

  // Write injection types
  for (const key in injections) {
    const injectionDefs = injections[key]
    if (injectionDefs) {
      writeLine(contents, `export interface ${key.toUpperCase().replace('$', '')}VueGlobals {`)
      for (const defKey in injectionDefs) {
        writeLine(contents, injectionDefs[defKey], 1)
      }
      writeLine(contents, '}')
    }
  }

  writeLine(contents)

  // Extend Vue instance with injections
  if (injections) {
    writeLine(contents, `declare module 'vue/types/vue' {`)
    writeLine(contents, 'interface Vue {', 1)

    for (const key3 in injections) {
      writeLine(contents, `${key3}: ${key3.toUpperCase().replace('$', '')}VueGlobals`, 2)
    }
    writeLine(contents, '}', 1)
    writeLine(contents, '}')
  }

  quasarTypeContents.forEach(line => write(contents, line))

  writeLine(contents, `import './vue'`)

  writeFile(resolvePath('index.d.ts'), contents.join(''))
}

module.exports.generate = function (data) {
  const apis = data.plugins
    .concat(data.directives)
    .concat(data.components)

  try {
    copyPredefinedTypes(typeRoot)
    writeIndexDTS(apis)
  }
  catch (err) {
    logError(`build.types.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
