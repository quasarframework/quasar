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

  function copyTypeFiles (dir) {
    const typeDir = fs.readdirSync(dir)
    typeDir.forEach(file => {
      const filePath = path.resolve(typeRoot, file)
      writeFile(resolve('../types/' + file), fs.readFileSync(filePath))
    })
  }

  function convertTypeVal (type) {
    const t = type.trim()
    if (t === 'Array') {
      return '[]'
    }
    else if (t === 'Any') {
      return 'any'
    }
    else if (t === 'Object') {
      return 'any'
    }
    return t
  }

  function getTypeVal (types) {
    if (Array.isArray(types)) {
      const propTypes = types.map(convertTypeVal)
      return propTypes.join(' | ')
    }
    else {
      return convertTypeVal(types)
    }
  }

  copyTypeFiles(typeRoot)

  var contents = []

  contents.push('export as namespace quasar;\n')
  contents.push('export * from "./utils"\n')
  contents.push('\n')

  contents.push('// Quasar Type Definitions \n')
  contents.push('import Vue from "vue";\n')
  // Remove this for now, this may cause the Mixins to be mixin<VueClass<MyComponent>>()
  // contents.push('import { VueClass } from "vue-class-component/lib/declarations";\n\n')

  const distDir = fs.readdirSync(apiRoot)
  var injections = {}

  distDir.forEach(file => {
    const fileContent = resolve(file)
    const content = require(fileContent)
    const typeName = file.split('.')[0]

    // Declare class
    if (content.type === 'component') {
      contents.push(`export interface ${typeName} extends Vue {\n`)
    }
    else {
      contents.push(`export const ${typeName}: ${typeName}; \n`)
      contents.push(`export interface ${typeName} {\n`)
    }

    // Write Props
    for (var key in content.props) {
      const propName = toCamelCase(key)
      var propType = getTypeVal(content.props[key].type)
      const propTypeVal = propType
      contents.push(`    ${propName}: ${propTypeVal};\n`)
    }

    // Write Methods
    for (var methodKey in content.methods) {
    // export function theNewMethod(x: m.foo): other.bar;
      contents.push(`    ${methodKey}(`)
      if (content.methods[methodKey].params) {
        const params = []
        for (var paramsKey in content.methods[methodKey].params) {
          params.push(`${paramsKey}: any`)
        }
        contents.push(params.join(', '))
      }
      contents.push(`): void;\n`)
    }

    // Close class declaration
    contents.push(`}\n`)

    if (content.type === 'component') {
      contents.push(`export const ${typeName}: Vue`) // VueClass<${typeName}>\n`)
    }
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
