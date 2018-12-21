// Used with babel-plugin-transform-imports

const
  glob = require('glob'),
  path = require('path'),
  fs = require('fs'),
  { writeFile } = require('./build.utils')

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

module.exports.generate = function () {
  const
    root = path.resolve(__dirname, '..'),
    resolve = file => path.resolve(root, file),
    dest = path.join(root, 'dist/api')

  const API = {}

  glob.sync(resolve('src/components/**/Q*.json'))
    .forEach(file => {
      const
        name = path.basename(file),
        filePath = path.join(dest, name)

      // copy API file to dest
      fs.copyFileSync(file, filePath)

      // add into API index
      API[getWithoutExtension(name)] = require(file)
    })

  writeFile(
    path.join(dest, 'index.json'),
    JSON.stringify(API, null, 2)
  )
}
