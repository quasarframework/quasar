module.exports.generate = function () {
  const
    fs = require('fs'),
    path = require('path'),
    apiRoot = path.resolve(__dirname, '../dist/api'),
    typeRoot = path.resolve(__dirname, '../types'),
    { writeFile } = require('./build.utils'),
    resolve = file => path.resolve(apiRoot, file),
    // eslint-disable-next-line no-useless-escape
    toCamelCase = s => s.replace(/(\-\w)/g, m => { return m[1].toUpperCase() })

  function copyTypeFiles (dir, parentDir) {
    const typeDir = fs.readdirSync(dir)
    typeDir.forEach(file => {
      const fullPath = path.resolve(dir, file)
      const stats = fs.lstatSync(fullPath)
      if (stats.isFile()) {
        writeFile(resolve('../types/' + (parentDir ? parentDir + file : file)), fs.readFileSync(fullPath))
      }
      else if (stats.isDirectory()) {
        const p = resolve('../types/' + (parentDir ? parentDir + file : file))
        if (!fs.existsSync(p)) {
          fs.mkdirSync(p)
        }
        copyTypeFiles(fullPath, parentDir ? parentDir + file : file + '/')
      }
    })
  }

  function writeLine (fileContent, line = '', indent = 0) {
    fileContent.push(`${line.padStart(line.length + (indent * 4), ' ')}\n`)
  }

  function write (fileContent, text = '') {
    fileContent.push(`${text}`)
  }

  function convertTypeVal (type, def) {
    const t = type.trim()
    if (t === 'Array') {
      return '[]'
    }
    else if (t === 'Any') {
      return 'any'
    }
    else if (t === 'Component') {
      return 'Vue'
    }
    else if (t === 'Object') {
      if (def.definition) {
        return `{\n        ${getPropDefinitions(def.definition).join('\n        ')} }`
      }
      else {
        return 'any'
      }
    }
    return t
  }

  function getTypeVal (def) {
    const types = def.type
    if (Array.isArray(types)) {
      const propTypes = types.map(convertTypeVal)
      return propTypes.join(' | ')
    }
    else {
      return convertTypeVal(types, def)
    }
  }

  function getPropDefinitions (propDefs) {
    const defs = []
    for (var key in propDefs) {
      const propName = toCamelCase(key)
      const propDef = propDefs[key]
      var propType = getTypeVal(propDef)
      const propTypeVal = propType
      defs.push(`${propName}${!propDef.required ? '?' : ''} : ${propTypeVal}`)
    }
    return defs
  }

  copyTypeFiles(typeRoot)

  var contents = []

  writeLine(contents, `import './vue'`)
  writeLine(contents)
  writeLine(contents, 'export as namespace quasar')
  writeLine(contents, `export * from './utils'`)
  writeLine(contents)
  writeLine(contents, '// Quasar Type Definitions')
  writeLine(contents, `import Vue, { VueConstructor } from 'vue'`)
  writeLine(contents)

  const distDir = fs.readdirSync(apiRoot)
  var injections = {}

  distDir.forEach(file => {
    const fileContent = resolve(file)
    const content = require(fileContent)
    const typeName = file.split('.')[0]

    // Declare class
    const extendsVue = (content.type === 'component' || content.type === 'mixin')
    writeLine(contents, `export const ${typeName}: ${extendsVue ? `VueConstructor<${typeName}>` : typeName}`)
    writeLine(contents, `export interface ${typeName} ${extendsVue ? 'extends Vue ' : ''}{`)

    // Write Props
    const props = getPropDefinitions(content.props)
    props.forEach(prop => writeLine(contents, prop, 1))

    // Write Methods
    for (var methodKey in content.methods) {
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
        injections[injectionParts[0]].push({ 'class': typeName, 'injection': injectionParts[1] })
      }
    }
  })

  // Write injection types
  for (var key in injections) {
    const props = injections[key]
    if (props) {
      writeLine(contents, `export interface ${key.toUpperCase().replace('$', '')}VueGlobals {`)
      for (var prop in props) {
        writeLine(contents, `${props[prop].injection}: ${props[prop].class}`, 1)
      }
      writeLine(contents, '}')
    }
  }

  writeLine(contents)

  // Extend Vue instance with injections
  if (injections) {
    writeLine(contents, `declare module 'vue/types/vue' {`)
    writeLine(contents, 'interface Vue {', 1)

    for (var key3 in injections) {
      writeLine(contents, `${key3}: ${key3.toUpperCase().replace('$', '')}VueGlobals`, 2)
    }
    writeLine(contents, '}', 1)
    writeLine(contents, '}')
  }

  writeFile(resolve('../types/index.d.ts'), contents.join(''))
}
