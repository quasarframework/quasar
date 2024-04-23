const path = require('node:path')
const glob = require('fast-glob')
const { merge } = require('webpack-merge')
const fse = require('fs-extra')

const root = path.resolve(__dirname, '..')
const resolvePath = file => path.resolve(root, file)
const dest = path.join(root, 'dist/api')
const extendApi = require(resolvePath('src/api.extends.json'))
const { logError, writeFile, kebabCase } = require('./build.utils')
const ast = require('./ast')

const slotRegex = /\(slots\[['`](\S+)['`]\]|\(slots\.([A-Za-z]+)|hSlot\(this, '(\S+)'|hUniqueSlot\(this, '(\S+)'|hMergeSlot\(this, '(\S+)'|hMergeSlotSafely\(this, '(\S+)'/g
const apiIgnoreValueRegex = /^# /
const apiValuePromiseRegex = /\.then\(/
const apiValueRegex = {
  Number: /^-?\d/,
  String: /^'[^']+'$/,
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

function getMixedInAPI (api, mainFile) {
  api.mixins.forEach(mixin => {
    const mixinFile = resolvePath('src/' + mixin + '.json')

    if (!fse.existsSync(mixinFile)) {
      logError(`build.api.js: ${ path.relative(root, mainFile) } -> no such mixin ${ mixin }`)
      process.exit(1)
    }

    const content = require(mixinFile)

    api = merge(
      {},
      content.mixins !== void 0
        ? getMixedInAPI(content, mixinFile)
        : content,
      api
    )
  })

  const { mixins, ...finalApi } = api
  return finalApi
}

const topSections = {
  // also update /ui/testing/generators/generator.plugin.js
  plugin: [ 'meta', 'injection', 'quasarConfOptions', 'addedIn', 'props', 'methods', 'internal' ],

  // also update: /ui/testing/generators/generator.component.js
  component: [ 'meta', 'quasarConfOptions', 'addedIn', 'props', 'slots', 'events', 'methods', 'computedProps' ],

  // also update /ui/testing/generators/generator.directive.js
  directive: [ 'meta', 'quasarConfOptions', 'addedIn', 'value', 'arg', 'modifiers' ]
}

const nativeTypes = [ 'Component', 'Error', 'Element', 'File', 'FileList', 'Event', 'SubmitEvent' ]

const objectTypes = {
  Boolean: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  String: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'transformAssetUrls', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'transformAssetUrls', 'internal', 'passthrough' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Number: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Object: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Array: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Promise: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  Function: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'default', 'params', 'returns', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc', 'params', 'returns' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isObject: [ 'params', 'returns' ],
    isArray: [ 'examples' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  MultipleTypes: {
    props: [ 'tsInjectionPoint', 'tsType', 'autoDefineTsType', 'desc', 'required', 'reactive', 'sync', 'syncable', 'link', 'values', 'default', 'definition', 'params', 'returns', 'examples', 'category', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'syncable', 'passthrough', 'internal' ],
    isObject: [ 'definition', 'params', 'returns' ],
    isArray: [ 'examples', 'values' ],
    isString: [ 'tsType', 'desc', 'category', 'addedIn' ]
  },

  meta: {
    props: [ 'docsUrl' ],
    required: []
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
    isBoolean: [ 'passthrough', 'internal' ],
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
    props: [ 'tsType', 'desc', 'required', 'category', 'examples', 'addedIn', 'passthrough', 'internal' ],
    required: [ 'desc' ],
    isBoolean: [ 'passthrough', 'internal' ],
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

function parseObject ({ banner, api, itemName, masterType, verifyCategory, verifySerializable }) {
  let obj = api[ itemName ]

  if (obj.addedIn !== void 0) {
    handleAddedIn(obj.addedIn, banner)
  }

  if (obj.extends !== void 0 && extendApi[ masterType ] !== void 0) {
    if (extendApi[ masterType ][ obj.extends ] === void 0) {
      logError(`${ banner } extends "${ obj.extends }" which does not exists`)
      process.exit(1)
    }

    api[ itemName ] = merge(
      {},
      extendApi[ masterType ][ obj.extends ],
      api[ itemName ]
    )
    delete api[ itemName ].extends

    obj = api[ itemName ]
  }

  let type

  if ([ 'props', 'modifiers' ].includes(masterType)) {
    if (obj.type === void 0) {
      logError(`${ banner } missing "type" prop`)
      process.exit(1)
    }

    type = Array.isArray(obj.type) || obj.type === 'Any'
      ? 'MultipleTypes'
      : obj.type
  }
  else {
    type = masterType
  }

  type = type.startsWith('Promise') ? 'Promise' : type

  if (objectTypes[ type ] === void 0) {
    logError(`${ banner } object has unrecognized API type prop value: "${ type }"`)
    console.error(obj)
    process.exit(1)
  }

  const def = objectTypes[ type ]

  if (obj.internal !== true) {
    const regexList = Array.isArray(obj.type)
      ? (obj.type.includes('Any') ? [] : obj.type.map(t => apiValueRegex[ t ]).filter(v => v))
      : (obj.type === 'Any' ? [] : [ apiValueRegex[ obj.type ] ].filter(v => v))

    for (const prop in obj) {
      // These props are always valid and doesn't need to be specified in 'props' of 'objectTypes' entries
      if ([ 'type', '__exemption' ].includes(prop) === true) {
        continue
      }

      // 'configFileType' is always valid in any level of 'quasarConfOptions' and nothing else
      if (prop === 'configFileType' && banner.includes('"quasarConfOptions"')) {
        continue
      }

      if (!def.props.includes(prop)) {
        logError(`${ banner } object has unrecognized API prop "${ prop }" for its type (${ type })`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    }

    ;[ ...def.required, ...(verifyCategory ? [ 'category' ] : []) ].forEach(prop => {
      if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
        return
      }
      // 'examples' property is not required if 'definition' or 'values' properties are specified
      if (prop === 'examples' && (obj.definition !== void 0 || obj.values !== void 0)) {
        return
      }

      if (obj[ prop ] === void 0) {
        logError(`${ banner } missing required API prop "${ prop }" for its type (${ type })`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    if (obj.type) {
      const list = Array.isArray(obj.type) ? obj.type : [ obj.type ]
      list.forEach(t => {
        if (typeList.includes(t) === false) {
          logError(`${ banner } object has unrecognized type "${ t }"; if this is a new type, then add it to the "typeList" array in build.api.js`)
          console.error(obj)
          console.log()
          process.exit(1)
        }
      })
    }

    if (obj.default) {
      if (typeof obj.default !== 'string') {
        logError(`${ banner } object: stringify "default" value`)
        console.error(obj)
        console.log()
        process.exit(1)
      }

      if (
        regexList.length !== 0
        && apiIgnoreValueRegex.test(obj.default) === false
        && regexList.every(regex => regex.test(obj.default) === false)
      ) {
        logError(`${ banner } object: "default" value must satisfy regex: ${ regexList.map(r => r.toString()).join(' or ') }`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    }

    if (obj.values) {
      if (obj.values.some(val => typeof val !== 'string')) {
        logError(`${ banner } object: stringify each of "values" entries`)
        console.error(obj)
        console.log()
        process.exit(1)
      }

      if (regexList.length !== 0) {
        obj.values.forEach(val => {
          if (
            apiIgnoreValueRegex.test(val) === false
            && regexList.every(regex => regex.test(val) === false)
          ) {
            logError(`${ banner } object: "values" -> "${ val }" value must satisfy regex: ${ regexList.map(r => r.toString()).join(' or ') }`)
            console.error(obj)
            console.log()
            process.exit(1)
          }
        })
      }
    }

    if (obj.examples) {
      if (obj.examples.some(val => typeof val !== 'string')) {
        logError(`${ banner } object: stringify each of "examples" entries`)
        console.error(obj)
        console.log()
        process.exit(1)
      }

      if (regexList.length !== 0) {
        obj.examples.forEach(val => {
          if (
            apiIgnoreValueRegex.test(val) === false
            && regexList.every(regex => regex.test(val) === false)
          ) {
            logError(`${ banner } object: "examples" -> "${ val }" value must satisfy regex: ${ regexList.map(r => r.toString()).join(' or ') }`)
            console.error(obj)
            console.log()
            process.exit(1)
          }
        })
      }

      if ((new Set(obj.examples)).size !== obj.examples.length) {
        logError(`${ banner } object has "examples" Array with duplicates`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    }

    // Since we processed '__exemption', we can strip it
    if (obj.__exemption !== void 0) {
      const { __exemption, ...p } = obj
      api[ itemName ] = p
    }

    def.isBoolean && def.isBoolean.forEach(prop => {
      if (obj[ prop ] && obj[ prop ] !== true && obj[ prop ] !== false) {
        logError(`${ banner }/"${ prop }" is not a Boolean`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
    def.isObject && def.isObject.forEach(prop => {
      if (obj[ prop ] && Object(obj[ prop ]) !== obj[ prop ]) {
        logError(`${ banner }/"${ prop }" is not an Object`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
    def.isArray && def.isArray.forEach(prop => {
      if (obj[ prop ] && !Array.isArray(obj[ prop ])) {
        logError(`${ banner }/"${ prop }" is not an Array`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
    def.isString && def.isString.forEach(prop => {
      if (obj[ prop ] && typeof obj[ prop ] !== 'string') {
        logError(`${ banner }/"${ prop }" is not a String`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    if (obj.default !== void 0 && obj.required === true) {
      logError(`${ banner } cannot have "required" as true since it is optional because it has "default"`)
      console.error(obj)
      console.log()
      process.exit(1)
    }

    // If required is specified, use it, if not and it has a default value, then it's optional, otherwise use undefined so it can get overridden later
    api[ itemName ].required = obj.required !== void 0 ? obj.required : obj.default !== void 0 ? false : undefined
  }

  if (obj.tsType && obj.autoDefineTsType === true && !obj.definition) {
    logError(`${ banner } object is auto defining "${ obj.tsType }" TS type but it is missing "definition" prop`)
    console.error(obj)
    console.log()
    process.exit(1)
  }

  if (masterType === 'props') {
    if (Array.isArray(obj.type) === true && (new Set(obj.type)).size !== obj.type.length) {
      logError(`${ banner } object has "type" defined as Array, but the Array contains duplicates`)
      console.error(obj)
      console.log()
      process.exit(1)
    }

    if (itemName.indexOf('class') !== -1) {
      if (obj.type === 'Object' && obj.tsType !== 'VueClassObjectProp') {
        logError(`${ banner } object is class-type (Object form) but "tsType" prop is set to "${ obj.tsType }" instead of "VueClassObjectProp":`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
      else if (obj.tsType !== 'VueClassProp' && isClassStyleType(obj.type) === true) {
        logError(`${ banner } object is class-type (String/Array/Object form) but "tsType" prop is set to "${ obj.tsType }" instead of "VueClassProp":`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    }
    else if (itemName.indexOf('style') !== -1) {
      if (obj.type === 'Object' && obj.tsType !== 'VueStyleObjectProp') {
        logError(`${ banner } object is style-type (Object form) but "tsType" prop is set to "${ obj.tsType }" instead of "VueStyleObjectProp":`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
      else if (obj.tsType !== 'VueStyleProp' && isClassStyleType(obj.type) === true) {
        logError(`${ banner } object is style-type (String/Array/Object form) but "tsType" prop is set to "${ obj.tsType }" instead of "VueStyleProp":`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    }

    if (verifySerializable && obj.configFileType === undefined && isSerializable(obj) === false) {
      logError(`${ banner } object's type is non-serializable but props in "quasarConfOptions" can only consist of ${ serializableTypes.join('/') } to be used in quasar.config file. Use "configFileType" prop to specify a serializable type for quasar.config file, or set to null if there is no suitable type:`)
      console.error(obj)
      console.log()
      process.exit(1)
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

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// https://regex101.com/r/vkijKf/1/
const SEMANTIC_REGEX = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function handleAddedIn (addedIn, banner) {
  if (addedIn === void 0 || addedIn.length === 0) {
    logError(`${ banner } "addedIn" is empty`)
    console.log()
    process.exit(1)
  }

  if (addedIn.charAt(0) !== 'v') {
    logError(`${ banner } "addedIn" value (${ addedIn }) must start with "v"`)
    process.exit(1)
  }

  if (SEMANTIC_REGEX.test(addedIn) !== true) {
    logError(`${ banner } "addedIn" value (${ addedIn }) must follow semantic versioning`)
    process.exit(1)
  }
}

function parseAPI (file, apiType) {
  let api = require(file)

  if (api.mixins !== void 0) {
    api = getMixedInAPI(api, file)
  }

  const banner = `build.api.js: ${ path.relative(root, file) } -> `

  if (api.meta === void 0 || api.meta.docsUrl === void 0) {
    logError(`${ banner } API file does not contain meta > docsUrl`)
    process.exit(1)
  }

  // "props", "slots", ...
  for (const type in api) {
    if (!topSections[ apiType ].includes(type)) {
      logError(`${ banner } "${ type }" is not recognized for a ${ apiType }`)
      process.exit(1)
    }

    if (type === 'injection') {
      if (typeof api.injection !== 'string' || api.injection.length === 0) {
        logError(`${ banner } "${ type }"/"injection" invalid content`)
        process.exit(1)
      }
      continue
    }

    if (type === 'addedIn') {
      handleAddedIn(api.addedIn, banner)
      continue
    }

    if ([ 'value', 'arg', 'quasarConfOptions', 'meta' ].includes(type)) {
      if (Object(api[ type ]) !== api[ type ]) {
        logError(`${ banner } "${ type }"/"${ type }" is not an object`)
        process.exit(1)
      }
    }

    if ([ 'meta', 'quasarConfOptions' ].includes(type)) {
      parseObject({
        banner: `${ banner } "${ type }"`,
        api,
        itemName: type,
        masterType: type,
        verifySerializable: type === 'quasarConfOptions'
      })
      continue
    }

    if ([ 'value', 'arg' ].includes(type)) {
      parseObject({
        banner: `${ banner } "${ type }"`,
        api,
        itemName: type,
        masterType: 'props'
      })
      continue
    }

    const isComponent = banner.indexOf('component') > -1

    for (const itemName in api[ type ]) {
      parseObject({
        banner: `${ banner } "${ type }"/"${ itemName }"`,
        api: api[ type ],
        itemName,
        masterType: type === 'computedProps' ? 'props' : type,
        verifyCategory: type === 'props' && isComponent
      })
    }
  }

  return api
}

function orderAPI (api, apiType) {
  const ordered = {
    type: apiType
  }

  topSections[ apiType ].forEach(section => {
    if (api[ section ] !== void 0) {
      ordered[ section ] = api[ section ]
    }
  })

  return ordered
}

function arrayHasError (name, key, property, expected, propApi) {
  const apiVal = propApi[ property ]

  if (expected.length === 1 && expected[ 0 ] === apiVal) {
    return
  }

  const expectedVal = expected.filter(t => t.startsWith('__') === false)

  if (
    !Array.isArray(apiVal)
    || apiVal.length !== expectedVal.length
    || !expectedVal.every(t => apiVal.includes(t))
  ) {
    console.log(key, name, propApi[ key ], expectedVal)
    logError(`[1] ${ name }: wrong definition for prop "${ key }" on "${ property }": expected ${ expectedVal } but found ${ apiVal }`)
    return true
  }
}

function fillAPI (apiType, list, encodeFn) {
  return file => {
    const
      name = path.basename(file),
      filePath = path.join(dest, name)

    const api = orderAPI(parseAPI(file, apiType), apiType)

    if (apiType === 'component') {
      let hasError = false

      // QUploader has different definition
      if (name !== 'QUploader.json') {
        const filePath = file.replace('.json', fse.existsSync(file.replace('.json', '.js')) ? '.js' : '.ts')

        const definition = fse.readFileSync(filePath, 'utf-8')

        let slotMatch
        while ((slotMatch = slotRegex.exec(definition)) !== null) {
          const slotName = (slotMatch[ 2 ] || slotMatch[ 3 ] || slotMatch[ 4 ] || slotMatch[ 5 ] || slotMatch[ 6 ] || slotMatch[ 7 ]).replace(/(\${.+})/g, '[name]')

          if (!(api.slots || {})[ slotName ]) {
            logError(`${ name }: missing "slot" -> "${ slotName }" definition`)
            hasError = true // keep looping through to find as many as can be found before exiting
          }
          else if (api.slots[ slotName ].internal === true) {
            delete api.slots[ slotName ]
          }
        }

        ast.evaluate(definition, topSections[ apiType ], (prop, key, definition) => {
          if (prop === 'props') {
            if (!key && ('' + definition.type) === 'Function,Array') {
              // TODO
              // wrong evaluation; example: QTabs: props > 'onUpdate:modelValue'
              return
            }

            key = key.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/\s+/g, '-')
              .toLowerCase()

            if (/^on-/.test(key) === true) return
          }

          if (api[ prop ] === void 0 || api[ prop ][ key ] === void 0) {
            logError(`${ name }: missing "${ prop }" -> "${ key }" definition`)
            hasError = true // keep looping through to find as many as can be found before exiting
          }

          if (definition) {
            const propApi = api[ prop ][ key ]
            if (typeof definition === 'string' && propApi.type !== definition) {
              logError(`[2] ${ name }: wrong definition for prop "${ key }": expected "${ definition }" but found "${ propApi.type }"`)
              hasError = true // keep looping through to find as many as can be found before exiting
            }
            else if (Array.isArray(definition)) {
              if (arrayHasError(name, key, 'type', definition, propApi)) {
                hasError = true // keep looping through to find as many as can be found before exiting
              }
            }
            else {
              if (definition.type) {
                let propApiType

                // null is implicit for Vue, so we normalize the type
                // so the other validations won't break
                if (
                  key === 'model-value'
                  && Array.isArray(propApi.type)
                  && (propApi.type.includes('null') || propApi.type.includes('undefined'))
                ) {
                  propApiType = propApi.type.filter(v => v !== 'null' && v !== 'undefined')
                  if (propApiType.length === 1) {
                    propApiType = propApiType[ 0 ]
                  }
                }
                else {
                  propApiType = propApi.type
                }

                if (Array.isArray(definition.type)) {
                  const pApi = key === 'model-value'
                    ? { ...propApi, type: propApiType }
                    : propApi

                  if (arrayHasError(name, key, 'type', definition.type, pApi)) {
                    hasError = true
                  }
                }
                else if (propApiType !== definition.type) {
                  logError(`[3] ${ name }: wrong definition for prop "${ key }" on "type": expected "${ definition.type }" but found "${ propApi.type }"`)
                  hasError = true // keep looping through to find as many as can be found before exiting
                }
              }

              if (key !== 'model-value' && definition.required && Boolean(definition.required) !== propApi.required) {
                logError(`[4] ${ name }: wrong definition for prop "${ key }" on "required": expected "${ definition.required }" but found "${ propApi.required }"`)
                hasError = true // keep looping through to find as many as can be found before exiting
              }

              if (definition.validator && Array.isArray(definition.validator)) {
                const validator = definition.validator.map(entry => (
                  typeof entry === 'string'
                    ? `'${ entry }'`
                    : entry
                ))

                if (arrayHasError(name, key, 'values', validator, propApi)) {
                  hasError = true // keep looping through to find as many as can be found before exiting
                }
              }
            }
          }
        })
      }

      Object.keys(api).forEach(section => {
        const target = api[ section ]

        if (Object(target) === target) {
          for (const key in target) {
            if (target[ key ]?.internal === true) {
              delete target[ key ]
            }
          }
        }
      })

      if (hasError === true) {
        logError('Errors were found...exiting')
        process.exit(1)
      }
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
    path.join(root, 'dist/transforms/loader-asset-urls.json'),
    encodeFn(transformAssetUrls)
  )
}

function writeApiIndex (list, encodeFn) {
  writeFile(
    path.join(root, 'dist/transforms/api-list.json'),
    encodeFn(list)
  )
}

module.exports.generate = function ({ compact = false } = {}) {
  const encodeFn = compact === true
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  return new Promise((resolve) => {
    const list = []

    const plugins = glob.sync([
      'src/plugins/*/*.json',
      'src/Brand.json'
    ], { cwd: root, absolute: true })
      .map(fillAPI('plugin', list, encodeFn))

    const directives = glob
      .sync('src/directives/*/*.json', { cwd: root, absolute: true })
      .map(fillAPI('directive', list, encodeFn))

    const components = glob
      .sync('src/components/*/Q*.json', { cwd: root, absolute: true })
      .map(fillAPI('component', list, encodeFn))

    writeTransformAssetUrls(components, encodeFn)
    writeApiIndex(list, encodeFn)

    resolve({ components, directives, plugins })
  }).catch(err => {
    logError('build.api.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  })
}
