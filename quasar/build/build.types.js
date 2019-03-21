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
        fs.mkdirSync(resolve('../types/' + (parentDir ? parentDir + file : file)))
        copyTypeFiles(fullPath, parentDir ? parentDir + file : file + '/')
      }
    })
  }

  function getPropDeclaration (prop) {
    const propDef = prop.def
    var propType = getTypeVal(propDef)
    // const propTypeVal = propType
    return `${prop.name}${!propDef.required ? '?' : ''} : ${propType};`
  }

  function getObjectDeclaration (objectDef) {
    const props = []
    for (var prop in objectDef) {
      const propDef = { name: toCamelCase(prop), def: objectDef[prop] }
      props.push(getPropDeclaration(propDef))
    }
    return props
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
        return `{ ${getObjectDeclaration(def.definition).join(' ')} }`
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
      return propTypes.join('|')
    }
    else {
      return convertTypeVal(types, def)
    }
  }

  copyTypeFiles(typeRoot)

  var contents = []

  contents.push('import "./vue"\n')
  contents.push('\n')
  contents.push('export as namespace quasar\n')
  contents.push('export * from "./utils"\n')
  contents.push('\n')

  contents.push('// Quasar Type Definitions \n')
  contents.push('import Vue, { VueConstructor } from "vue";\n')

  const distDir = fs.readdirSync(apiRoot)
  var injections = {}

  distDir.forEach(file => {
    const fileContent = resolve(file)
    const content = require(fileContent)
    const typeName = file.split('.')[0]

    // Declare class
    if (content.type === 'component' || content.type === 'mixin') {
      contents.push(`export const ${typeName}: VueConstructor<${typeName}>\n`)
      contents.push(`export interface ${typeName} extends Vue {\n`)
    }
    else {
      contents.push(`export const ${typeName}: ${typeName}; \n`)
      contents.push(`export interface ${typeName} {\n`)
    }

    // Write Props
    for (var key in content.props) {
      const propName = toCamelCase(key)
      const propDef = content.props[key]
      var propType = getTypeVal(propDef)
      const propTypeVal = propType
      contents.push(`    ${propName}${!propDef.required ? '?' : ''} : ${propTypeVal};\n`)
    }

    // Write Methods
    for (var methodKey in content.methods) {
      contents.push(`    ${methodKey}(`)
      if (content.methods[methodKey].params) {
        const params = []
        for (var paramsKey in content.methods[methodKey].params) {
          const prarmName = toCamelCase(paramsKey)
          const paramDef = content.methods[methodKey].params[paramsKey]
          params.push(`${prarmName}${!paramDef.required ? '?' : ''}: ${getTypeVal(paramDef)}`)
        }
        contents.push(params.join(', '))
      }
      contents.push(`): void;\n`)
    }

    // Close class declaration
    contents.push(`}\n`)
    contents.push(`\n`)

    // Write Vue Injections
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

  for (var key in injections) {
    const props = injections[key]
    if (props) {
      contents.push(`export interface ${key.toUpperCase().replace('$', '')}VueGlobals {\n`)
      for (var prop in props) {
        contents.push(`    ${props[prop].injection}: ${props[prop].class};\n`)
      }
      contents.push('}\n')
    }
  }
  // contents.push('}\n')
  contents.push('\n')

  if (injections) {
    contents.push('declare module "vue/types/vue" {\n')
    contents.push('    interface Vue {\n')
  }

  for (var key3 in injections) {
    contents.push(`    ${key3}: ${key3.toUpperCase().replace('$', '')}VueGlobals;\n`)
  }

  if (injections) {
    contents.push('    }\n')
    contents.push('}\n')
  }

  writeFile(resolve('../types/index.d.ts'), contents.join(''))
}
