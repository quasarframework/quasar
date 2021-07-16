const glob = require('glob')
const path = require('path')
const { merge } = require('webpack-merge')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const resolvePath = file => path.resolve(root, file)
const dest = path.join(root, 'dist/api')
const extendApi = require(resolvePath('src/api.extends.json'))
const { logError, writeFile, kebabCase } = require('./build.utils')
const ast = require('./ast')

const slotRegex = /\(slots\[['`](\S+)['`]\]|\(slots\.([A-Za-z]+)|hSlot\(this, '(\S+)'|hUniqueSlot\(this, '(\S+)'|hMergeSlot\(this, '(\S+)'|hMergeSlotSafely\(this, '(\S+)'/g

function getMixedInAPI (api, mainFile) {
  api.mixins.forEach(mixin => {
    const mixinFile = resolvePath('src/' + mixin + '.json')

    if (!fs.existsSync(mixinFile)) {
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
  plugin: [ 'meta', 'injection', 'quasarConfOptions', 'addedIn', 'props', 'methods' ],
  component: [ 'meta', 'quasarConfOptions', 'addedIn', 'props', 'slots', 'events', 'methods' ],
  directive: [ 'meta', 'quasarConfOptions', 'addedIn', 'value', 'arg', 'modifiers' ]
}

const objectTypes = {
  Boolean: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'examples', 'category', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isArray: ['examples']
  },

  String: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'transformAssetUrls', 'internal' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'transformAssetUrls', 'internal' ],
    isArray: [ 'examples', 'values' ]
  },

  Number: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isArray: [ 'examples', 'values' ]
  },

  Object: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'examples' ],
    recursive: ['definition'],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isObject: ['definition'],
    isArray: [ 'examples', 'values' ]
  },

  Array: {
    props: [ 'tsInjectionPoint', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isObject: ['definition'],
    isArray: [ 'examples', 'values' ]
  },

  Promise: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isObject: ['definition'],
    isArray: ['examples']
  },

  Function: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'params', 'returns', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'params', 'returns' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isObject: [ 'params', 'returns' ],
    canBeNull: [ 'params', 'returns' ],
    isArray: ['examples']
  },

  MultipleTypes: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'params', 'returns', 'examples', 'category', 'addedIn', 'internal' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'tsInjectionPoint', 'required', 'reactive', 'sync', 'internal' ],
    isObject: [ 'definition', 'params', 'returns' ],
    isArray: [ 'examples', 'values' ]
  },

  // special type, not common
  Error: {
    props: [ 'desc', 'category', 'examples', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: ['internal']
  },

  // special type, not common
  Component: {
    props: [ 'desc', 'category', 'examples', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: ['internal']
  },

  meta: {
    props: ['docsUrl'],
    required: []
  },

  // special type, not common
  Element: {
    props: [ 'desc', 'category', 'examples', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: ['internal']
  },

  // special type, not common
  File: {
    props: [ 'desc', 'required', 'category', 'examples', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: ['internal']
  },

  // special type, not common
  FileList: {
    props: [ 'desc', 'required', 'category', 'examples', 'addedIn', 'internal' ],
    required: ['desc'],
    isBoolean: ['internal']
  },

  // component only
  slots: {
    props: [ 'desc', 'link', 'scope', 'addedIn', 'internal' ],
    required: ['desc'],
    isObject: ['scope'],
    isBoolean: ['internal']
  },

  // component only
  events: {
    props: [ 'desc', 'link', 'params', 'addedIn', 'internal' ],
    required: ['desc'],
    isObject: ['params'],
    isBoolean: ['internal']
  },

  methods: {
    props: [ 'tsInjectionPoint', 'tsType', 'desc', 'link', 'params', 'returns', 'addedIn' ],
    required: ['desc'],
    isBoolean: ['tsInjectionPoint'],
    isObject: [ 'params', 'returns' ]
  },

  quasarConfOptions: {
    props: [ 'propName', 'definition', 'link', 'addedIn' ],
    required: [ 'propName', 'definition' ]
  }
}

function parseObject ({ banner, api, itemName, masterType, verifyCategory }) {
  let obj = api[ itemName ]

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
    for (const prop in obj) {
      if ([ 'type', '__exemption' ].includes(prop)) {
        continue
      }

      if (verifyCategory && obj.category === void 0) {
        logError(`${ banner } missing required API prop "category" for its type (${ type })`)
        console.error(obj)
        console.log()
        process.exit(1)
      }

      if (!def.props.includes(prop)) {
        logError(`${ banner } object has unrecognized API prop "${ prop }" for its type (${ type })`)
        console.error(obj)
        console.log()
        process.exit(1)
      }

      def.required.forEach(prop => {
        if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
          return
        }
        if (
          !prop.examples
          && (obj.definition !== void 0 || obj.values !== void 0)
        ) {
          return
        }

        if (obj[ prop ] === void 0) {
          logError(`${ banner } missing required API prop "${ prop }" for its type (${ type })`)
          console.error(obj)
          console.log()
          process.exit(1)
        }
      })

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
    }
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
    if (!obj[ prop ]) { return }

    for (const item in obj[ prop ]) {
      parseObject({
        banner: `${ banner }/"${ prop }"/"${ item }"`,
        api: api[ itemName ][ prop ],
        itemName: item,
        masterType: 'props'
      })
    }
  })
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// https://regex101.com/r/vkijKf/1/
const SEMANTIC_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function isValidVersion (version) {
  return !!SEMANTIC_REGEX.exec(version)
}

function handleAddedIn (api, banner) {
  if (api.addedIn === void 0 || api.addedIn.length === 0) {
    logError(`${ banner } "addedIn" is empty`)
    console.log()
    process.exit(1)
  }

  const addedIn = api.addedIn

  if (addedIn.charAt(0) !== 'v') {
    logError(`${ banner } "addedIn" value (${ addedIn }) must start with "v"`)
    console.log()
    process.exit(1)
  }

  if (isValidVersion(addedIn.slice(1)) !== true) {
    logError(`${ banner } "addedIn" value (${ addedIn }) must follow sematic versioning`)
    console.log()
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
      handleAddedIn(api, banner)
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
        masterType: type
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
        masterType: type,
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
    logError(`${ name }: wrong definition for prop "${ key }" on "${ property }": expected ${ expectedVal } but found ${ apiVal }`)
    return true
  }
}

function fillAPI (apiType, list) {
  return file => {
    const
      name = path.basename(file),
      filePath = path.join(dest, name)

    const api = orderAPI(parseAPI(file, apiType), apiType)

    if (apiType === 'component') {
      let hasError = false

      // QUploader has different definition
      if (name !== 'QUploader.json') {
        const filePath = file.replace('.json', fs.existsSync(file.replace('.json', '.js')) ? '.js' : '.ts')

        const definition = fs.readFileSync(filePath, 'utf-8')

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
            if (!key && definition.type === 'Function') {
              // TODO
              // wrong evaluation; example: QTabs: props > 'onUpdate:modelValue'
              return
            }

            key = key.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/\s+/g, '-')
              .toLowerCase()

            if (/^on-/.test(key) === true) { return }
          }

          if (api[ prop ] === void 0 || api[ prop ][ key ] === void 0) {
            logError(`${ name }: missing "${ prop }" -> "${ key }" definition`)
            hasError = true // keep looping through to find as many as can be found before exiting
          }

          if (definition) {
            const propApi = api[ prop ][ key ]
            if (typeof definition === 'string' && propApi.type !== definition) {
              logError(`${ name }: wrong definition for prop "${ key }": expected "${ definition }" but found "${ propApi.type }"`)
              hasError = true // keep looping through to find as many as can be found before exiting
            }
            else if (Array.isArray(definition)) {
              if (arrayHasError(name, key, 'type', definition, propApi)) {
                hasError = true // keep looping through to find as many as can be found before exiting
              }
            }
            else {
              if (definition.type) {
                if (Array.isArray(definition.type)) {
                  if (arrayHasError(name, key, 'type', definition.type, propApi)) {
                    hasError = true
                  }
                }
                else if (propApi.type !== definition.type) {
                  logError(`${ name }: wrong definition for prop "${ key }" on "type": expected "${ definition.type }" but found "${ propApi.type }"`)
                  hasError = true // keep looping through to find as many as can be found before exiting
                }
              }

              if (key !== 'value' && definition.required && Boolean(definition.required) !== propApi.required) {
                logError(`${ name }: wrong definition for prop "${ key }" on "required": expected "${ definition.required }" but found "${ propApi.required }"`)
                hasError = true // keep looping through to find as many as can be found before exiting
              }

              if (definition.validator && Array.isArray(definition.validator)) {
                if (arrayHasError(name, key, 'values', definition.validator, propApi)) {
                  hasError = true // keep looping through to find as many as can be found before exiting
                }
              }
            }
          }
        })
      }

      if (api.props !== void 0) {
        for (const key in api.props) {
          if (api.props[ key ].internal === true) {
            delete api.props[ key ]
          }
        }
      }

      if (hasError === true) {
        logError('Errors were found...exiting')
        process.exit(1)
      }
    }

    // copy API file to dest
    writeFile(filePath, JSON.stringify(api, null, 2))

    const shortName = name.substring(0, name.length - 5)
    list.push(shortName)

    return {
      name: shortName,
      api
    }
  }
}

function writeTransformAssetUrls (components) {
  const transformAssetUrls = {
    base: null,
    includeAbsolute: false,
    tags: {
      video: [ 'src', 'poster' ],
      source: ['src'],
      img: ['src'],
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
    JSON.stringify(transformAssetUrls, null, 2)
  )
}

function writeApiIndex (list) {
  writeFile(
    path.join(root, 'dist/transforms/api-list.json'),
    JSON.stringify(list, null, 2)
  )
}

module.exports.generate = function () {
  return new Promise((resolve) => {
    const list = []

    const plugins = glob.sync(resolvePath('src/plugins/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('plugin', list))

    const directives = glob.sync(resolvePath('src/directives/*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('directive', list))

    const components = glob.sync(resolvePath('src/components/**/Q*.json'))
      .filter(file => !path.basename(file).startsWith('__'))
      .map(fillAPI('component', list))

    writeTransformAssetUrls(components)
    writeApiIndex(list)

    resolve({ components, directives, plugins })
  }).catch(err => {
    logError('build.api.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  })
}
