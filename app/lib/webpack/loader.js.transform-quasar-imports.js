const getDevlandFile = require('../helpers/get-devland-file')
const importTransformation = getDevlandFile('quasar/dist/transforms/import-transformation.js')

const regex = /import\s*\{([\w,\s]+)\}\s*from\s*['"]{1}quasar['"]{1}/g

module.exports = function (content, map) {
  const newContent = content.replace(
    regex,
    (_, match) => match.split(',')
      .map(identifier => {
        const data = identifier.split(' as ')

        if (data[1] !== void 0) {
          return `import ${data[1].trim()} from '${importTransformation(data[0].trim())}';`
        }

        const name = data[0].trim()
        return `import ${name} from '${importTransformation(name)}';`
      })
      .join('')
  )

  return this.callback(null, newContent, map)
}
