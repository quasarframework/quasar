
import fs from 'node:fs'
import fse from 'fs-extra'
import compileTemplate from 'lodash/template.js'
import inquirer from 'inquirer'
import fglob from 'fast-glob'

import { log, warn } from '../../utils/logger.js'
import { spawnSync } from '../../utils/spawn.js'

import { ensureDeps, ensureConsistency } from './ensure-consistency.js'

export function isModeInstalled (appPaths) {
  return fs.existsSync(appPaths.capacitorDir)
}

export async function addMode ({
  ctx: { appPaths, cacheProxy, pkg: { appPkg } },
  silent,
  target
}) {
  if (isModeInstalled(appPaths)) {
    if (target) {
      await addPlatform(target, appPaths, cacheProxy)
    }
    else if (silent !== true) {
      warn('Capacitor support detected already. Aborting.')
    }

    return
  }

  const appName = appPkg.productName || appPkg.name || 'Quasar App'

  if (/^[0-9]/.test(appName)) {
    warn(
      'App product name cannot start with a number. '
      + 'Please change the "productName" prop in your /package.json then try again.'
    )
    return
  }

  console.log()
  const answer = await inquirer.prompt([ {
    name: 'appId',
    type: 'input',
    message: 'What is the Capacitor app id?',
    default: 'org.capacitor.quasar.app',
    validate: appId => (appId ? true : 'Please fill in a value')
  } ])

  log('Creating Capacitor source folder...')

  // Create /src-capacitor from template
  fse.ensureDirSync(appPaths.capacitorDir)

  const nodePackager = await cacheProxy.getModule('nodePackager')
  const scope = {
    appName,
    appId: answer.appId,
    pkg: appPkg,
    nodePackager: nodePackager.name
  }

  fglob.sync([ '**/*' ], {
    cwd: appPaths.resolve.cli('templates/capacitor')
  }).forEach(filePath => {
    const dest = appPaths.resolve.capacitor(filePath)
    const content = fs.readFileSync(appPaths.resolve.cli('templates/capacitor/' + filePath))
    fse.ensureFileSync(dest)
    fs.writeFileSync(dest, compileTemplate(content)(scope), 'utf-8')
  })

  await ensureDeps({ appPaths, cacheProxy })

  const { capBin } = await cacheProxy.getModule('capCli')
  log('Initializing capacitor...')
  spawnSync(
    capBin,
    [
      'init',
      '--web-dir',
      'www',
      scope.appName,
      scope.appId
    ],
    { cwd: appPaths.capacitorDir }
  )

  log('Capacitor support was added')

  if (!target) {
    console.log()
    console.log(' No Capacitor platform has been added yet as these get installed on demand automatically when running "quasar dev" or "quasar build".')
    log()
    return
  }

  await addPlatform(target, appPaths, cacheProxy)
}

export function removeMode ({
  ctx: { appPaths }
}) {
  if (!isModeInstalled(appPaths)) {
    warn('No Capacitor support detected. Aborting.')
    return
  }

  log('Removing Capacitor folder')
  fse.removeSync(appPaths.capacitorDir)

  log('Capacitor support was removed')
}

async function addPlatform (target, appPaths, cacheProxy) {
  await ensureConsistency({ appPaths, cacheProxy })

  // if it has the platform
  if (fs.existsSync(appPaths.resolve.capacitor(target))) {
    return
  }

  const { capBin, capVersion } = await cacheProxy.getModule('capCli')

  if (capVersion >= 3) {
    const nodePackager = await cacheProxy.getModule('nodePackager')
    nodePackager.installPackage(
      `@capacitor/${ target }@^${ capVersion }.0.0`,
      { displayName: 'Capacitor platform', cwd: appPaths.capacitorDir }
    )
  }

  log(`Adding Capacitor platform "${ target }"`)
  spawnSync(
    capBin,
    [ 'add', target ],
    { cwd: appPaths.capacitorDir }
  )
}
