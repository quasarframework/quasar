const
  fs = require('fs'),
  path = require('path'),
  fse = require('fs-extra')

const
  appPaths = require('./app-paths'),
  filePath = appPaths.resolve.app('.quasar/artifacts.json'),
  log = require('./helpers/logger')('app:artifacts')

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

  fse.emptyDirSync(appPaths.resolve.app('dist'))
  log(`Emptied dist folder`)
}
