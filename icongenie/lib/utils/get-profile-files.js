const { basename } = require('path')
const glob = require('fast-glob')
const { lstatSync } = require('fs')

const { warn } = require('../utils/logger')

function parseFolder (folder) {
  const profileFiles = glob.sync(`icongenie-*.json`, {
    cwd: folder,
    deep: 1,
    absolute: true
  })

  const numberOfFiles = profileFiles.length

  if (numberOfFiles === 0) {
    warn(`No icongenie-*.json files detected in "${folder}" folder!`)
    process.exit(1)
  }

  console.log(` Detected ${numberOfFiles} JSON profile file(s):\n`)
  console.log(` * ${folder}`)

  profileFiles.forEach((file, index) => {
    const prefix = index + 1 < profileFiles.length
      ? `├──`
      : `└──`

    console.log(` ${prefix} ${basename(file)}`)
  })

  console.log()

  return profileFiles
}

module.exports = function getProfileFiles (profileParam) {
  return lstatSync(profileParam).isDirectory()
    ? parseFolder(profileParam)
    : [ profileParam ]
}
