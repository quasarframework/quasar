// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path'),
  merge = require('webpack-merge'),
  fs = require('fs'),
  { logError, writeFile } = require('./build.utils')

const
  root = path.resolve(__dirname, '..'),
  resolve = file => path.resolve(root, file),
  dest = path.join(root, 'dist/api'),
  extendApi = require(resolve('src/api.extends.json'))

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function getMixedInAPI (api, mainFile) {
  api.mixins.forEach(mixin => {
    const mixinFile = resolve('src/' + mixin + '.json')

    if (!fs.existsSync(mixinFile)) {
      logError(`build.api.js: ${path.relative(root, mainFile)} -> no such mixin ${mixin}`)
      process.exit(1)
    }

    const content = require(mixinFile)

    api = merge(
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
  plugin: [ 'injection', 'quasarConfOptions', 'props', 'methods' ],
  component: [ 'props', 'slots', 'scopedSlots', 'events', 'methods' ],
  directive: [ 'value', 'arg', 'modifiers' ]
}

const objectTypes = {
  Boolean: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'examples' ],
    required: [ 'desc' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isArray: [ 'examples' ]
  },

  String: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isArray: [ 'examples', 'values' ]
  },

  Number: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'examples' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isArray: [ 'examples', 'values' ]
  },

  Object: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples' ],
    required: [ 'desc', 'examples' ],
    recursive: [ 'definition' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Array: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'examples' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isObject: [ 'definition' ],
    isArray: [ 'examples', 'values' ]
  },

  Function: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'default', 'params', 'returns', 'examples' ],
    required: [ 'desc' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isObject: [ 'params', 'returns' ],
    isArray: [ 'examples' ]
  },

  MultipleTypes: {
    props: [ 'desc', 'required', 'reactive', 'sync', 'link', 'values', 'default', 'definition', 'params', 'returns', 'examples' ],
    required: [ 'desc', 'examples' ],
    isBoolean: [ 'required', 'reactive', 'sync' ],
    isObject: [ 'definition', 'params', 'returns' ],
    isArray: [ 'examples', 'values' ]
  },

  // special type, not common
  Error: {
    props: [ 'desc' ],
    required: [ 'desc' ]
  },

  // special type, not common
  Component: {
    props: [ 'desc' ],
    required: [ 'desc' ]
  },

  // component only
  slots: {
    props: [ 'desc', 'link' ],
    required: [ 'desc' ]
  },

  // component only
  scopedSlots: {
    props: [ 'desc', 'link', 'definition' ],
    required: [ 'desc' ], // TODO 'definition'
    isObject: [ 'definition' ]
  },

  // component only
  events: {
    props: [ 'desc', 'link', 'params' ],
    required: [ 'desc' ],
    isObject: [ 'params' ]
  },

  methods: {
    props: [ 'desc', 'link', 'params', 'returns' ],
    required: [ 'desc' ],
    isObject: [ 'params', 'returns' ]
  },

  // plugin only
  quasarConfOptions: {
    props: [ 'propName', 'props', 'link' ],
    required: [ 'propName', 'props' ]
  }
}

function parseObject ({ banner, api, itemName, masterType }) {
  let obj = api[itemName]

  if (obj.extends !== void 0 && extendApi[masterType] !== void 0) {
    if (extendApi[masterType][obj.extends] === void 0) {
      logError(`${banner} extends "${obj.extends}" which does not exists`)
      process.exit(1)
    }

    api[itemName] = merge(
      extendApi[masterType][obj.extends],
      api[itemName]
    )
    delete api[itemName].extends

    obj = api[itemName]
  }

  let type

  if (['props', 'modifiers'].includes(masterType)) {
    if (obj.type === void 0) {
      logError(`${banner} missing "type" prop`)
      process.exit(1)
    }

    type = Array.isArray(obj.type) || obj.type === 'Any'
      ? 'MultipleTypes'
      : obj.type
  }
  else {
    type = masterType
  }

  if (objectTypes[type] === void 0) {
    logError(`${banner} object has unrecognized API type prop value: "${type}"`)
    console.error(obj)
    process.exit(1)
  }

  const def = objectTypes[type]

  for (let prop in obj) {
    if ([ 'type', '__exemption' ].includes(prop)) {
      continue
    }

    if (!def.props.includes(prop)) {
      console.log(def)
      logError(`${banner} object has unrecognized API prop "${prop}" for its type (${type})`)
      console.error(obj)
      console.log()
      process.exit(1)
    }

    def.required.forEach(prop => {
      if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
        return
      }
      if (
        !prop.examples &&
        (obj.definition !== void 0 || obj.values !== void 0)
      ) {
        return
      }

      if (obj[prop] === void 0) {
        logError(`${banner} missing required API prop "${prop}" for its type (${type})`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })

    if (obj.__exemption !== void 0) {
      const { __exemption, ...p } = obj
      api[itemName] = p
    }

    def.isBoolean && def.isBoolean.forEach(prop => {
      if (obj[prop] && obj[prop] !== true && obj[prop] !== false) {
        logError(`${banner}/"${prop}" is not a Boolean`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
    def.isObject && def.isObject.forEach(prop => {
      if (obj[prop] && Object(obj[prop]) !== obj[prop]) {
        logError(`${banner}/"${prop}" is not an Object`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
    def.isArray && def.isArray.forEach(prop => {
      if (obj[prop] && !Array.isArray(obj[prop])) {
        logError(`${banner}/"${prop}" is not an Array`)
        console.error(obj)
        console.log()
        process.exit(1)
      }
    })
  }

  if (obj.returns !== void 0) {
    parseObject({
      banner: `${banner}/"returns"`,
      api: api[itemName],
      itemName: 'returns',
      masterType: 'props'
    })
  }

  ;[ 'params', 'definition' ].forEach(prop => {
    if (obj[prop] === void 0) { return }

    for (let item in obj[prop]) {
      parseObject({
        banner: `${banner}/"${prop}"/"${item}"`,
        api: api[itemName][prop],
        itemName: item,
        masterType: 'props'
      })
    }
  })
}

function parseAPI (file, apiType) {
  let api = require(file)

  if (api.mixins !== void 0) {
    api = getMixedInAPI(api, file)
  }

  const banner = `build.api.js: ${path.relative(root, file)} -> `

  // "props", "slots", ...
  for (let type in api) {
    if (!topSections[apiType].includes(type)) {
      logError(`${banner} "${type}" is not recognized for a ${apiType}`)
      process.exit(1)
    }

    if (type === 'injection') {
      if (typeof api.injection !== 'string' || api.injection.length === 0) {
        logError(`${banner} "${type}"/"injection" invalid content`)
        process.exit(1)
      }
      continue
    }

    if (['value', 'arg', 'quasarConfOptions'].includes(type)) {
      if (Object(api[type]) !== api[type]) {
        logError(`${banner} "${type}"/"${type}" is not an object`)
        process.exit(1)
      }
    }

    if (type === 'quasarConfOptions') {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: 'quasarConfOptions',
        masterType: type
      })
      continue
    }

    if (['value', 'arg'].includes(type)) {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: type,
        masterType: 'props'
      })
      continue
    }

    for (let itemName in api[type]) {
      parseObject({
        banner: `${banner} "${type}"/"${itemName}"`,
        api: api[type],
        itemName,
        masterType: type
      })
    }
  }

  api.type = apiType

  return api
}

function fillAPI (API, apiType) {
  return file => {
    const
      name = path.basename(file),
      filePath = path.join(dest, name)

    const api = parseAPI(file, apiType)

    // copy API file to dest
    writeFile(filePath, JSON.stringify(api, null, 2))

    // add into API index
    API[getWithoutExtension(name)] = api
  }
}

module.exports.generate = function () {
  const API = {}

  try {
    glob.sync(resolve('src/components/**/Q*.json'))
      .forEach(fillAPI(API, 'component'))

    glob.sync(resolve('src/plugins/*.json'))
      .forEach(fillAPI(API, 'plugin'))

    glob.sync(resolve('src/directives/*.json'))
      .forEach(fillAPI(API, 'directive'))

    writeFile(
      path.join(dest, 'index.json'),
      JSON.stringify(API, null, 2)
    )
  }
  catch (err) {
    logError(`build.api.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
