const { statSync } = require('fs')

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

function humanStorageSize (bytes) {
  let u = 0

  while (parseInt(bytes, 10) >= 1024 && u < units.length - 1) {
    bytes /= 1024
    ++u
  }

  return `${bytes.toFixed(1)}${units[u]}`
}

module.exports = function getFileSize (filename) {
  return humanStorageSize(statSync(filename).size)
}
