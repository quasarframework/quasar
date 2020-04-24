const { existsSync } = require('fs')
const { green, red, underline } = require('chalk')

const { appDir, resolveDir } = require('../utils/app-paths')
const { warn } = require('../utils/logger')

const modes = require('../modes')
const { verifyMount } = require('../mount')
const getAssetsFiles = require('../utils/get-assets-files')
const getPngSize = require('../utils/get-png-size')
const parseArgv = require('../utils/parse-argv')
const mergeObjects = require('../utils/merge-objects')
const getProfileContent = require('../utils/get-profile-content')
const validateProfileObject = require('../utils/validate-profile-object')

function getFileStatus (file) {
  if (!existsSync(file.absoluteName)) {
    return red('ERROR: missing!')
  }

  if (file.generator === 'png' || file.generator === 'splashscreen') {
    const { width, height } = getPngSize(file.absoluteName)

    if (width === 0 && height === 0) {
      return red('ERROR: not a png!')
    }

    if (width !== file.width || height !== file.height) {
      return red('ERROR: incorrect resolution!')
    }
  }

  return green('SIZE OK')
}

function printMode (modeName, files) {
  console.log(` ${green(underline(`Mode ${modeName.toUpperCase()}`))} \n`)

  files.forEach(file => {
    console.log(` ${getFileStatus(file)} - ${(file.generator + ':').padEnd(13, ' ')} ${file.relativeName} ${verifyMount(file)}`)
  })

  console.log()
}

function printBanner (assetsOf, params) {
  console.log(` VERIFYING with the following options:
 ================
 Root folder..... ${green(appDir)}
 Assets of....... ${green(assetsOf)}
 Assets filter... ${!params.filter ? 'none' : green(params.filter)}
 ================
`)
}

function parseAssets (assets, include) {
  let filesMap = []
  let assetsOf = []

  if (include) {
    const embeddedModes = include.filter(
      mode => existsSync(resolveDir(modes[mode].folder))
    )

    embeddedModes.forEach(mode => {
      filesMap.push({
        name: mode,
        files: getAssetsFiles(modes[mode].assets)
      })
    })

    assetsOf = assetsOf.concat(embeddedModes)
  }

  if (assets && assets.length > 0) {
    filesMap.push({
      name: 'profile assets',
      files: getAssetsFiles(assets)
    })

    assetsOf.push('profile')
  }

  return {
    filesMap,
    assetsOf: assetsOf.join(' | ')
  }
}

function verifyProfile (profile) {
  const params = profile.params
  const { assetsOf, filesMap } = parseAssets(profile.assets, params.include)

  if (assetsOf.length === 0) {
    warn(`No assets to generate! No mode/include specified, filter too specific or the respective Quasar mode(s) are not installed`)
    return
  }

  printBanner(assetsOf, params)

  filesMap.forEach(entry => {
    const files = params.filter
      ? entry.files.filter(file => file.generator === params.filter)
      : entry.files

    if (files.length > 0) {
      printMode(entry.name, files)
    }
  })
}

module.exports = function verify (argv) {
  const profile = {
    params: {},
    assets: []
  }

  if (argv.profile) {
    parseArgv(argv, [ 'profile' ])

    const userProfile = getProfileContent(argv.profile)

    if (userProfile.params) {
      const { profile: _, ...params } = argv

      profile.params = mergeObjects(userProfile.params, params)
      parseArgv(profile.params, [ 'include' ])
    }
    if (userProfile.assets) {
      profile.assets = userProfile.assets
    }
  }
  else {
    parseArgv(argv, [ 'mode' ])

    const { mode, ...params } = argv

    profile.params = params
    profile.params.include = mode
  }

  parseArgv(profile.params, [ 'filter' ])

  // final thorough validation
  validateProfileObject(profile)

  verifyProfile(profile)
}
