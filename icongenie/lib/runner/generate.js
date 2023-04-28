
import { existsSync } from 'node:fs'
import { ensureFileSync } from 'fs-extra'
import { green, gray } from 'kolorist'

import { appDir, resolveDir } from '../utils/app-paths.js'
import { log, warn } from '../utils/logger.js'

import { modes } from '../modes/index.js'
import { generators } from '../generators/index.js'
import { mount } from '../mount/index.js'

import { getAssetsFiles } from '../utils/get-assets-files.js'
import { getFilesOptions } from '../utils/get-files-options.js'
import { parseArgv } from '../utils/parse-argv.js'
import { mergeObjects } from '../utils/merge-objects.js'
import { getProfileContent } from '../utils/get-profile-content.js'
import { getFileSize } from '../utils/get-file-size.js'
import { validateProfileObject } from '../utils/validate-profile-object.js'

function printBanner (assetsOf, params) {
  console.log(` Generating files with the following options:
 ==========================
 Quasar project folder..... ${ green(appDir) }
 ${ green(`Quality level............. ${ params.quality }/12`) }
 Icon source file.......... ${ green(params.icon) }
 Icon trimming............. ${ params.skipTrim ? 'no' : green('yes') }
 Icon padding.............. ${ green(`horizontal: ${ params.padding[ 0 ] }; vertical: ${ params.padding[ 1 ] }`) }
 Background source file.... ${ params.background ? green(params.background) : 'none' }
 Assets of................. ${ green(assetsOf) }
 Generator filter.......... ${ params.filter ? green(params.filter) : 'none' }
 Svg color................. ${ green(params.svgColor) }
 Png color................. ${ green(params.pngColor) }
 Splashscreen color........ ${ green(params.splashscreenColor) }
 Splashscreen icon ratio... ${ green(params.splashscreenIconRatio) }%
 ==========================
`)
}

function parseAssets (assets, include) {
  let files = []
  let assetsOf = []

  if (include) {
    const embeddedModes = include.filter(
      mode => existsSync(resolveDir(modes[ mode ].folder))
    )

    embeddedModes.forEach(mode => {
      files = files.concat(
        getAssetsFiles(modes[ mode ].assets)
      )
    })

    assetsOf = assetsOf.concat(embeddedModes)
  }

  if (assets && assets.length > 0) {
    files = files.concat(getAssetsFiles(assets))
    assetsOf.push('profile')
  }

  return {
    files,
    assetsOf: assetsOf.join(' | ')
  }
}

function getUniqueFiles (files) {
  const filePaths = {}
  const uniqueFiles = []

  files.forEach(file => {
    if (filePaths[ file.absoluteName ] === void 0) {
      filePaths[ file.absoluteName ] = true
      uniqueFiles.push(file)
    }
  })

  return uniqueFiles
}

function generateFile (file, opts) {
  // ensure that the file (and its folder) exists
  ensureFileSync(file.absoluteName)

  return new Promise(resolve => {
    // use the appropriate generator to handle the file creation
    generators[ file.generator ](file, opts, () => {
      const size = `(${ getFileSize(file.absoluteName) })`
      const type = (file.generator + ':').padEnd(13, ' ')

      log(`Generated ${ type } ${ green(file.relativeName) } ${ gray(size) }`)
      resolve()
    })
  })
}

async function generateFromProfile (profile) {
  const params = profile.params
  const { assetsOf, files } = parseAssets(profile.assets, params.include)

  const fileOptions = await getFilesOptions(params)
  let uniqueFiles = getUniqueFiles(files)

  if (params.filter) {
    uniqueFiles = uniqueFiles.filter(
      file => file.generator === params.filter
    )
  }

  if (uniqueFiles.length === 0) {
    warn(`No assets to generate! No mode/include specified, filter too specific or the respective Quasar mode(s) are not installed`)
    return Promise.resolve(0)
  }

  printBanner(assetsOf, params)

  return Promise
    .all(uniqueFiles.map(file => generateFile(file, fileOptions)))
    .then(() => { mount(uniqueFiles) })
    .then(() => uniqueFiles.length)
}

export function generate (argv) {
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

  profile.params = mergeObjects({}, profile.params)

  parseArgv(profile.params, [
    'quality', 'filter', 'padding',
    'icon', 'background',
    'splashscreenIconRatio',
    // order matters:
    'themeColor', 'pngColor', 'splashscreenColor', 'svgColor'
  ])

  // final thorough validation
  validateProfileObject(profile)

  return generateFromProfile(profile)
    .then(numberOfFiles => {
      console.log(`\n Task done - generated ${ numberOfFiles } file(s)!\n`)
    })
}
