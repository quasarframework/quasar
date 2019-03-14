module.exports.generate = function () {
  const
    fs = require('fs'),
    path = require('path'),
    root = path.resolve(__dirname, '../dist/api'),
    { writeFile } = require('./build.utils'),
    resolve = file => path.resolve(root, file),
    // eslint-disable-next-line no-useless-escape
    toCamelCase = s => s.replace(/(\-\w)/g, m => { return m[1].toUpperCase() })

  var contents = []

  contents.push('// Quasar Type Definitions \n')
  contents.push('import Vue from "vue";\n')
  contents.push('import { VueClass } from "vue-class-component/lib/declarations";\n\n')

  const distDir = fs.readdirSync(root)
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
      contents.push(`export = ${typeName}; \n`)
      contents.push(`export class ${typeName} {\n`)
    }

    // Write Props
    for (var key in content.props) {
      const propName = toCamelCase(key)
      const propType = content.props[key].type
      const propTypeVal = Array.isArray(propType) ? propType.join('| ') : propType
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
      contents.push(`export const ${typeName}: VueClass<${typeName}>\n`)
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
      contents.push(`export interface ${key.replace('$', '')}VueGlobals {\n`)
      for (var prop in props) {
        contents.push(`    ${props[prop].injection}: ${props[prop].class};\n`)
      }
      contents.push('}\n')
    }
  }

  if (injections) {
    contents.push('declare module "vue/types/vue" {\n')
    contents.push('    interface Vue {\n')
  }

  for (var key2 in injections) {
    contents.push(`    ${key2}: ${key2.replace('$', '')}VueGlobals;\n`)
  }

  if (injections) {
    contents.push('    }\n')
    contents.push('}\n')
  }

  writeFile(resolve('quasar.d.ts'), contents.join(''))
}
