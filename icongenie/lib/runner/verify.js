import { existsSync } from 'node:fs'
import { gray, green, red, underline } from 'kolorist'

import { appDir, resolveDir } from '../utils/app-paths.js'
import { warn } from '../utils/logger.js'

import { modes } from '../modes/index.js'
import { verifyMount } from '../mount/index.js'
import { getAssetsFiles } from '../utils/get-assets-files.js'
import { filterPlatformFiles } from '../utils/filter-platform-files.js'
import { getPngSize } from '../utils/get-png-size.js'
import { parseArgv } from '../utils/parse-argv.js'
import { mergeObjects } from '../utils/merge-objects.js'
import { getProfileContent } from '../utils/get-profile-content.js'
import { validateProfileObject } from '../utils/validate-profile-object.js'

// dark variants are opt-in, so a missing one is only an error
// when the params ask for them
function isOptional(file, params) {
  return file.dark === true && !params.splashscreenDarkColor
}

function getFileStatus(file, params) {
  if (!existsSync(file.absoluteName)) {
    return isOptional(file, params)
      ? gray('not generated (no splashscreen dark color)')
      : red('ERROR: missing!')
  }

  if (
    file.generator === 'png' ||
    file.generator === 'splashscreen' ||
    file.generator === 'launcher'
  ) {
    const { width, height } = getPngSize(file.absoluteName)

    if (width === 0 && height === 0) {
      return red('ERROR: not a png!')
    }

    if (width !== file.width || height !== file.height) {
      return red(`ERROR: incorrect resolution! ${width}x${height}`)
    }
  }

  return green('SIZE OK')
}

function printMode(modeName, files, params) {
  console.log(` ${green(underline(`Mode ${modeName.toUpperCase()}`))} \n`)

  files.forEach(file => {
    const mountStatus =
      isOptional(file, params) && !existsSync(file.absoluteName)
        ? ''
        : verifyMount(file)

    console.log(
      ` ${getFileStatus(file, params)} - ${(file.generator + ':').padEnd(13, ' ')} ${file.relativeName} ${mountStatus}`
    )
  })

  console.log()
}

function printBanner(assetsOf, params) {
  console.log(` VERIFYING with the following options:
 ================
 Root folder..... ${green(appDir)}
 Assets of....... ${green(assetsOf)}
 Assets filter... ${!params.filter ? 'none' : green(params.filter)}
 ================
`)
}

function parseAssets(assets, include) {
  const filesMap = []
  const assetsOf = []

  if (include) {
    const embeddedModes = include.filter(mode =>
      existsSync(resolveDir(modes[mode].folder))
    )

    embeddedModes.forEach(mode => {
      filesMap.push({
        name: mode,
        files: filterPlatformFiles(getAssetsFiles(modes[mode].assets))
      })
    })

    assetsOf.push(...embeddedModes)
  }

  if (assets && assets.length !== 0) {
    filesMap.push({
      name: 'profile assets',
      files: filterPlatformFiles(getAssetsFiles(assets))
    })

    assetsOf.push('profile')
  }

  return {
    filesMap,
    assetsOf: assetsOf.join(' | ')
  }
}

function verifyProfile(profile) {
  const params = profile.params
  const { assetsOf, filesMap } = parseAssets(profile.assets, params.include)

  if (assetsOf.length === 0) {
    warn(
      `No assets to generate! No mode/include specified, filter too specific or the respective Quasar mode(s) are not installed`
    )
    return
  }

  printBanner(assetsOf, params)

  filesMap.forEach(entry => {
    const files = params.filter
      ? entry.files.filter(file => file.generator === params.filter)
      : entry.files

    if (files.length !== 0) {
      printMode(entry.name, files, params)
    }
  })
}

export function verify(argv) {
  const profile = {
    params: {},
    assets: []
  }

  if (argv.profile) {
    parseArgv(argv, ['profile'])

    const userProfile = getProfileContent(argv.profile)

    if (userProfile.params) {
      const { profile: _, ...params } = argv

      profile.params = mergeObjects(userProfile.params, params)
      parseArgv(profile.params, ['include'])
    }
    if (userProfile.assets) {
      profile.assets = userProfile.assets
    }
  } else {
    parseArgv(argv, ['mode'])

    const { mode, ...params } = argv

    profile.params = params
    profile.params.include = mode
  }

  parseArgv(profile.params, [
    'filter',
    // order matters:
    'themeColor',
    'pngColor',
    'splashscreenColor',
    'splashscreenDarkColor',
    'svgColor'
  ])

  // final thorough validation
  validateProfileObject(profile)

  verifyProfile(profile)
}
