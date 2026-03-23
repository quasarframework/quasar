import {
  version,
  resolveToRoot,
  logError,
  writeFile,
  kebabCase
} from './build.utils.js'

const resolve = file => resolveToRoot('dist/web-types', file)

function resolveType({ type, values }) {
  // TODO transform Object with "values" and arrays Objects with values
  if (Array.isArray(type)) {
    return type.map(item => resolveType({ type: item })).join('|')
  }
  if (type === 'String' && values) {
    return values.map(v => (v === null ? 'null' : `'${v}'`)).join('|')
  }
  if (['Any', 'String', 'Boolean', 'Number', 'Object'].includes(type)) {
    return type.toLowerCase()
  }
  if (type === 'Array') {
    return 'any[]'
  }
  return type
}

function getDescription(propApi) {
  return propApi.examples
    ? propApi.desc + '\n\nExamples:\n' + propApi.examples.join('\n')
    : propApi.desc
}

export function generate({ api, compact = false }) {
  const encodeFn =
    compact === true ? JSON.stringify : json => JSON.stringify(json, null, 2)

  try {
    const webtypes = encodeFn({
      $schema: '',
      framework: 'vue',
      name: 'quasar',
      version,
      contributions: {
        html: {
          'types-syntax': 'typescript',

          tags: api.components.map(
            ({ api: { events, props, scopedSlots, slots, meta }, name }) => {
              const slotTypes = []
              if (slots) {
                Object.entries(slots).forEach(([slotName, slotApi]) => {
                  slotTypes.push({
                    name: slotName,
                    description: getDescription(slotApi),
                    'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                  })
                })
              }

              if (scopedSlots) {
                Object.entries(scopedSlots).forEach(([slotName, slotApi]) => {
                  slotTypes.push({
                    name: slotName,
                    'vue-properties':
                      slotApi.scope &&
                      Object.entries(slotApi.scope).map(
                        ([propName, propApi]) => ({
                          name: propName,
                          type: resolveType(propApi),
                          description: getDescription(propApi),
                          'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                        })
                      ),
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
                attributes:
                  props &&
                  Object.entries(props).map(([propName, propApi]) => {
                    const localResult = {
                      name: propName,
                      value: {
                        kind: 'expression',
                        type: resolveType(propApi)
                      },
                      description: getDescription(propApi),
                      'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                    }
                    if (propApi.required) {
                      localResult.required = true
                    }
                    if (propApi.default) {
                      localResult.default = JSON.stringify(propApi.default)
                    }
                    if (propApi.type === 'Boolean') {
                      // Deprecated but used for compatibility with WebStorm 2019.2.
                      localResult.type = 'boolean'
                    }
                    return localResult
                  }),
                events:
                  events &&
                  Object.entries(events).map(([eventName, eventApi]) => ({
                    name: eventName,
                    arguments:
                      eventApi.params &&
                      Object.entries(eventApi.params).map(
                        ([paramName, paramApi]) => ({
                          name: paramName,
                          type: resolveType(paramApi),
                          description: getDescription(paramApi),
                          'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                        })
                      ),
                    description: getDescription(eventApi),
                    'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                  })),
                slots: slotTypes,
                description: `${name} - Quasar component`,
                'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
              }
              if (
                props &&
                props.value &&
                ((events && events.input) || props.value.category === 'model')
              ) {
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
            }
          ),

          attributes: api.directives.map(
            ({ name, api: { modifiers, value, meta } }) => {
              const valueType = value.type
              const result = {
                name: 'v-' + kebabCase(name),
                source: {
                  module: 'quasar',
                  symbol: name
                },
                required: false, // Directive is never required
                description: `${name} - Quasar directive`,
                'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
              }
              if (modifiers) {
                result['vue-modifiers'] = Object.entries(modifiers).map(
                  ([modifierName, modifierApi]) => ({
                    name: modifierName,
                    description: getDescription(modifierApi),
                    'doc-url': meta.docsUrl || 'https://v1.quasar.dev'
                  })
                )
              }
              if (valueType !== 'Boolean') {
                result.value = {
                  kind: 'expression',
                  type: resolveType(value)
                }
              }
              return result
            }
          )
        }
      }
    })

    writeFile(resolve('web-types.json'), webtypes)
  } catch (err) {
    logError('build.web-types.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
