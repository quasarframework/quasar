
const { join } = require('path')
const { readdirSync, statSync } = require('fs')

const CHUNK_SIZE_THRESHOLD = 1800 * 1024
const ENTRY_SIZE_THRESHOLD = 70 * 1024
const BASE_FOLDER = join(__dirname, '../public/examples')

const vendorRE = /node_modules[\\/](vue|@vue|quasar|vue-router)[\\/](.*)\.(m?js|css|sass)$/
const exampleRE = /examples:([a-zA-Z0-9]+)$|public[\\/]examples[\\/]([a-zA-Z0-9-]+)/

function getFolderSize (folder) {
  const files = readdirSync(folder)
  const stats = files.map(file => statSync(join(folder, file)))
  return stats.reduce((acc, { size }) => acc + size, 0)
}

function getFolderSizeMap () {
  const folderList = readdirSync(BASE_FOLDER)
  return folderList.reduce((acc, folder) => {
    if (folder.startsWith('.') === false) {
      acc[ folder ] = getFolderSize(join(BASE_FOLDER, folder))
    }
    return acc
  }, {})
}

function getNewChunk () {
  const name = `EXAMPLE.CHUNK.${ chunkIndex }`
  chunkIndex++
  return {
    name,
    size: 0
  }
}

const folderSizeMap = getFolderSizeMap()

let chunkIndex = 0
const chunkList = [getNewChunk()]

module.exports = function manualChunks (id) {
  if (vendorRE.test(id) === true) {
    return 'vendor'
  }

  const match = exampleRE.exec(id)
  if (match !== null) {
    // const name = match[ 1 ] || match[ 2 ]
    // return `EXAMPLE.CHUNK.${ name }`
    // const size = folderSizeMap[ name ]

    // if (size === void 0) {
    //   console.error(`Failed to get examples/${ name } size (build/chunks.js)`)
    //   process.exit(1)
    // }

    // if (size > ENTRY_SIZE_THRESHOLD) {
    //   // big ones should be standalone
    //   return `EXAMPLE.CHUNK.${ name }`
    // }

    // let chunk = chunkList.find(entry => entry.size + size < CHUNK_SIZE_THRESHOLD)

    // if (chunk === void 0) {
    //   chunk = getNewChunk()
    //   chunkList.push(chunk)
    // }

    // chunk.size += size
    // return chunk.name
  }
}
