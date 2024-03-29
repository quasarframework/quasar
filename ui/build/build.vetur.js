const path = require('node:path')

const { logError, writeFile, kebabCase } = require('./build.utils')
const resolve = file => path.resolve(__dirname, '../dist/vetur', file)

function getTags (data) {
  const tags = {}

  data.forEach(comp => {
    tags[ comp.name ] = {
      attributes: Object.keys(comp.props),
      description: ''
    }
  })

  return tags
}

function getAttributes (data) {
  const attrs = {}

  data.forEach(comp => {
    Object.keys(comp.props).forEach(propName => {
      const prop = comp.props[ propName ]

      attrs[ `${ comp.name }/${ propName }` ] = {
        type: Array.isArray(prop.type)
          ? prop.type.map(t => t.toLowerCase()).join('|')
          : prop.type.toLowerCase(),
        description: prop.desc
      }
    })
  })

  return attrs
}

module.exports.generate = function ({ api, compact = false }) {
  const encodeFn = compact === true
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  const data = api.components.map(c => ({
    name: kebabCase(c.name),
    props: c.api.props || {}
  }))

  try {
    writeFile(
      resolve('quasar-tags.json'),
      encodeFn(getTags(data))
    )

    writeFile(
      resolve('quasar-attributes.json'),
      encodeFn(getAttributes(data))
    )
  }
  catch (err) {
    logError('build.vetur.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
