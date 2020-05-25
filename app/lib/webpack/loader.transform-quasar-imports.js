const getDevlandFile = require('../helpers/get-devland-file')
const importTransform = getDevlandFile('quasar/dist/babel-transforms/imports.js')

const regex = /import\s*\{([\w,\s]+)\}\s*from\s*['"]{1}quasar['"]{1}/g

module.exports = content => content.replace(
  regex,
  (_, match) => match.split(',')
    .map(identifier => {
      const data = identifier.split(' as ')
      const name = data[0].trim()
      const as = data[1] === void 0
        ? ''
        : ` as ${data[1]}`

      return `import ${name}${as} from '${importTransform(name)}';`
    })
    .join('')
)
