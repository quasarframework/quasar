const path = require('node:path')
const { logError, writeFile, kebabCase } = require('./build.utils')

const { version } = require('../package.json')

const resolve = file => path.resolve(__dirname, '../dist/web-types', file)

function resolveType ({ type, values }) {
  // TODO transform Object with "values" and arrays Objects with values
  if (Array.isArray(type)) {
    return type.map(type => resolveType({ type })).join('|')
  }
  if (type === 'String' && values) {
    return values.map(v => (v === null ? 'null' : `'${ v }'`)).join('|')
  }
  if ([ 'Any', 'String', 'Boolean', 'Number', 'Object' ].includes(type)) {
    return type.toLowerCase()
  }
  if (type === 'Array') {
    return 'any[]'
  }
  return type
}

function getDescription (propApi) {
  return propApi.examples
    ? propApi.desc + '\n\nExamples:\n' + propApi.examples.join('\n')
    : propApi.desc
}

module.exports.generate = function ({ api, compact = false }) {
  const encodeFn = compact === true
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  try {
    const webtypes = encodeFn({
      $schema: '',
      framework: 'vue',
      name: 'quasar',
      version,
      contributions: {
        html: {
          'types-syntax': 'typescript',

          tags: api.components.map(({ api: { events, props, scopedSlots, slots, meta }, name }) => {
            const slotTypes = []
            if (slots) {
              Object.entries(slots).forEach(([ name, slotApi ]) => {
                slotTypes.push({
                  name,
                  description: getDescription(slotApi),
                  'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                })
              })
            }

            if (scopedSlots) {
              Object.entries(scopedSlots).forEach(([ name, slotApi ]) => {
                slotTypes.push({
                  name,
                  'vue-properties': slotApi.scope && Object.entries(slotApi.scope).map(([ name, api ]) => ({
                    name,
                    type: resolveType(api),
                    description: getDescription(api),
                    'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                  })),
                  description: getDescription(slotApi),
                  'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                })
              })
            }

            const result = {
              name,
              source: {
                module: 'quasar',
                symbol: name
              },
              attributes: props && Object.entries(props).map(([ name, propApi ]) => {
                const result = {
                  name,
                  value: {
                    kind: 'expression',
                    type: resolveType(propApi)
                  },
                  description: getDescription(propApi),
                  'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
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
              events: events && Object.entries(events).map(([ name, eventApi ]) => ({
                name,
                arguments: eventApi.params && Object.entries(eventApi.params).map(([ paramName, paramApi ]) => ({
                  name: paramName,
                  type: resolveType(paramApi),
                  description: getDescription(paramApi),
                  'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                })),
                description: getDescription(eventApi),
                'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
              })),
              slots: slotTypes,
              description: `${ name } - Quasar component`,
              'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
            }
            if (props && props.value && ((events && events.input) || props.value.category === 'model')) {
              result[ 'vue-model' ] = {
                prop: 'value',
                event: 'input'
              }
            }
            Object.entries(result).forEach(([ key, v ]) => {
              if (!v) {
                delete result[ key ]
              }
            })

            return result
          }),

          attributes: api.directives.map(({ name, api: { modifiers, value, meta } }) => {
            const valueType = value.type
            const result = {
              name: 'v-' + kebabCase(name),
              source: {
                module: 'quasar',
                symbol: name
              },
              required: false, // Directive is never required
              description: `${ name } - Quasar directive`,
              'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
            }
            if (modifiers) {
              result[ 'vue-modifiers' ] = Object.entries(modifiers).map(([ name, api ]) => ({
                name,
                description: getDescription(api),
                'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
              }))
            }
            if (valueType !== 'Boolean') {
              result.value = {
                kind: 'expression',
                type: resolveType(value)
              }
            }
            return result
          })
        }
      }
    })

    writeFile(resolve('web-types.json'), webtypes)
  }
  catch (err) {
    logError('build.web-types.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
