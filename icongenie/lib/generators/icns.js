const { writeFile } = require('fs')
const png2icons = require('png2icons')

const getSquareIcon = require('../utils/get-square-icon')

module.exports = async function (file, opts, done) {
  const img = getSquareIcon({
    file,
    icon: opts.icon,
    size: 1024,
    padding: opts.padding
  })

  const buffer = await img.toBuffer()
  const output = await png2icons.createICNS(buffer, opts.compression.ico, 0, true)

  writeFile(file.absoluteName, output, done)
}
