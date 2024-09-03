import { join, basename } from 'node:path'
import glob from 'fast-glob'
import { merge } from 'webpack-merge'
import fse from 'fs-extra'

import {
  rootFolder,
  resolveToRoot,
  relativeToRoot,
  logError,
  readJsonFile,
  writeFile,
  kebabCase,
  camelCase,
  capitalize,
  plural
} from './build.utils.js'

const dest = resolveToRoot('dist/api')

const extendApi = readJsonFile(
  resolveToRoot('src/api.extends.json')
)

const passthroughValues = [ true, false, 'child' ]

const slotRE = /slots\[\s*['"](\S+)['"]\s*\]|slots\.([A-Za-z]+)/g
const emitRE = /emit\(\s*['"](\S+)['"]/g

const apiIgnoreValueRegex = /^# /
const apiValuePromiseRegex = /\.then\(/
const apiValueRegex = {
  Number: /^-?\d/,
  String: /^'[^']*'$/,
  Array: /^\[.*\]$/,
  Object: /^{.*}$/,
  Boolean: /^(true|false)$/,
  Function: / => /,
  RegExp: /^\/.*\/[gimuy]*$/,
  Element: /(^document\.|^\..+|^#.+|.+El$|\$refs)/,
  Component: /^[A-Z][A-Za-z]+$/,
  'Promise<any>': apiValuePromiseRegex,
  'Promise<void>': apiValuePromiseRegex,
  'Promise<boolean>': apiValuePromiseRegex,
  'Promise<number>': apiValuePromiseRegex,
  'Promise<string>': apiValuePromiseRegex,
  'Promise<object>': apiValuePromiseRegex,
  null: /^null$/,
  undefined: /^void 0$/
}

const topSections = {
  // also update /ui/testing/generators/generator.plugin.js on the rootProps
  plugin: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => (Object(val) === val || "'meta' must be an Object"),
      addedIn: parseAddedIn,
      internal: val => (typeof val === 'boolean' || '"internal" must be a Boolean'),
      injection: val => (typeof val === 'string' || '"injection must be a string"'),
      quasarConfOptions: val => (Object(val) === val || "'quasarConfOptions' must be an Object"),
      props: val => parseObjectWithPascalCaseProps(val, 'props'),
      methods: val => parseObjectWithPascalCaseProps(val, 'methods')
    }
  },

  // also update: /ui/testing/generators/generator.component.js on the rootProps
  component: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => (Object(val) === val || "'meta' must be an Object"),
      addedIn: parseAddedIn,
      quasarConfOptions: val => parseObjectWithPascalCaseProps(val, 'quasarConfOptions'),
      props: val => parseObjectWithKebabCaseProps(val, 'props'),
      slots: val => (Object(val) === val || "'slots' must be an Object"), // TODO Qv3: kebabCase
      events: val => parseObjectWithKebabCaseProps(val, 'events'),
      methods: val => parseObjectWithPascalCaseProps(val, 'methods'),
      computedProps: val => parseObjectWithPascalCaseProps(val, 'computedProps')
    }
  },

  // also update /ui/testing/generators/generator.directive.js on the rootProps
  directive: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => (Object(val) === val || "'meta' must be an Object"),
      addedIn: parseAddedIn,
      quasarConfOptions: val => parseObjectWithPascalCaseProps(val, 'quasarConfOptions'),
      value: val => (Object(val) === val || "'value' must be an Object"),
      arg: val => (Object(val) === val || "'arg' must be an Object"),
      modifiers: val => parseObjectWithPascalCaseProps(val, 'modifiers')
    }
  }
}
Object.keys(topSections).forEach(section => {
  topSections[ section ].rootProps = Object.keys(topSections[ section ].rootValidations)
})

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// https://regex101.com/r/vkijKf/1/
const semanticRE = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function parseAddedIn (val) {
  if (val === void 0 || val === null) {
    return '"addedIn" has erroneous content'
  }

  if (typeof val !== 'string') {
    return '"addedIn" is not a string'
  }

  if (val.length === 0) {
    return '"addedIn" is empty'
  }

  if (val.charAt(0) !== 'v') {
    return `"addedIn" value (${ val }) must start with "v"`
  }

  if (semanticRE.test(val) !== true) {
    return `"addedIn" value (${ val }) must follow semantic versioning`
  }

  if (val.endsWith('.0') === true) {
    return `"addedIn" value (${ val }) must not end with '.0' (remove it)`
  }

  return true
}

function parseObjectWithPascalCaseProps (obj, objName) {
  if (Object(obj) !== obj) {
    return `"${ objName }" must be an Object`
  }

  const invalidProps = []
  for (const key in obj) {
    if (key !== camelCase(key)) {
      invalidProps.push(key)
    }
  }

  return (
    invalidProps.length === 0
    || `"${ objName }" has non camelCase key${ plural(invalidProps.length) }: ${ invalidProps.join(', ') }`
  )
}

function parseObjectWithKebabCaseProps (obj, objName) {
  if (Object(obj) !== obj) {
    return `"${ objName }" must be an Object`
  }

  const invalidProps = []
  for (const key in obj) {
    if (key !== kebabCase(key)) {
      invalidProps.push(key)
    }
  }

  return (
    invalidProps.length === 0
    || `"${ objName }" has non kebab-case key${ plural(invalidProps.length) }: ${ invalidProps.join(', ') }`
  )
}

const nativeTypes = [ 'Component', 'Error', 'Element', 'File', 'FileList', 'Event', 'SubmitEvent' ]

const objectTypes = {
  Boolean: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  String: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'transformAssetUrls', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'transformAssetUrls', 'internal' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Number: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Object: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Array: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Promise: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Function: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'params', 'returns', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc', 'params', 'returns' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isObject: [ 'params', 'returns' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  MultipleTypes: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'params', 'returns', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'internal' ],
    isObject: [ 'definition', 'params', 'returns' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  meta: {
    props: [ 'docsUrl' ],
    required: [ 'docsUrl' ]
  },

  // component only
  slots: {
    props: [ 'tsType', 'desc', 'link', 'scope', 'addedIn', 'internal' ],
    required: [ 'desc' ],
    isObject: [ 'scope' ],
    isBoolean: [ 'internal' ],
    isString: [ 'tsType', 'desc', 'addedIn' ]
  },

  // component only
  events: {
    props: [ 'tsType', 'desc', 'link', 'params', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isObject: [ 'params' ],
    isBoolean: [ 'internal' ],
    isString: [ 'tsType', 'desc', 'addedIn' ]
  },

  // component only
  computedProps: {
    props: [ 'desc', 'tsType', 'examples', 'addedIn', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'internal' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'addedIn' ]
  },

  methods: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'link', 'params', 'returns', 'addedIn', 'alias' ],
    required: [ 'desc', 'params', 'returns' ],
    isBoolean: [ 'tsInjectionPoint' ],
    isObject: [ 'params', 'returns' ],
    isString: [ 'tsType', 'desc', 'link', 'addedIn', 'alias' ]
  },

  quasarConfOptions: {
    props: [ 'tsType', 'desc', 'propName', 'definition', 'values', 'examples', 'link', 'addedIn' ],
    required: [ 'propName' ],
    isObject: [ 'definition' ],
    isArray: [ 'values' ],
    isString: [ 'tsType', 'desc', 'addedIn' ]
  }
}

nativeTypes.forEach(name => {
  objectTypes[ name ] = {
    props: [ 'tsType', 'desc', 'required', 'category', 'examples', 'addedIn', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'internal', 'required' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  }
})

/**
 * Also update /ui/testing/specs/specs.utils.js on the "typeMap" object
 */
const typeList = [
  'Number', 'String', 'Array', 'Object', 'Boolean', 'Function', 'RegExp',
  'Date', 'Element', 'Any', 'Event', 'SubmitEvent', 'File', 'FileList',
  'Promise<any>', 'Promise<void>', 'Promise<boolean>', 'Promise<number>',
  'Promise<string>', 'Promise<object>', 'Error',
  'Component', 'null', 'undefined'
]

// assumes type does NOT have any duplicates
function isClassStyleType (type) {
  if (Array.isArray(type) === false) { return false }
  if (type.length !== 3) { return false }

  let hits = 0

  ;[ 'String', 'Array', 'Object' ].forEach(entry => {
    if (type.includes(entry) === true) {
      hits++
    }
  })

  return hits === 3
}

// See https://github.com/quasarframework/quasar/issues/16046#issuecomment-1666395268 for more info
const serializableTypes = [ 'Any', 'Boolean', 'Number', 'String', 'Array', 'Object' ]
function isSerializable (value) {
  const types = Array.isArray(value.type) ? value.type : [ value.type ]

  return types.every(type => serializableTypes.includes(type))
}

function getApiWithMixins (api, mainFile) {
  api.mixins.forEach(mixin => {
    const mixinFile = resolveToRoot('src/' + mixin + '.json')

    if (!fse.existsSync(mixinFile)) {
      logError(`build.api.js: ${ relativeToRoot(mainFile) } -> no such mixin ${ mixin }`)
      process.exit(1)
    }

    const content = readJsonFile(mixinFile)

    api = merge(
      {},
      content.mixins !== void 0
        ? getApiWithMixins(content, mixinFile)
        : content,
      api
    )
  })

  const { mixins, ...finalApi } = api
  return finalApi
}

function deCapitalize (str) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

const arrayRE = /(\[.*\])/
const objectRE = /(\{.*\})/
const functionRE = /^(\s*\(\s*\)\s*=>\s*).+/
function encodeDefaultValue (val, isFunction) {
  if (typeof val === 'string') {
    return `'${ val }'`
  }

  if (typeof val === 'function') {
    const fn = val.toString()

    if (isFunction === true) return fn

    const arrayMatch = fn.match(arrayRE)
    if (arrayMatch !== null) {
      return arrayMatch[ 1 ]
    }

    const objMatch = fn.match(objectRE)
    if (objMatch !== null) {
      return objMatch[ 1 ]
    }

    const arrowMatch = fn.match(functionRE)
    if (arrowMatch !== null) {
      return fn.substring(arrowMatch[ 1 ].length)
    }
  }

  return '' + val
}

const runtimePropTypeToAny = [ 'File', 'FileList', 'Element' ]
const runtimePropTypeExceptions = [ 'null', 'undefined' ]
function extractRuntimeDefinablePropTypes (apiTypes) {
  if (apiTypes.includes('Any') === true) {
    return [ 'Any' ]
  }

  return apiTypes.some(key => runtimePropTypeToAny.includes(key) === true)
    ? [ 'Any' ]
    : apiTypes.filter(key => runtimePropTypeExceptions.includes(key) === false).sort()
}

function parseRuntimeType (runtimeConstructor) {
  // String.toString() -> "function String() { [native code] }"
  const str = runtimeConstructor.toString()
  const match = str.match(/function (\w+)\(/)
  return match?.[ 1 ]
}

const typeofRE = /typeof\s+[a-zA-Z0-9$_]+\s+===\s+'([a-zA-Z]+)'/
function extractRuntimePropAttrs (runtimeProp) {
  if (Array.isArray(runtimeProp)) {
    return {
      runtimeTypes: runtimeProp.map(parseRuntimeType).sort(),
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  const runtimeType = parseRuntimeType(runtimeProp)
  if (runtimeType !== void 0) {
    return {
      runtimeTypes: [ runtimeType ],
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  // else... it's a definition in Object form { ... }

  let runtimeTypes

  if (Array.isArray(runtimeProp.type) === true) {
    runtimeTypes = runtimeProp.type.map(parseRuntimeType)

    if (runtimeTypes.includes('Any') === true) {
      runtimeTypes = [ 'Any' ]
    }
    else {
      runtimeTypes.sort()
    }
  }
  else if (runtimeProp.type !== void 0) {
    runtimeTypes = [ parseRuntimeType(runtimeProp.type) ]
  }
  else if (runtimeProp.validator !== void 0) {
    /**
     * Example (we want Number AND null to be valid):
     *
     * modelValue: {
     *   default: null,
     *   validator: v => typeof v === 'number' || v === null
     * }
     */

    runtimeTypes = []
    const fn = runtimeProp.validator.toString()

    const match = fn.match(typeofRE)
    if (match !== null) {
      runtimeTypes.push(
        capitalize(match[ 1 ])
      )
    }

    if (fn.indexOf('Array.isArray') !== -1) {
      runtimeTypes.push('Array')
    }

    if (fn.indexOf('Object') !== -1) {
      runtimeTypes.push('Object')
    }

    if (runtimeTypes.length === 0) {
      runtimeTypes = []
    }
    else {
      runtimeTypes.sort()
    }
  }
  else {
    runtimeTypes = [ 'Any' ]
  }

  return {
    runtimeTypes,
    isRuntimeRequired: runtimeProp.required === true,
    hasRuntimeDefault: runtimeProp.hasOwnProperty('default'),
    runtimeDefaultValue: runtimeProp.default
  }
}

function parseObject ({ banner, api, itemName, masterType, verifyCategory, verifySerializable }) {
  let obj = api[ itemName ]

  const printErrorAndExit = msg => {
    logError(`${ banner } ${ msg }`)
    console.error(obj)
    console.log()
    process.exit(1)
  }

  if (obj.hasOwnProperty('addedIn') === true) {
    const result = parseAddedIn(obj.addedIn)
    if (result !== true) {
      printErrorAndExit(result)
    }
  }

  if (obj.extends !== void 0 && extendApi[ masterType ] !== void 0) {
    if (extendApi[ masterType ][ obj.extends ] === void 0) {
      printErrorAndExit(`extends "${ obj.extends }" which does not exists`)
    }

    api[ itemName ] = merge(
      {},
      extendApi[ masterType ][ obj.extends ],
      api[ itemName ]
    )
    delete api[ itemName ].extends

    obj = api[ itemName ]
  }

  // there are cases where you extend something but you
  // need to remove some props from the extended object
  if (obj.__delete !== void 0) {
    if (Array.isArray(obj.__delete) === false) {
      printErrorAndExit('"__delete" prop must be an Array')
    }

    if (obj.__delete.some(prop => typeof prop !== 'string')) {
      printErrorAndExit('"__delete" prop must be an Array of Strings')
    }

    obj.__delete.forEach(prop => {
      delete obj[ prop ]
    })

    // now delete the __delete prop itself (we don't need it in the final API)
    delete obj.__delete
  }

  let type

  if ([ 'props', 'modifiers' ].includes(masterType)) {
    if (obj.type === void 0) {
      printErrorAndExit('missing "type" prop')
    }

    type = Array.isArray(obj.type) || obj.type === 'Any'
      ? 'MultipleTypes'
      : obj.type
  }
  else {
    type = masterType
  }

  type = type.startsWith('Promise') ? 'Promise' : type
  const def = objectTypes[ type ]

  if (def === void 0) {
    printErrorAndExit(`object has unrecognized API type prop value: "${ type }"`)
  }

  if (obj.internal !== true) {
    const regexList = Array.isArray(obj.type)
      ? (obj.type.includes('Any') ? [] : obj.type.map(t => apiValueRegex[ t ]).filter(v => v))
      : (obj.type === 'Any' ? [] : [ apiValueRegex[ obj.type ] ].filter(v => v))

    for (const prop in obj) {
      // These props are always valid and doesn't need to be specified in 'props' of 'objectTypes' entries
      if ([ 'type', '__exemption' ].includes(prop) === true) {
        continue
      }

      if (prop === '__runtimeDefault') {
        if (obj.__runtimeDefault !== true) {
          printErrorAndExit(
            'props > "__runtimeDefault" should only be set to true; Solutions:'
            + '\n  1. delete it as it is indeed an error'
            + '\n  2. it is being inherited, so add "delete": [ "__runtimeDefault" ]'
          )
        }

        continue
      }

      // 'configFileType' is always valid in any level of 'quasarConfOptions' and nothing else
      if (prop === 'configFileType' && banner.includes('"quasarConfOptions"')) {
        continue
      }

      if (!def.props.includes(prop)) {
        printErrorAndExit(`object has unrecognized API prop "${ prop }" for its type (${ type })`)
      }
    }

    ;[ ...def.required, ...(verifyCategory ? [ 'category' ] : []) ].forEach(prop => {
      if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
        return
      }

      // 'examples' property is not required if 'definition' or 'values' properties are specified
      if (prop === 'examples' && (obj.definition !== void 0 || obj.values !== void 0)) {
        const matchedProp = obj.definition !== void 0
          ? 'definition'
          : 'values'

        printErrorAndExit(`"examples" is not needed because there is "${ matchedProp }"; remove it`)
        return
      }

      if (obj[ prop ] === void 0) {
        printErrorAndExit(`missing required API prop "${ prop }" for its type (${ type })`)
      }
    })

    // Since we processed '__exemption', we can strip it
    if (obj.__exemption !== void 0) {
      const { __exemption, ...p } = obj
      api[ itemName ] = p
    }

    def.isBoolean && def.isBoolean.forEach(prop => {
      if (obj.hasOwnProperty(prop) && obj[ prop ] !== true && obj[ prop ] !== false) {
        printErrorAndExit(`"${ prop }" is not a Boolean`)
      }
    })
    def.isObject && def.isObject.forEach(prop => {
      if (obj[ prop ] && Object(obj[ prop ]) !== obj[ prop ]) {
        printErrorAndExit(`"${ prop }" is not an Object`)
      }
    })
    def.isArray && def.isArray.forEach(prop => {
      if (obj[ prop ] && !Array.isArray(obj[ prop ])) {
        printErrorAndExit(`"${ prop }" is not an Array`)
      }
    })
    def.isString && def.isString.forEach(prop => {
      if (obj[ prop ] && typeof obj[ prop ] !== 'string') {
        printErrorAndExit(`"${ prop }" is not a String`)
      }
    })

    if (obj.type) {
      const list = Array.isArray(obj.type) ? obj.type : [ obj.type ]
      list.forEach(t => {
        if (typeList.includes(t) === false) {
          printErrorAndExit(
            `object has unrecognized type "${ t }"; if this is a new type, then `
            + 'add it to the "typeList" array in build.api.js'
          )
        }
      })
    }

    if (obj.values) {
      if (obj.values.some(val => typeof val !== 'string')) {
        printErrorAndExit('object: stringify each of "values" entries')
      }

      if (regexList.length !== 0) {
        obj.values.forEach(val => {
          if (
            apiIgnoreValueRegex.test(val) === false
            && regexList.every(regex => regex.test(val) === false)
          ) {
            printErrorAndExit(
              `object: "values" -> "${ val }" value must satisfy regex: `
              + `${ regexList.map(r => r.toString()).join(' or ') }`
            )
          }
        })
      }
    }

    if (obj.hasOwnProperty('default')) {
      if (typeof obj.default !== 'string') {
        printErrorAndExit('object: stringify "default" value')
      }

      if (apiIgnoreValueRegex.test(obj.default) === false) {
        if (regexList.length !== 0 && regexList.every(regex => regex.test(obj.default) === false)) {
          printErrorAndExit(
            `object: "default" value must satisfy regex: ${ regexList.map(r => r.toString()).join(' or ') }`
          )
        }

        if (obj.values && obj.values.includes(obj.default) === false) {
          printErrorAndExit('object: "default" value must be one of the "values"')
        }
      }
    }

    if (obj.examples !== void 0) {
      if (obj.examples.some(val => typeof val !== 'string')) {
        printErrorAndExit('object: stringify each of "examples" entries')
      }

      if (regexList.length !== 0) {
        obj.examples.forEach(val => {
          if (
            apiIgnoreValueRegex.test(val) === false
            && regexList.every(regex => regex.test(val) === false)
          ) {
            printErrorAndExit(
              `object: "examples" -> "${ val }" value must satisfy regex: ${ regexList.map(r => r.toString()).join(' or ') }`
            )
          }
        })
      }

      if ((new Set(obj.examples)).size !== obj.examples.length) {
        printErrorAndExit('object has "examples" Array with duplicates')
      }
    }

    if (
      obj.hasOwnProperty('passthrough') === true
      && passthroughValues.includes(obj.passthrough) === false
    ) {
      printErrorAndExit(`"passthrough" should be one of: ${ passthroughValues.join('|') }`)
    }

    if (obj.default !== void 0 && obj.required === true) {
      if (
        Array.isArray(obj.type) === true
          ? (obj.type.includes('Any') !== true && obj.type.includes('undefined') !== true)
          : [ 'Any', 'undefined' ].includes(obj.type) !== true
      ) {
        printErrorAndExit(
          'cannot have "required" as true since it is optional because it has "default" '
          + '(if default is still required as it handles the "undefined" value, then '
          + 'add "__requireWithDefault": true)'
        )
      }
    }

    // If required is specified, use it, if not and it has a default value, then it's optional,
    // otherwise use undefined so it can get overridden later
    api[ itemName ].required = obj.required !== void 0
      ? obj.required
      : (obj.default !== void 0 ? false : undefined)
  }

  if (obj.tsType && obj.autoDefineTsType === true && !obj.definition) {
    printErrorAndExit(
      `object is auto defining "${ obj.tsType }" TS type but it is missing "definition" prop`
    )
  }

  if (masterType === 'props') {
    if (Array.isArray(obj.type) === true && (new Set(obj.type)).size !== obj.type.length) {
      printErrorAndExit(
        'object has "type" defined as Array, but the Array contains duplicates'
      )
    }

    if (itemName.indexOf('class') !== -1) {
      if (obj.type === 'Object' && obj.tsType !== 'VueClassObjectProp') {
        printErrorAndExit(
          'object is class-type (Object form) but "tsType" prop is set to '
          + `"${ obj.tsType }" instead of "VueClassObjectProp":`
        )
      }
      else if (obj.tsType !== 'VueClassProp' && isClassStyleType(obj.type) === true) {
        printErrorAndExit(
          'object is class-type (String/Array/Object form) but "tsType" prop '
          + `is set to "${ obj.tsType }" instead of "VueClassProp":`
        )
      }
    }
    else if (itemName.indexOf('style') !== -1) {
      if (obj.type === 'Object' && obj.tsType !== 'VueStyleObjectProp') {
        printErrorAndExit(
          'object is style-type (Object form) but "tsType" prop is '
          + `set to "${ obj.tsType }" instead of "VueStyleObjectProp":`
        )
      }
      else if (obj.tsType !== 'VueStyleProp' && isClassStyleType(obj.type) === true) {
        printErrorAndExit(
          'object is style-type (String/Array/Object form) but "tsType" prop '
          + `is set to "${ obj.tsType }" instead of "VueStyleProp":`
        )
      }
    }

    if (verifySerializable && obj.configFileType === undefined && isSerializable(obj) === false) {
      printErrorAndExit(
        'object\'s type is non-serializable but props in "quasarConfOptions" can only consist of '
        + `${ serializableTypes.join('/') } to be used in quasar.config file. Use "configFileType" `
        + 'prop to specify a serializable type for quasar.config file, or set to null if there is no suitable type:'
      )
    }
  }

  // If it must be synced, then it is syncable too (v-model:xyz)
  if (obj.sync === true) {
    obj.syncable = true
  }

  if (obj.returns) {
    parseObject({
      banner: `${ banner }/"returns"`,
      api: api[ itemName ],
      itemName: 'returns',
      masterType: 'props'
    })
  }

  ;[ 'params', 'definition', 'scope', 'props' ].forEach(prop => {
    if (!obj[ prop ]) return

    for (const item in obj[ prop ]) {
      parseObject({
        banner: `${ banner }/"${ prop }"/"${ item }"`,
        api: api[ itemName ][ prop ],
        itemName: item,
        masterType: 'props',
        verifySerializable
      })
    }
  })
}

function parseAPI (file, apiType) {
  let api = readJsonFile(file)

  if (api.mixins !== void 0) {
    api = getApiWithMixins(api, file)
  }

  const banner = `build.api.js: ${ relativeToRoot(file) } -> `
  const printErrorAndExit = msg => {
    logError(`${ banner } ${ msg }`)
    console.log()
    process.exit(1)
  }

  if (api.meta === void 0 || api.meta.docsUrl === void 0) {
    printErrorAndExit('API file does not contain meta > docsUrl')
  }

  // "props", "slots", ...
  for (const type in api) {
    if (!topSections[ apiType ].rootProps.includes(type)) {
      printErrorAndExit(` "${ type }" is not recognized for a ${ apiType }`)
    }

    if (api.hasOwnProperty(type) === true) {
      const result = topSections[ apiType ].rootValidations[ type ](api[ type ])
      if (result !== true) {
        printErrorAndExit(result)
      }
    }
  }

  const handledTypes = [ 'addedIn', 'injection' ]

  for (const type of [ 'meta', 'quasarConfOptions' ]) {
    if (api[ type ] !== void 0) {
      parseObject({
        banner: `${ banner } "${ type }"`,
        api,
        itemName: type,
        masterType: type,
        verifySerializable: type === 'quasarConfOptions'
      })
    }
  }
  handledTypes.push('meta', 'quasarConfOptions')

  for (const type of [ 'value', 'arg' ]) {
    if (api[ type ] !== void 0) {
      parseObject({
        banner: `${ banner } "${ type }"`,
        api,
        itemName: type,
        masterType: 'props'
      })
    }
  }
  handledTypes.push('value', 'arg')

  const isComponent = banner.indexOf('component') !== -1

  for (const type in api) {
    const targetApi = api[ type ]
    if (handledTypes.includes(type) === true) continue

    for (const itemName in targetApi) {
      parseObject({
        banner: `${ banner } "${ type }"/"${ itemName }"`,
        api: targetApi,
        itemName,
        masterType: type === 'computedProps' ? 'props' : type,
        verifyCategory: type === 'props' && isComponent
      })
    }
  }

  return api
}

function orderAPI (api, apiType) {
  const ordered = { type: apiType }

  topSections[ apiType ].rootProps.forEach(section => {
    if (api[ section ] !== void 0) {
      ordered[ section ] = api[ section ]
    }
  })

  return ordered
}

function fillAPI (apiType, list, encodeFn) {
  return async file => {
    const name = basename(file)
    const filePath = join(dest, name)
    const api = orderAPI(
      parseAPI(file, apiType),
      apiType
    )

    if (apiType === 'component') {
      let hasError = false

      const componentPath = file.replace('.json', '.js')
      const componentName = name.replace('.json', '.js')
      const componentContent = fse.readFileSync(componentPath, 'utf-8')

      let RuntimeComponent

      try {
        const comp = await import(componentPath)
        RuntimeComponent = comp.default
      }
      catch (err) {
        logError(`${ componentName }: failed to import Component file; check if it is a valid ES module`)
        console.error(err)
        process.exit(1)
      }

      const apiProps = api.props || {}
      const apiEvents = api.events || {}
      const apiSlots = api.slots || {}

      const runtimeProps = RuntimeComponent.props || {}
      const runtimeEmits = RuntimeComponent.emits || []

      let match

      while ((match = slotRE.exec(componentContent)) !== null) {
        const slotName = (match[ 1 ] || match[ 2 ]).replace(/(\${.+})/g, '[name]')

        if (apiSlots[ slotName ] === void 0) {
          logError(`${ name }: missing "slot" -> "${ slotName }" definition (found slots usage with it)`)
          hasError = true
        }
      }

      while ((match = emitRE.exec(componentContent)) !== null) {
        const matchedEmit = match[ 1 ]
        const emitName = kebabCase(deCapitalize(matchedEmit)) // deCapitalize because: QTable > emit('RowClick')
        const propName = `on${ capitalize(matchedEmit) }`

        if (
          runtimeEmits.includes(matchedEmit) === false
          && runtimeProps[ propName ] === void 0
        ) {
          logError(
            `${ componentName }: Component is emitting "${ matchedEmit }" event without having `
            + 'it defined in its code; Solutions:'
            + `\n   1. add it in the Component as "emits: [ '${ matchedEmit }' ]"`
            + `\n   2. or as "props: { ${ propName }: ... }"`
          )
          hasError = true
        }

        if (apiEvents[ emitName ] === void 0) {
          logError(`${ name }: missing "events" -> "${ emitName }" definition (found emit() with it)`)
          hasError = true
        }
      }

      // runtime props should be defined in the API
      for (const runtimePropName in runtimeProps) {
        const apiPropName = kebabCase(runtimePropName)
        const apiEntry = apiProps[ apiPropName ]

        if (runtimePropName.indexOf('-') !== -1) {
          logError(
            `${ componentName }: prop "${ runtimePropName }" should be `
            + 'in camelCase (found kebab-case)'
          )
          hasError = true
        }

        if (/^on[A-Z]/.test(runtimePropName) === true) {
          const strippedPropName = runtimePropName.slice(2) // strip "on" prefix
          const runtimeEmitName = deCapitalize(strippedPropName)
          const apiEventName = kebabCase(strippedPropName)

          // should not duplicate as prop and emit
          if (runtimeEmits.includes(runtimeEmitName) === true) {
            logError(
              `${ componentName }: Component has duplicated prop (${ runtimePropName }) + `
              + `emit (${ runtimeEmitName }); only one should be defined`
            )
            hasError = true
          }

          if (apiEntry !== void 0) {
            logError(
              `${ name }: "props" -> "${ apiPropName }" should instead be defined `
              + `as "events" -> "${ apiEventName }"`
            )
            hasError = true
          }

          if (apiEvents[ apiEventName ] === void 0) {
            logError(
              `${ name }: missing "events" -> "${ apiEventName }" definition `
              + `(found Component prop "${ runtimePropName }")`
            )
            hasError = true
          }

          continue
        }

        const runtimePropEntry = runtimeProps[ runtimePropName ]

        if (apiEntry === void 0) {
          logError(
            `${ name }: missing "props" -> "${ apiPropName }" definition `
            + `(found Component prop "${ runtimePropName }")`
          )
          hasError = true
        }
        else if (apiEntry.passthrough === 'child') {
          if (
            Object(runtimePropEntry) !== runtimePropEntry
            || Object.keys(runtimePropEntry).length !== 0
          ) {
            logError(
              `${ name }: "props" -> "${ apiPropName }" is marked as `
              + 'passthrough="child" but its definition is NOT an empty Object'
            )
            console.log(apiEntry)
            hasError = true
          }
        }
        else {
          const apiTypes = Array.isArray(apiEntry.type) ? apiEntry.type : [ apiEntry.type ]

          const {
            runtimeTypes,
            isRuntimeRequired,
            hasRuntimeDefault,
            runtimeDefaultValue
          } = extractRuntimePropAttrs(runtimePropEntry)

          const isRuntimeFunction = runtimeTypes.length === 1 && runtimeTypes[ 0 ] === 'Function'
          const runtimeDefinableApiTypes = extractRuntimeDefinablePropTypes(apiTypes)

          // API "type" validation against runtime
          if (
            runtimeDefinableApiTypes.length !== runtimeTypes.length
            || runtimeDefinableApiTypes.every((t, i) => t === runtimeTypes[ i ]) === false
          ) {
            logError(
              `${ name }: wrong definition for prop "${ apiPropName }" - `
              + `JSON as ${ JSON.stringify(apiTypes) } `
              + `vs Component as ${ JSON.stringify(runtimeTypes) }`
            )
            console.log(apiEntry)
            hasError = true
          }

          // API "required" validation against runtime
          if (isRuntimeRequired === true && apiEntry.required !== true) {
            logError(`${ name }: "props" -> "${ apiPropName }" is missing the required=true flag`)
            console.log(apiEntry)
            hasError = true
          }

          // API "default" value validation against runtime
          if (hasRuntimeDefault === true) {
            if (apiEntry.hasOwnProperty('default') === false) {
              logError(
                `${ name }: "props" -> "${ apiPropName }" is missing "default" with `
                + `value: "${ encodeDefaultValue(runtimeDefaultValue, isRuntimeFunction) }"`
              )
              console.log(apiEntry)
              hasError = true
            }
            else if (apiIgnoreValueRegex.test(apiEntry.default) === false) {
              const encodedValue = encodeDefaultValue(runtimeDefaultValue, isRuntimeFunction)

              if (apiEntry.default !== encodedValue) {
                let handledAlready = false

                if (isRuntimeFunction === true) {
                  const fn = runtimeDefaultValue.toString()

                  if (fn.indexOf('\n') !== -1) {
                    logError(
                      `${ componentName }: prop "${ runtimePropName }" -> "default" `
                      + 'should be a single line arrow function (found multiple lines)'
                    )
                    console.log(apiEntry)
                    hasError = true
                    handledAlready = true
                  }

                  if (handledAlready === false && functionRE.test(fn) === false) {
                    logError(
                      `${ componentName }: prop "${ runtimePropName }" -> "default" should `
                      + 'be an arrow function that begins with: "() => "'
                    )
                    console.log(apiEntry)
                    hasError = true
                  }

                  if (handledAlready === false && /^[a-zA-Z]/.test(encodedValue) === true) {
                    logError(
                      `${ componentName }: prop "${ runtimePropName }" -> "default" should `
                      + 'be an arrow factory function that does not reference any external variables'
                    )
                    console.log(apiEntry)
                    hasError = true
                  }
                }

                if (handledAlready === false && apiEntry.__runtimeDefault !== true) {
                  logError(
                    `${ name }: "props" -> "${ apiPropName }" > "default" value should `
                    + `be: "${ encodedValue }" (instead of "${ apiEntry.default }")`
                  )
                  console.log(apiEntry)
                  hasError = true
                }
              }

              if (apiEntry.__runtimeDefault === true && runtimeDefaultValue !== null) {
                logError(
                  `${ name }: "props" -> "${ apiPropName }" should NOT `
                  + 'have "__runtimeDefault" (found static value on Component)'
                )
                console.log(apiEntry)
                hasError = true
              }
            }
          }
          else if (apiEntry.__runtimeDefault !== true && apiEntry.hasOwnProperty('default') === true) {
            logError(
              `${ name }: "props" -> "${ apiPropName }" should NOT have a "default" value; Solutions:`
              + '\n  1. remove "default" because it should indeed not have it'
              + '\n  2. it is runtime computed, in which case add "__runtimeDefault": true'
              + '\n  3. it handles the "undefined" value, in which case add "undefined" or "Any" to the "type"'
            )
            console.log(apiEntry)
            hasError = true
          }
        }
      }

      // API defined props should exist in the component
      for (const apiPropName in apiProps) {
        const apiEntry = apiProps[ apiPropName ]
        const runtimeName = camelCase(apiPropName)

        if (apiEntry.passthrough === true) {
          if (runtimeProps[ runtimeName ] !== void 0) {
            logError(
              `${ name }: "props" -> "${ apiPropName }" should NOT be `
              + 'a "passthrough" as it exists in the Component too'
            )
            console.log(apiEntry)
            hasError = true
          }

          continue
        }

        if (runtimeProps[ runtimeName ] === void 0) {
          logError(
            `${ name }: "props" -> "${ apiPropName }" is in JSON but `
            + 'not in the Component (is it a passthrough?)'
          )
          console.log(apiEntry)
          hasError = true
        }
      }

      // runtime emits should be defined in the API as events
      for (const runtimeEmitName of runtimeEmits) {
        const apiEventName = kebabCase(runtimeEmitName)

        if (apiEvents[ apiEventName ] === void 0) {
          logError(
            `${ name }: missing "events" -> "${ apiEventName }" definition `
            + `(found Component > emits: "${ runtimeEmitName }")`
          )
          hasError = true
        }

        if (runtimeEmitName.indexOf('-') !== -1) {
          logError(
            `${ componentName }: "emits" -> "${ runtimeEmitName }" should be`
            + ' in camelCase (found kebab-case)'
          )
          hasError = true
        }
      }

      // API defined events should exist in the component
      for (const apiEventName in apiEvents) {
        const apiEntry = apiEvents[ apiEventName ]

        const runtimeEmitName = camelCase(apiEventName)
        const runtimePropName = `on${ capitalize(runtimeEmitName) }`

        if (apiEntry.passthrough === true) {
          if (runtimeProps[ runtimePropName ] !== void 0) {
            logError(
              `${ name }: "events" -> "${ apiEventName }" should NOT be `
              + 'a "passthrough" as it exists in the Component too'
            )
            console.log(apiEntry)
            hasError = true
          }

          if (runtimeEmits.includes(runtimeEmitName) === true) {
            logError(
              `${ name }: "events" -> "${ apiEventName }" should NOT be a "passthrough" `
              + `as it exists in the Component (as emits: ${ runtimeEmitName })`
            )
            console.log(apiEntry)
            hasError = true
          }

          continue
        }

        if (
          runtimeProps[ runtimePropName ] === void 0
          && runtimeEmits.includes(runtimeEmitName) === false
        ) {
          logError(
            `${ name }: "events" -> "${ apiEventName }" is in JSON but `
            + 'not in the Component (is it a passthrough?)'
          )
          console.log(apiEntry)
          hasError = true
        }
      }

      if (hasError === true) {
        logError('Errors were found... exiting with error')
        process.exit(1)
      }

      Object.keys(api).forEach(section => {
        const target = api[ section ]

        if (Object(target) === target) {
          for (const key in target) {
            const entry = target[ key ]
            if (Object(entry) !== entry) continue

            if (entry.internal === true) {
              delete target[ key ]
            }
            else if (entry.internal === false) {
              // save bytes over the wire
              delete entry.internal
            }

            if (
              entry.hasOwnProperty('passthrough') === true
              && entry.passthrough !== true
            ) {
              // save bytes over the wire
              delete entry.passthrough
            }

            if (entry.hasOwnProperty('__runtimeDefault') === true) {
              // API internal prop; not needed in the final API
              delete entry.__runtimeDefault
            }
          }

          // we might have only internal stuff in a key (which was deleted above)
          if (Object.keys(target).length === 0) {
            delete api[ section ]
          }
        }
      })
    }

    // copy API file to dest
    writeFile(filePath, encodeFn(api))

    const shortName = name.substring(0, name.length - 5)
    list.push(shortName)

    return {
      name: shortName,
      api
    }
  }
}

function writeTransformAssetUrls (components, encodeFn) {
  const transformAssetUrls = {
    base: null,
    includeAbsolute: false,
    tags: {
      video: [ 'src', 'poster' ],
      source: [ 'src' ],
      img: [ 'src' ],
      image: [ 'xlink:href', 'href' ],
      use: [ 'xlink:href', 'href' ]
    }
  }

  components.forEach(({ name, api }) => {
    if (api.props !== void 0) {
      let props = Object.keys(api.props)
        .filter(name => api.props[ name ].transformAssetUrls === true)

      if (props.length > 0) {
        props = props.length > 1
          ? props
          : props[ 0 ]

        transformAssetUrls.tags[ name ] = props
        transformAssetUrls.tags[ kebabCase(name) ] = props
      }
    }
  })

  writeFile(
    resolveToRoot('dist/transforms/loader-asset-urls.json'),
    encodeFn(transformAssetUrls)
  )
}

function writeApiIndex (list, encodeFn) {
  writeFile(
    resolveToRoot('dist/transforms/api-list.json'),
    encodeFn(list)
  )
}

function prepareRuntimeImports () {
  // we prepare importing UI code so that it won't crash
  global.__QUASAR_SSR__ = true
  global.__QUASAR_SSR_SERVER__ = true
  global.__QUASAR_SSR_CLIENT__ = false
}

function resetRuntimeImports () {
  // we revert the changes we did to global because
  // we are done with importing the UI code
  delete global.__QUASAR_SSR__
  delete global.__QUASAR_SSR_SERVER__
  delete global.__QUASAR_SSR_CLIENT__
}

export async function generate ({ compact = false } = {}) {
  const encodeFn = compact === true
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  prepareRuntimeImports()

  try {
    const list = []

    const plugins = await Promise.all(
      glob.sync([
        'src/plugins/*/*.json',
        'src/Brand.json'
      ], { cwd: rootFolder, absolute: true })
        .map(fillAPI('plugin', list, encodeFn))
    )

    const directives = await Promise.all(
      glob
        .sync('src/directives/*/*.json', { cwd: rootFolder, absolute: true })
        .map(fillAPI('directive', list, encodeFn))
    )

    const components = await Promise.all(
      glob
        .sync('src/components/*/Q*.json', { cwd: rootFolder, absolute: true })
        .map(fillAPI('component', list, encodeFn))
    )

    resetRuntimeImports()

    writeTransformAssetUrls(components, encodeFn)
    writeApiIndex(list.sort(), encodeFn)

    return { components, directives, plugins }
  }
  catch (err) {
    resetRuntimeImports()

    logError('build.api.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
