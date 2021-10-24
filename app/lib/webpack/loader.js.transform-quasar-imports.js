const getDevlandFile = require('../helpers/get-devland-file')
const importTransformation = getDevlandFile('quasar/dist/transforms/import-transformation.js')

const regex = /import\s*\{([\w,\s]+)\}\s*from\s*['"]{1}quasar['"]{1}/g

module.exports = function (content, map) {
  const newContent = content.replace(
    regex,
    (_, match) => match.split(',')
      .map(identifier => {
        const id = identifier.trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (id === '') {
          return ''
        }

        const data = id.split(' as ')
        const name = data[0].trim()

        return `import ${data[1] !== void 0 ? data[1].trim() : name} from '${importTransformation(name)}';`
      })
      .join('')
  )

  return this.callback(null, newContent, map)
}
