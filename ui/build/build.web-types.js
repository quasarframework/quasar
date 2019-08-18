const
  path = require('path'),
  fs = require('fs'),
  { logError, writeFile, kebabCase } = require('./build.utils')

function resolveType (type) {
  // TODO transform Object with "values" and arrays Objects with values
  if (Array.isArray(type)) {
    return type.map(resolveType).join('|')
  }
  if (['Any', 'String', 'Boolean', 'Number', 'Object'].includes(type)) {
    return type.toLowerCase()
  }
  if (type === 'Array') {
    return 'any[]'
  }
  return type
}

// TODO add examples to descriptions
module.exports.generate = function (data) {
  try {
    const webtypes = JSON.stringify({
      $schema: '',
      framework: 'vue',
      name: 'quasar',
      version: process.env.VERSION || require('../package.json').version,
      contributions: {
        html: {
          'types-syntax': 'typescript',
          tags: data.components.map(({ api: { events, props, scopedSlots, slots }, name }) => {
            let result = {
              name,
              source: {
                module: 'quasar',
                symbol: name
              },
              attributes: props && Object.entries(props).map(([name, propApi]) => {
                let result = {
                  name,
                  value: {
                    kind: 'expression',
                    type: resolveType(propApi.type)
                  },
                  description: propApi.desc,
                  'doc-url': 'https://quasar.dev'
                }
                if (propApi.required) {
                  result.required = true
                }
                if (propApi.default) {
                  result.default = JSON.stringify(propApi.default)
                }
                if (propApi.type === 'Boolean') {
                  // Deprecated but used for compatibility with WebStorm 2019.2.
                  result.type = 'boolean'
                }
                return result
              }),
              events: events && Object.entries(events).map(([name, eventApi]) => ({
                name,
                arguments: eventApi.params && Object.entries(eventApi.params).map(([paramName, paramApi]) => ({
                  name: paramName,
                  type: resolveType(paramApi.type),
                  description: paramApi.desc,
                  'doc-url': 'https://quasar.dev'
                })),
                description: eventApi.desc,
                'doc-url': 'https://quasar.dev'
              })),
              slots: slots && Object.entries(slots).map(([name, slotApi]) => ({
                name,
                description: slotApi.desc,
                'doc-url': 'https://quasar.dev'
              })),
              'vue-scoped-slots': scopedSlots && Object.entries(scopedSlots).map(([name, slotApi]) => ({
                name,
                properties: slotApi.scope && Object.entries(slotApi.scope).map(([name, api]) => ({
                  name,
                  type: resolveType(api.type),
                  description: api.desc,
                  'doc-url': 'https://quasar.dev'
                })),
                description: slotApi.desc,
                'doc-url': 'https://quasar.dev'
              })),
              description: `${name} - Quasar component`,
              'doc-url': 'https://quasar.dev'
            }
            if (props && props.value && ((events && events.input) || props.value.category === 'model')) {
              result['vue-model'] = {
                prop: 'value',
                event: 'input'
              }
            }
            Object.entries(result).forEach(([key, v]) => {
              if (!v) {
                delete result[key]
              }
            })

            return result
          }),
          attributes: data.directives.map(({ name, api: { modifiers, value } }) => {
            let valueType = value.type
            let result = {
              name: 'v-' + kebabCase(name),
              source: {
                module: 'quasar',
                symbol: name
              },
              required: false, // Directive is never required
              description: `${name} - Quasar directive`,
              'doc-url': 'https://quasar.dev'
            }
            if (modifiers) {
              result['vue-modifiers'] = Object.entries(modifiers).map(([name, api]) => ({
                name,
                description: api.desc,
                'doc-url': 'https://quasar.dev'
              }))
            }
            if (valueType !== 'Boolean') {
              result.value = {
                kind: 'expression',
                type: resolveType(value.type)
              }
            }
            return result
          })
        }
      }
    }, null, 2)
    let webTypesPath = path.resolve(__dirname, '../dist/web-types')

    if (!fs.existsSync(webTypesPath)) {
      fs.mkdirSync(webTypesPath)
    }
    writeFile(path.resolve(webTypesPath, 'web-types.json'), webtypes)
  } catch (err) {
    logError(`build.web-types.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
