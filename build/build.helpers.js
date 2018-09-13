const
  kebabCase = require('lodash.kebabcase'),
  cloneDeep = require('lodash.clonedeep'),
  beautify = require('json-beautify'),
  path = require('path')

const
  cache = {},
  { writeFile } = require('./build.utils'),
  Quasar = require('../dist/quasar.umd.min'),
  components = Quasar.components,
  resolve = file => path.resolve(__dirname, '../dist/helper-json', file)

const PropTypeMap = new Map([
  [String, { type: 'string', description: 'String value.' }],
  [Boolean, { type: 'boolean', description: 'Boolean value.' }],
  [Number, { type: 'number', description: 'Number value.' }],
  [Array, { type: 'array', description: 'Array value.' }],
  [Object, { type: 'object', description: 'Object value.' }],
  [Function, { type: 'function', description: 'Function value.' }],
  [RegExp, { type: 'RegExp', description: 'RegExp value.' }],
  [Date, { type: 'Date', description: 'Date value.' }]
])

const kebabExceptions = ['format24h']
function kebab (name) {
  return kebabExceptions.includes(name)
    ? name
    : kebabCase(name)
}

function addProps (comp, list) {
  if (comp.props) {
    Object.keys(comp.props)
      .filter(name => name !== 'value')
      .forEach(name => {
        list[kebab(name)] = comp.props[name]
      })
  }
}

const propExceptions = {
  'q-chips-input': ['max-height'],
  'q-collapsible': ['link'],
  'q-search': ['max-value']
}
const internalComponents = [
  'q-item-wrapper',
  'q-input-frame'
]
function applyExceptions (cache) {
  internalComponents.forEach(name => {
    delete cache[name]
  })
  Object.keys(propExceptions).forEach(name => {
    propExceptions[name].forEach(prop => {
      delete cache[name][prop]
    })
  })
}

function parseComponent (comp, list) {
  const
    name = kebabCase(comp.name),
    cached = name !== void 0 ? cache[comp.name] : false

  if (cached) {
    Object.assign(list, cached)
    return
  }

  if (comp.mixins) {
    comp.mixins.forEach(mixin => {
      parseComponent(mixin, list)
    })
  }

  addProps(comp, list)

  if (name) {
    cache[name] = cloneDeep(list)
  }
}

function getTags (cache) {
  const tags = {}
  Object.keys(cache).forEach(name => {
    tags[name] = {
      attributes: Object.keys(cache[name]),
      description: ''
    }
  })
  return tags
}

function getAttributes (cache) {
  const attrs = {}
  Object.keys(cache).forEach(name => {
    const props = cache[name]
    Object.keys(props).forEach(prop => {
      let entry
      let type = props[prop].type || 'any'
      if (Array.isArray(type)) {
        types = type.map(val => {
          const v = PropTypeMap.get(val)
          if (!PropTypeMap.has(val)) {
            console.error('PropTypeMap.get', v)
          }
          else {
            return PropTypeMap.get(val).type
          }
        })
        type = types.join('|')
        let description = 'One of '
        if (types.length == 2) {
          description += `${types[0]} or ${types[1]}.`
        }
        else {
          for (let i = 0; i < types.length; i++) {
            if (i < types.length - 1) {
              description += `${types[i]}, `
            } else {
              description += `or ${types[i]}.`
            }
          }
        }
        entry = {
          type,
          description
        }
      }
      else {
        entry = PropTypeMap.get(type)
      }

      attrs[`${name}/${prop}`] = entry
    })
  })
  return attrs
}

Object.keys(components).forEach(name => {
  const list = {}
  parseComponent(components[name], list)
})

applyExceptions(cache)

module.exports.generate = function () {
  writeFile(resolve('quasar-tags.json'), beautify(
    getTags(cache),
    null, 2, 1
  ))

  writeFile(resolve('quasar-attributes.json'), beautify(
    getAttributes(cache),
    null, 2, 1
  ))
}
