const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

const { logError, writeFile } = require('./build.utils')
const typeRoot = path.resolve(__dirname, '../types')
const distRoot = path.resolve(__dirname, '../dist/types')
const resolvePath = file => path.resolve(distRoot, file)
const INDENT_SPACE_COUNT = 2
const extraInterfaces = {}
// eslint-disable-next-line no-useless-escape
const toCamelCase = str => str.replace(/(-\w)/g, m => m[ 1 ].toUpperCase())

function writeLine (fileContent, line = '', indent = 0) {
  fileContent.push(`${ line.padStart(line.length + (indent * INDENT_SPACE_COUNT), ' ') }\n`)
}

function writeLines (fileContent, lines = '', indent = 0) {
  lines.split('\n').forEach(line => writeLine(fileContent, line, indent))
}

function write (fileContent, text = '') {
  fileContent.push(`${ text }`)
}

const typeMap = new Map([
  [ 'Any', 'any' ],
  [ 'Component', 'Component' ],
  [ 'VNode', 'VNode' ], // VNode is exclusive to slot type generation here, it can't and doesn't need to be used in JSON API files
  [ 'String', 'string' ],
  [ 'Boolean', 'boolean' ],
  [ 'Number', 'number' ]
])

const fallbackComplexTypeMap = new Map([
  [ 'Array', 'any[]' ],
  [ 'Object', 'LooseDictionary' ]
])

const dontNarrowValues = [
  '(Boolean) true',
  '(Boolean) false',
  '(CSS selector)',
  '(DOM Element)'
]

function convertTypeVal (type, def, required) {
  if (def.tsType !== void 0) {
    return def.tsType
  }

  const t = type.trim()

  if (def.values && t === 'String') {
    const narrowedValues = def.values.filter(v =>
      !dontNarrowValues.includes(v)
      && typeof v === 'string'
    ).map(v => `'${ v }'`)

    if (narrowedValues.length) {
      return narrowedValues.join(' | ')
    }
  }

  if (typeMap.has(t)) {
    return typeMap.get(t)
  }

  if (fallbackComplexTypeMap.has(t)) {
    if (def.definition) {
      const propDefinitions = getPropDefinitions(def.definition, required, true)
      const lines = []
      propDefinitions.forEach(p => lines.push(...p.split('\n')))
      return propDefinitions && propDefinitions.length > 0 ? `{\n        ${ lines.join('\n        ') } }${ t === 'Array' ? '[]' : '' }` : fallbackComplexTypeMap.get(t)
    }

    return fallbackComplexTypeMap.get(t)
  }

  return t
}

function getTypeVal (def, required) {
  return Array.isArray(def.type)
    ? def.type.map(type => convertTypeVal(type, def, required)).join(' | ')
    : convertTypeVal(def.type, def, required)
}

function getPropDefinition (key, propDef, required, docs = false, isMethodParam = false) {
  const propName = toCamelCase(key)

  if (propName.startsWith('...')) {
    return isMethodParam ? `${ propName }: any[]` : '[index: string]: any'
  }
  else {
    const propType = getTypeVal(propDef, required)
    addToExtraInterfaces(propDef)
    return `${ docs ? `/**\n * ${ propDef.desc }\n */\n` : '' }${ propName }${ !propDef.required && !required ? '?' : '' }: ${ propType }`
  }
}

function getPropDefinitions (propDefs, required, docs = false, areMethodParams = false) {
  const defs = []

  for (const key in propDefs) {
    const def = getPropDefinition(key, propDefs[ key ], required, docs, areMethodParams)
    def && defs.push(def)
  }

  return defs
}

// TODO: Refactor and simplify the usage
function getMethodDefinition (key, methodDef, returnTypeRequired = false, required = true, paramsRequired = false) {
  let def = `/**\n * ${ methodDef.desc }\n`
  if (methodDef.params) {
    def += `${ Object.entries(methodDef.params).map(([ name, paramDef ]) => ` * @param ${ name } ${ paramDef.desc !== undefined ? paramDef.desc : '' }`).join('\n') }\n`
  }

  const returns = methodDef.returns
  if (returns && returns.desc) {
    def += ` * @returns ${ returns.desc }\n`
  }

  def += ` */\n${ key }`

  if (methodDef.tsType !== void 0) {
    def += `: ${ methodDef.tsType }`
    addToExtraInterfaces(methodDef)
  }
  else {
    def += required ? ': (' : '?: ('

    if (methodDef.params) {
      // TODO: Verify if this should be optional even for plugins
      const params = getPropDefinitions(methodDef.params, paramsRequired, false, true, true)
      def += params.join(', ')
    }

    def += `) => ${ returns ? getTypeVal(returns, returnTypeRequired) : 'void' }`
    addToExtraInterfaces(returns, true)
  }

  return def
}

function getObjectParamDefinition (def, required) {
  const res = []

  Object.keys(def).forEach(propName => {
    const propDef = def[ propName ]
    if (propDef.type && propDef.type === 'Function') {
      res.push(
        getMethodDefinition(propName, propDef, required)
      )
    }
    else {
      res.push(
        getPropDefinition(propName, propDef, required, true)
      )
    }
  })

  return res
}

function getInjectionDefinition (injectionName, typeDef) {
  // Get property injection point
  for (const propKey in typeDef.props) {
    const propDef = typeDef.props[ propKey ]
    if (propDef.tsInjectionPoint) {
      return getPropDefinition(injectionName, propDef, true, true)
    }
  }

  // Get method injection point
  for (const methodKey in typeDef.methods) {
    const methodDef = typeDef.methods[ methodKey ]
    if (methodDef.tsInjectionPoint) {
      return getMethodDefinition(injectionName, methodDef, true)
    }
  }
}

function copyPredefinedTypes (dir, parentDir) {
  fs.readdirSync(dir)
    .filter(file => path.basename(file).startsWith('.') !== true)
    .forEach(file => {
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

function addToExtraInterfaces (def, required) {
  if (def !== void 0 && def.tsType !== void 0) {
    // When a type name is found and it has a definition,
    //  it's added for later usage if a previous definition isn't already there.
    // When the new interface doesn't have a definition, we initialize its key anyway
    //  to mark its existence, but with an undefined value.
    // In this way it can be overwritten if a definition is found later on.
    // Interfaces without definition at the end of the build script
    //  are considered external custom types and imported as such
    if (
      extraInterfaces[ def.tsType ] === void 0
      && def.definition !== void 0
    ) {
      extraInterfaces[ def.tsType ] = getObjectParamDefinition(
        def.definition, required
      )
    }
    else if (!extraInterfaces.hasOwnProperty(def.tsType)) {
      extraInterfaces[ def.tsType ] = void 0
    }
  }
}

function writeQuasarPluginProps (contents, nameName, props, isLast) {
  writeLine(contents, `${ nameName }: {`, 1)
  props.forEach(prop => writeLines(contents, prop, 2))
  writeLine(contents, `}${ isLast ? '' : ',' }`, 1)
}

function addQuasarPluginOptions (contents, components, directives, plugins) {
  writeLine(contents, 'import { GlobalQuasarLanguage, GlobalQuasarIconSet } from \'./globals\'')
  writeLine(contents, 'export interface QuasarPluginOptions {')
  writeLine(contents, 'lang: GlobalQuasarLanguage,', 1)
  writeLine(contents, 'config: any,', 1)
  writeLine(contents, 'iconSet: GlobalQuasarIconSet,', 1)
  writeQuasarPluginProps(contents, 'components', components)
  writeQuasarPluginProps(contents, 'directives', directives)
  writeQuasarPluginProps(contents, 'plugins', plugins, true)
  writeLine(contents, '}')
  writeLine(contents)
}

function addQuasarLangCodes (contents) {
  // We are able to read this file only because
  //  it's been generated before type generation take place
  const langJson = require('../lang/index.json')

  // Assure we are doing a module augmentation instead of a module overwrite
  writeLine(contents, 'import \'./lang\'')
  writeLine(contents, 'declare module \'./lang\' {')
  writeLine(contents, 'export interface QuasarLanguageCodesHolder {', 2)
  langJson.forEach(({ isoName }) => writeLine(contents, `'${ isoName }': true`, 3))
  writeLine(contents, '}', 2)
  writeLine(contents, '}')
}

function writeIndexDTS (apis) {
  const contents = []
  const quasarTypeContents = []
  const components = []
  const directives = []
  const plugins = []
  /** @type { { [componentName: string]: { props: string; slots: string; } } } */
  const componentToSubTypeMap = {}

  addQuasarLangCodes(quasarTypeContents)

  // TODO: (Qv3) remove this reference to q/app and
  // rely on the shim provided by the starter kit with
  // https://github.com/quasarframework/quasar-starter-kit/pull/162
  // Existing projects which used `compilerOptions.types` as `["quasar", ... /* other packages types */]`
  // due to this implementation may be able to remove that option and rely on default behaviour
  // ----
  // This line must be BEFORE ANY TS INSTRUCTION,
  //  or it won't be interpreted as a TS compiler directive
  //  but as a normal comment
  // On Vue CLI projects `@quasar/app` isn't available,
  //  we ignore the "missing package" error because it's the intended behaviour
  writeLine(contents, '// @ts-ignore')
  writeLine(contents, '/// <reference types="@quasar/app" />')
  // ----
  writeLine(contents, 'import { App, Component, ComponentPublicInstance, VNode } from \'vue\'')
  writeLine(contents, 'import { LooseDictionary, ComponentConstructor, GlobalComponentConstructor } from \'./ts-helpers\'')
  writeLine(contents)
  writeLine(quasarTypeContents, 'export as namespace quasar')
  // We expose `ts-helpers` because they are needed by `@quasar/app` augmentations
  writeLine(quasarTypeContents, 'export * from \'./ts-helpers\'')
  writeLine(quasarTypeContents, 'export * from \'./utils\'')
  writeLine(quasarTypeContents, 'export * from \'./composables\'')
  writeLine(quasarTypeContents, 'export * from \'./feature-flag\'')
  writeLine(quasarTypeContents, 'export * from \'./globals\'')
  writeLine(quasarTypeContents, 'export * from \'./extras\'')
  writeLine(quasarTypeContents, 'export * from \'./lang\'')
  writeLine(quasarTypeContents, 'export * from \'./api\'')
  writeLine(quasarTypeContents)

  const injections = {}

  apis.forEach(data => {
    const content = data.api
    const typeName = data.name

    const extendsVue = (content.type === 'component' || content.type === 'mixin')
    const typeValue = `${ extendsVue ? `ComponentConstructor<${ typeName }>` : typeName }`
    // Add Type to the appropriate section of types
    const propTypeDef = `${ typeName }?: ${ typeValue }`
    if (content.type === 'component') {
      write(components, propTypeDef)
    }
    else if (content.type === 'directive') {
      write(directives, propTypeDef)
    }
    else if (content.type === 'plugin') {
      write(plugins, propTypeDef)
    }

    const props = getPropDefinitions(content.props, content.type === 'plugin', true)

    // Declare class
    writeLine(quasarTypeContents, `export const ${ typeName }: ${ typeValue }`)

    if (content.events) {
      for (const [ name, definition ] of Object.entries(content.events)) {
        const propName = toCamelCase('on-' + name)
        const safeName = propName.includes(':') ? `'${ propName }'` : propName

        props.push(getMethodDefinition(safeName, definition, false, false, true))
      }
    }

    // Create ${name}Props class for components & mixins (can be useful with h(), TSX, etc.)
    if (extendsVue) {
      const propsTypeName = `${ typeName }Props`

      writeLine(contents, `export interface ${ propsTypeName } {`)

      props.forEach(prop => writeLines(contents, prop, 1))

      writeLine(contents, '}')
      writeLine(contents)

      const slotsTypeName = `${ typeName }Slots`

      writeLine(contents, `export interface ${ slotsTypeName } {`)

      if (content.slots) {
        for (const [ rawName, definition ] of Object.entries(content.slots)) {
          // Replace "[dynamic]" placeholders
          // Example: body-cell-[name] -> [key: `body-cell-${string}`] (TS Template Literal String)
          // eslint-disable-next-line no-template-curly-in-string
          const replacement = '${string}'
          let name = rawName.replace(/\[(\w+)\]/, replacement)

          name = name.includes(replacement) ? `[key: \`${ name }\`]` : name.includes('-') ? `'${ name }'` : name

          const params = definition.scope ? {
            scope: {
              type: 'Object',
              definition: definition.scope
            }
          } : undefined

          const slot = getMethodDefinition(name, {
            desc: definition.desc,
            params,
            returns: {
              type: 'VNode[]'
            }
          }, true, true, true)

          writeLines(contents, slot, 1)
        }
      }

      writeLine(contents, '}')
      writeLine(contents)

      componentToSubTypeMap[ typeName ] = { props: propsTypeName, slots: slotsTypeName }

      writeLine(contents, `export interface ${ typeName } extends ComponentPublicInstance<${ propsTypeName }> {`)
    }
    else {
      writeLine(contents, `export interface ${ typeName } {`)

      // Write props to the body directly
      props.forEach(prop => writeLines(contents, prop, 1))
    }

    // Write Methods
    for (const methodKey in content.methods) {
      const method = content.methods[ methodKey ]
      const methodDefinition = getMethodDefinition(methodKey, method, content.type === 'plugin')
      writeLines(contents, methodDefinition, 1)
    }

    // Close class declaration
    writeLine(contents, '}')
    writeLine(contents)

    // Copy Injections for type declaration
    if (content.type === 'plugin') {
      if (content.injection) {
        const injectionParts = content.injection.split('.')
        if (!injections[ injectionParts[ 0 ] ]) {
          injections[ injectionParts[ 0 ] ] = []
        }
        let def = getInjectionDefinition(injectionParts[ 1 ], content)
        if (!def) {
          def = `${ injectionParts[ 1 ] }: ${ typeName }`
        }
        injections[ injectionParts[ 0 ] ].push(def)
      }
    }
  })

  Object.keys(extraInterfaces).forEach(name => {
    if (extraInterfaces[ name ] === void 0) {
      // If we find the symbol as part of the generated Quasar API,
      //  we don't need to import it from custom TS API patches
      if (apis.some(definition => definition.name === name)) {
        return
      }

      writeLine(contents, `import { ${ name } } from './api'`)
    }
    else {
      writeLine(contents, `export interface ${ name } {`)
      extraInterfaces[ name ].forEach(def => {
        writeLines(contents, def, 1)
      })
      writeLine(contents, '}\n')
    }
  })

  // Write injection types
  for (const key in injections) {
    const injectionDefs = injections[ key ]
    if (injectionDefs) {
      const injectionName = `${ key.toUpperCase().replace('$', '') }VueGlobals`
      writeLine(contents, `import { ${ injectionName }, QSingletonGlobals } from "./globals";`)
      writeLine(contents, 'declare module "./globals" {')
      writeLine(contents, `export interface ${ injectionName } {`)
      for (const defKey in injectionDefs) {
        writeLines(contents, injectionDefs[ defKey ], 1)
      }
      writeLine(contents, '}')
      writeLine(contents, '}')
    }
  }

  writeLine(contents)

  // Extend Vue instance with injections
  if (injections) {
    writeLine(contents, 'declare module \'@vue/runtime-core\' {')
    writeLine(contents, 'interface ComponentCustomProperties {', 1)

    for (const key3 in injections) {
      writeLine(contents, `${ key3 }: ${ key3.toUpperCase().replace('$', '') }VueGlobals`, 2)
    }
    writeLine(contents, '}', 1)
    writeLine(contents, '}')
    writeLine(contents)
  }

  // Provide `GlobalComponents`, expected to be used for Volar
  writeLine(contents, 'declare module \'@vue/runtime-core\' {')
  writeLine(contents, 'interface GlobalComponents {', 1)

  for (const [ typeName, { props: propsTypeName, slots: slotsTypeName } ] of Object.entries(componentToSubTypeMap)) {
    writeLine(contents, `${ typeName }: GlobalComponentConstructor<${ propsTypeName }, ${ slotsTypeName }>`, 2)
  }

  writeLine(contents, '}', 1)
  writeLine(contents, '}')
  writeLine(contents)

  addQuasarPluginOptions(contents, components, directives, plugins)

  quasarTypeContents.forEach(line => write(contents, line))
  writeLine(contents)

  writeLine(contents, 'export const Quasar: { install: (app: App, options: Partial<QuasarPluginOptions>) => any } & QSingletonGlobals')
  writeLine(contents, 'export default Quasar')
  writeLine(contents)

  // These imports force TS compiler to evaluate contained declarations
  //  which by defaults would be ignored because inside node_modules
  //  and not directly referenced by any file
  writeLine(contents, 'import \'./shim-icon-set\'')
  writeLine(contents, 'import \'./shim-lang\'')

  writeFile(
    resolvePath('index.d.ts'),
    prettier.format(contents.join(''), { parser: 'typescript' })
  )
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
    logError('build.types.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
