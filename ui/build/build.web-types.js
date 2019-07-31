const
  path = require('path'),
  fs = require('fs'),
  { logError, writeFile, kebabCase } = require('./build.utils')

function resolveType (type) {
  if (Array.isArray(type)) {
    return type.map(resolveType)
  }
  if (['Any', 'String', 'Boolean', 'Number'].includes(type)) {
    return type.toLowerCase()
  }
  if (type === 'Array') {
    return 'any[]'
  }
  return type
}

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
              // TODO source file can be wrong - this is just a guess for now
              'source-file': `./quasar/src/components/${kebabCase(name.substr(1))}/${name}.js`,
              attributes: props && Object.entries(props).map(([name, propApi]) => {
                let result = {
                  name,
                  type: resolveType(propApi.type),
                  description: propApi.desc,
                  'doc-url': 'https://quasar.dev'
                }
                if (propApi.required) {
                  result.required = true
                }
                if (propApi.default) {
                  result.default = JSON.stringify(propApi.default)
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
            return Object.fromEntries(Object.entries(result).filter(([_, v]) => v))
          }),
          attributes: data.directives.map(directiveApi => {
            return {
              name: 'v-' + kebabCase(directiveApi.name),
              'source-file': `./node_modules/quasar/src/directives/${directiveApi.name}.js`,
              type: resolveType(directiveApi.api.value.type),
              description: `${directiveApi.name} - Quasar directive`,
              'doc-url': 'https://quasar.dev'
            }
          })
        }
      }
    }, null, 2)
    let webTypesPath = path.resolve(__dirname, '../dist/web-types')

    if (!fs.existsSync(webTypesPath)) {
      fs.mkdirSync(webTypesPath)
    }
    writeFile(path.resolve(webTypesPath, 'web-types.json'), webtypes)
  }
  catch (err) {
    logError(`build.web-types.js: something went wrong...`)
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
