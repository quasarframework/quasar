const readChunk = require('read-chunk')
const isPng = require('is-png')

// "fried" png's - http://www.jongware.com/pngdefry.html
const friedChunk = 'CgBI'

function getSize (buffer) {
  const offset = buffer.toString('ascii', 12, 16) === friedChunk
    ? [ 36, 32 ]
    : [ 20, 16 ]

  return {
    height: buffer.readUInt32BE(offset[0]),
    width: buffer.readUInt32BE(offset[1])
  }
}

module.exports = function getPngSize (file) {
  const buffer = readChunk.sync(file, 0, 40)

  return isPng(buffer) !== true
    ? { width: 0, height: 0}
    : getSize(buffer)
}
