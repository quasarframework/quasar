const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const appPaths = require('./app-paths')
const filePath = appPaths.resolve.app('.quasar/artifacts.json')
const { log } = require('./helpers/logger')

function exists () {
  return fs.existsSync(filePath)
}

function getArtifacts () {
  return exists()
    ? require(filePath)
    : { folders: [] }
}

function save (content) {
  fse.mkdirp(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(content), 'utf-8')
}

module.exports.add = function (entry) {
  const content = getArtifacts()

  if (!content.folders.includes(entry)) {
    content.folders.push(entry)
    save(content)
    log(`Added build artifact "${entry}"`)
  }
}

module.exports.clean = function (folder) {
  if (folder.endsWith(path.join('src-cordova', 'www'))) {
    fse.emptyDirSync(folder)
  }
  else if (folder.endsWith(path.join('src-capacitor', 'www'))) {
    fse.emptyDirSync(folder)
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      appPaths.capacitorDir
    )
  }
  else {
    fse.removeSync(folder)
  }

  log(`Cleaned build artifact: "${folder}"`)
}

module.exports.cleanAll = function () {
  getArtifacts().folders.forEach(folder => {
    if (folder.endsWith(path.join('src-cordova', 'www'))) {
      fse.emptyDirSync(folder)
    }
    else {
      fse.removeSync(folder)
    }

    log(`Cleaned build artifact: "${folder}"`)
  })

  let folder = appPaths.resolve.app('.quasar')
  fse.removeSync(folder)
  log(`Cleaned build artifact: "${folder}"`)

  const distFolder = appPaths.resolve.app('dist')

  if (fs.existsSync(distFolder)) {
    fse.emptyDirSync(distFolder)
    log(`Emptied dist folder`)
  }
}
