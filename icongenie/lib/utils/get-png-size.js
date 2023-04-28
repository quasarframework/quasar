
import { readChunkSync } from 'read-chunk'
import isPng from 'is-png'

// "fried" png's - http://www.jongware.com/pngdefry.html
const friedChunk = 'CgBI'

function getSize (buffer) {
  const offset = buffer.toString('ascii', 12, 16) === friedChunk
    ? [ 36, 32 ]
    : [ 20, 16 ]

  return {
    height: buffer.readUInt32BE(offset[ 0 ]),
    width: buffer.readUInt32BE(offset[ 1 ])
  }
}

export function getPngSize (file) {
  const buffer = readChunkSync(file, { startPosition: 0, length: 40 })

  return isPng(buffer) !== true
    ? { width: 0, height: 0 }
    : getSize(buffer)
}
