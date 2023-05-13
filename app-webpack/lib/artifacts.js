const fs = require('node:fs')
const path = require('node:path')
const fse = require('fs-extra')

const appPaths = require('./app-paths.js')
const { log } = require('./utils/logger.js')

const filePath = appPaths.resolve.app('.quasar/artifacts.json')

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

module.exports.addArtifacts = function addArtifacts (entry) {
  const content = getArtifacts()

  if (!content.folders.includes(entry)) {
    content.folders.push(entry)
    save(content)
    log(`Added build artifact "${ entry }"`)
  }
}

module.exports.cleanArtifacts = function cleanArtifacts (folder) {
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

  log(`Cleaned build artifact: "${ folder }"`)
}

module.exports.cleanAllArtifacts = function cleanAllArtifacts () {
  getArtifacts().folders.forEach(folder => {
    if (folder.endsWith(path.join('src-cordova', 'www'))) {
      fse.emptyDirSync(folder)
    }
    else {
      fse.removeSync(folder)
    }

    log(`Cleaned build artifact: "${ folder }"`)
  })

  const folder = appPaths.resolve.app('.quasar')
  fse.removeSync(folder)
  log(`Cleaned build artifact: "${ folder }"`)

  const distFolder = appPaths.resolve.app('dist')

  if (fs.existsSync(distFolder)) {
    fse.emptyDirSync(distFolder)
    log('Emptied dist folder')
  }
}
