const getDevlandFile = require('../helpers/get-devland-file')
const importTransform = getDevlandFile('quasar/dist/babel-transforms/imports.js')

const regex = /import\s*\{([\w,\s]+)\}\s*from\s*['"]{1}quasar['"]{1}/g

module.exports = function (content, map) {
  const newContent = content.replace(
    regex,
    (_, match) => match.split(',')
      .map(identifier => {
        const data = identifier.split(' as ')

        if (data[1] !== void 0) {
          return `import ${data[1].trim()} from '${importTransform(data[0].trim())}';`
        }

        const name = data[0].trim()
        return `import ${name} from '${importTransform(name)}';`
      })
      .join('')
  )

  return this.callback(null, newContent, map)
}
