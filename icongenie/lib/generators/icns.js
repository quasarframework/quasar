const { writeFile } = require('fs')
const png2icons = require('png2icons')

module.exports = async function (file, opts, done) {
  const output = await png2icons.createICNS(opts.iconBuffer, opts.compression.ico, 0)
  writeFile(file.absoluteName, output, done)
}
