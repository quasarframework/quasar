const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

const { logError, writeFile, clone } = require('./build.utils')
const typeRoot = path.resolve(__dirname, '../types')
const distRoot = path.resolve(__dirname, '../dist/types')
const resolvePath = file => path.resolve(distRoot, file)
const toCamelCase = str => str.replace(/(-\w)/g, m => m[ 1 ].toUpperCase())

const extraInterfaces = {}

// TODO: Consider removing the indenting logic as it's already handled better and gets overridden by prettier
const INDENT_SPACE_COUNT = 2

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
  [ 'Object', 'any' ]
])

const dontNarrowValues = [
  '(Boolean) true',
  '(Boolean) false',
  '(CSS selector)',
  '(DOM Element)'
]

function convertTypeVal (type, def) {
  if (def.tsType !== void 0) {
    return `${ def.tsType }${ def.type === 'Array' ? '[]' : '' }`
  }

  if (def.values && type === 'String') {
    const narrowedValues = def.values.filter(v =>
      !dontNarrowValues.includes(v)
      && typeof v === 'string'
    ).map(v => `'${ v }'`)

    if (narrowedValues.length) {
      return narrowedValues.join(' | ')
    }
  }

  if (typeMap.has(type)) {
    return typeMap.get(type)
  }

  if (fallbackComplexTypeMap.has(type)) {
    if (def.definition) {
      const propDefinitions = getPropDefinitions({ definitions: def.definition })
      const lines = []
      propDefinitions.forEach(propDef => writeLines(lines, propDef, 2))

      if (lines.length > 0) {
        return `{ ${ lines.join('') } }${ type === 'Array' ? '[]' : '' }`
      }
    }

    const prefix = type === 'Array' && def.syncable !== true ? 'readonly ' : ''

    return prefix + fallbackComplexTypeMap.get(type)
  }

  if (type === 'Function') {
    // Function type notations must be parenthesized when used in a union type
    return '(' + getFunctionDefinition({ definition: def }) + ')'
  }

  return type
}

function getTypeVal (def) {
  // Special check to avoid huge changes
  if (def.tsType === 'QNotifyCreateOptions') {
    return 'QNotifyCreateOptions | string'
  }

  return Array.isArray(def.type)
    ? def.tsType || def.type.map(type => convertTypeVal(type, def)).join(' | ')
    : convertTypeVal(def.type, def)
}

function getPropDefinition ({ name, definition, docs = true, isMethodParam = false, isCompProps = false, escapeName = true, isReadonly = false }) {
  let propName = escapeName ? toCamelCase(name) : name

  if (propName.startsWith('...')) {
    if (isMethodParam) {
      // A rest parameter must be of an array type. e.g. '...params: any[]'
      definition.type = 'Array'
      // A rest parameter cannot be optional
      definition.required = true
    }
    else {
      propName = `[${ propName.replace('...', '') || 'key' }: string]`
      // Optionality with index signature types works differently and use of '?:' is invalid and not required, so always mark it as required
      definition.required = true
    }
  }

  addToExtraInterfaces(definition)

  let propType = getTypeVal(definition)

  if (isCompProps === true && name !== 'model-value' && !definition.required && propType.indexOf(' undefined') === -1) {
    propType += ' | undefined;'
  }

  let jsDoc = ''

  if (docs) {
    jsDoc += `/**\n * ${ definition.desc }\n`

    if (definition.default) {
      jsDoc += ` * Default value: ${ definition.default }\n`
    }

    for (const [ name, paramDef ] of Object.entries(definition.params || {})) {
      jsDoc += ` * @param ${ name } ${ paramDef.desc || '' }\n`
    }

    const { returns } = definition
    if (returns && returns.desc) {
      jsDoc += ` * @returns ${ returns.desc }\n`
    }

    jsDoc += ' */\n'
  }

  return `${ jsDoc }${ isReadonly ? 'readonly ' : '' }${ propName }${ !definition.required ? '?' : '' }: ${ propType }`
}

function getPropDefinitions ({ definitions, docs = true, areMethodParams = false, isCompProps = false }) {
  return Object.entries(definitions || {})
    .map(([ name, definition ]) => getPropDefinition({ name, definition, docs, isMethodParam: areMethodParams, isCompProps }))
}

function getFunctionDefinition ({ definition }) {
  if (definition.tsType !== void 0) {
    addToExtraInterfaces(definition)
    return definition.tsType
  }

  const params = definition.params ? getPropDefinitions({ definitions: definition.params, areMethodParams: true, docs: false }) : []

  const returnType = definition.returns ? getTypeVal(definition.returns) : 'void'
  if (definition.returns) {
    addToExtraInterfaces(definition.returns)
  }

  return `(${ params.join(', ') }) => ${ returnType }`
}

function getInjectionDefinition (propertyName, typeDef, typeName) {
  // Look for a TS injection point in props and methods
  for (const definition of [ ...Object.values(typeDef.props), ...Object.values(typeDef.methods) ]) {
    if (definition.tsInjectionPoint) {
      return getPropDefinition({ name: propertyName, definition })
    }
  }

  return `${ propertyName }: ${ typeName }`
}

/**
 * @returns {Promise<void>[]}
 */
function copyPredefinedTypes (dir, parentDir) {
  return fs.readdirSync(dir)
    .filter(file => path.basename(file).startsWith('.') !== true)
    .flatMap(async file => {
      const fullPath = path.resolve(dir, file)
      const stats = fs.lstatSync(fullPath)
      if (stats.isFile()) {
        return writeFile(
          resolvePath(parentDir ? parentDir + file : file),
          fs.readFileSync(fullPath)
        )
      }
      else if (stats.isDirectory()) {
        const p = resolvePath(parentDir ? parentDir + file : file)
        if (!fs.existsSync(p)) {
          fs.mkdirSync(p)
        }
        return copyPredefinedTypes(fullPath, parentDir ? parentDir + file : file + '/')
      }
    })
}

function addToExtraInterfaces (def) {
  if (def !== void 0 && def !== null && def.tsType !== void 0) {
    // When a type name is found and it has autoDefineTsType and a definition,
    //  it's added for later usage if a previous definition isn't already there.
    // When the new interface doesn't have a definition, we initialize its key anyway
    //  to mark its existence, but with an undefined value.
    // In this way it can be overwritten if a definition is found later on.
    // Interfaces without definition at the end of the build script
    //  are considered external custom types and imported as such
    if (def.autoDefineTsType === true) {
      if (extraInterfaces[ def.tsType ] === void 0) {
        extraInterfaces[ def.tsType ] = getPropDefinitions({ definitions: def.definition })
      }
    }
    else if (!extraInterfaces.hasOwnProperty(def.tsType)) {
      extraInterfaces[ def.tsType ] = void 0
    }
  }
}

function writeInterface (contents, typeName, props) {
  writeLine(contents, `interface ${ typeName } {`, 1)
  props.forEach(prop => writeLines(contents, prop, 2))
  writeLine(contents, '}', 1)
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

// Makes the definition prop required if it's not already explicitly set
const makeRequired = prop => { prop.required = prop.required !== void 0 ? prop.required : true }

function transformObject (definition, handler) {
  const result = clone(definition || {})

  for (const [ key, value ] of Object.entries(result)) {
    handler(value, key, result)
  }

  return result
}

function getIndexDts (apis) {
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
  // On Vue CLI projects `@quasar/app`/`@quasar/app-webpack`/`@quasar/app-vite` aren't available,
  //  we ignore the "missing package" error because it's the intended behaviour
  const headerContents = []
  writeLine(headerContents, '// @ts-ignore')
  writeLine(headerContents, '/// <reference types="@quasar/app" />')
  writeLine(headerContents, '/// <reference types="@quasar/app-webpack" />')
  writeLine(headerContents, '/// <reference types="@quasar/app-vite" />')

  // ----
  writeLine(contents, 'import { App, Component, ComponentPublicInstance, VNode } from \'vue\'')
  writeLine(contents, 'import { ComponentConstructor, GlobalComponentConstructor } from \'./ts-helpers\'')
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
  writeLine(quasarTypeContents, 'export * from \'./plugin\'')
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

      // Don't touch 'required' of top-level properties to allow optional/required props
      // If it's a function, make all params required (1-level deep) since function props are working as callbacks
      content.props = transformObject(content.props, (prop) => {
        prop.params = transformObject(prop.params, makeRequired)
      })
    }
    else if (content.type === 'directive') {
      write(directives, propTypeDef)
    }
    else if (content.type === 'plugin') {
      write(plugins, propTypeDef)

      const makeRequiredRecursive = (definition) => transformObject(definition, (prop) => {
        makeRequired(prop)

        prop.definition = makeRequiredRecursive(prop.definition)
      })

      // Make all top-level properties required, then if it's an object, make all of its properties required recursively.
      // If it's a function, don't touch its parameters or return type
      content.props = makeRequiredRecursive(content.props)
    }

    // Methods should always be required
    content.methods = transformObject(content.methods, prop => {
      makeRequired(prop)

      prop.type = 'Function'
    })

    // computedProps should always be required
    content.computedProps = transformObject(content.computedProps, makeRequired)

    const props = getPropDefinitions({
      definitions: content.props,
      isCompProps: content.type === 'component'
    })

    // Declare class
    writeLine(quasarTypeContents, `export const ${ typeName }: ${ typeValue }`)

    if (content.events) {
      for (const [ name, definition ] of Object.entries(content.events)) {
        const propName = toCamelCase('on-' + name)
        const safeName = propName.includes(':') ? `'${ propName }'` : propName

        props.push(
          getPropDefinition({
            name: safeName,
            definition: {
              ...definition,
              type: 'Function',
              // Event listeners are always optional
              required: false,
              // Make all params(payload) required since event listeners are callbacks and will receive all parameters
              params: transformObject(definition.params, makeRequired)
            }
          })
        )
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
            // If '...self' is defined, use that as the scope
            scope: definition.scope[ '...self' ]
              ? { ...definition.scope[ '...self' ], required: true }
              : {
                  type: 'Object',
                  required: true,
                  // Make all properties required
                  definition: transformObject(definition.scope, makeRequired)
                }
          } : undefined

          const slot = getPropDefinition({
            name,
            escapeName: false,
            definition: {
              type: 'Function',
              required: true,
              desc: definition.desc,
              params,
              returns: {
                type: 'VNode[]'
              }
            }
          })

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
      const methodDefinition = getPropDefinition({ name: methodKey, definition: method })
      writeLines(contents, methodDefinition, 1)
    }

    // Write computedProps
    for (const [ fieldName, field ] of Object.entries(content.computedProps)) {
      const fieldDefinition = getPropDefinition({ name: fieldName, definition: field, isReadonly: true })
      writeLines(contents, fieldDefinition, 1)
    }

    // Close class declaration
    writeLine(contents, '}')
    writeLine(contents)

    // Copy Injections for type declaration
    if (content.type === 'plugin' && content.injection) {
      // Example: $q.dialog -> target: $q, property: dialog
      const [ target, property ] = content.injection.split('.')

      if (!injections[ target ]) {
        injections[ target ] = []
      }

      injections[ target ].push(getInjectionDefinition(property, content, typeName))
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

  const getSafeInjectionKey = key => key.toUpperCase().replace('$', '')

  // Write injection types
  for (const key in injections) {
    const injectionKey = getSafeInjectionKey(key)
    const injectionName = `${ injectionKey }VueGlobals`

    writeLine(contents, `import { ${ injectionName }, ${ injectionKey }SingletonGlobals } from "./globals";`)
    writeLine(contents, 'declare module "./globals" {')
    writeLine(contents, `export interface ${ injectionName } {`)

    const injectionDefs = injections[ key ]
    for (const defKey in injectionDefs) {
      writeLines(contents, injectionDefs[ defKey ], 1)
    }

    writeLine(contents, '}')
    writeLine(contents, '}')
  }

  writeLine(contents)

  // Extend Vue instance with injections
  writeLine(contents, 'declare module \'@vue/runtime-core\' {')
  writeLine(contents, 'interface ComponentCustomProperties {', 1)

  for (const key in injections) {
    writeLine(contents, `${ key }: ${ getSafeInjectionKey(key) }VueGlobals`, 2)
  }

  writeLine(contents, '}', 1)
  writeLine(contents, '}')
  writeLine(contents)

  // Provide `GlobalComponents`, expected to be used for Volar
  writeLine(contents, 'declare module \'@vue/runtime-core\' {')
  writeLine(contents, 'interface GlobalComponents {', 1)

  for (const [ typeName, { props: propsTypeName, slots: slotsTypeName } ] of Object.entries(componentToSubTypeMap)) {
    writeLine(contents, `${ typeName }: GlobalComponentConstructor<${ propsTypeName }, ${ slotsTypeName }>`, 2)
  }

  writeLine(contents, '}', 1)
  writeLine(contents, '}')
  writeLine(contents)

  quasarTypeContents.forEach(line => write(contents, line))
  writeLine(contents)

  writeLine(contents, 'declare module \'./plugin\' {')
  writeInterface(contents, 'QuasarComponents', components)
  writeInterface(contents, 'QuasarDirectives', directives)
  writeInterface(contents, 'QuasarPlugins', plugins)
  writeLine(contents, '}')
  writeLine(contents)

  writeLine(contents, 'import { QuasarPluginOptions } from \'./plugin\'')
  writeLine(contents, 'export const Quasar: { install: (app: App, options: Partial<QuasarPluginOptions>) => any } & QSingletonGlobals')
  writeLine(contents, 'export default Quasar')
  writeLine(contents)

  // These imports force TS compiler to evaluate contained declarations
  //  which by defaults would be ignored because inside node_modules
  //  and not directly referenced by any file
  writeLine(contents, 'import \'./shim-icon-set\'')
  writeLine(contents, 'import \'./shim-lang\'')

  return {
    header: headerContents.join(''),
    body: contents.join('')
  }
}

const ts = require('typescript')

/**
 * @throws {Error} if TypeScript validation fails
 */
function ensureTypeScriptValidity () {
  const tsConfigPath = ts.findConfigFile(distRoot, ts.sys.fileExists, 'tsconfig.json')
  if (!tsConfigPath) {
    throw Error(resolvePath('tsconfig.json') + ' not found')
  }
  const { config } = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  config.compilerOptions.noEmit = true
  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(config, ts.sys, distRoot)

  const program = ts.createProgram({ options, rootNames: fileNames, configFileParsingDiagnostics: errors })
  const emitResult = program.emit()
  const diagnostics = [ ...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics ]
  if (diagnostics.length === 0) {
    return
  }

  /** @type {ts.FormatDiagnosticsHost} */
  const formatDiagnosticsHost = {
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getCanonicalFileName: file => file,
    getNewLine: () => ts.sys.newLine
  }
  const error = new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatDiagnosticsHost))
  error.name = 'TypeScriptError'
  throw error
}

module.exports.generate = async function (data) {
  const apis = data.plugins
    .concat(data.directives)
    .concat(data.components)

  try {
    await Promise.all(copyPredefinedTypes(typeRoot))

    const { header, body } = getIndexDts(apis)
    const formattedBody = prettier.format(body, { parser: 'typescript' })

    // The header contains stuff that breaks TS checking.
    // So, write only the body at first to check the validity
    await writeFile(resolvePath('index.d.ts'), formattedBody)

    ensureTypeScriptValidity()

    // Write the final file
    await writeFile(resolvePath('index.d.ts'), header + formattedBody)
  }
  catch (err) {
    logError('build.types.js: something went wrong...')
    console.log()
    if (err.name === 'TypeScriptError') {
      console.error('Make sure .d.ts files in /ui/types and JSON API files in /ui/src are valid!')
      console.log()
      console.error(err.message)
    }
    else {
      console.error(err)
    }
    console.log()
    process.exit(1)
  }
}
