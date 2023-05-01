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

  // clear require cache so subsequent reads will get the updated content
  delete require.cache[ filePath ]
}

module.exports.add = function (entry) {
  const content = getArtifacts()

  // add folder if it doesn't exist
  if (content.folders.some(asset => entry.startsWith(asset)) === false) {
    // if there's a folder that is a subfolder of this one, remove it
    content.folders = content.folders.filter(asset => asset.startsWith(entry) === false)

    // finally add the folder
    content.folders.push(entry)

    // and save the file
    save(content)
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
}

module.exports.cleanAll = function () {
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
