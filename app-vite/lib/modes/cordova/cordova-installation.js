import fse from 'fs-extra'
import { green } from 'kolorist'

import { createPromptSession, warn } from '../../utils/logger.js'
import { spawnSync } from '../../utils/spawn.js'
import {
  ensureModeDeps,
  isModeInstalled,
  resolvePromptAnswer
} from '../modes-utils.js'

const defaultAppId = 'org.cordova.quasar.app'

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean,
 *   target: 'android' | 'ios' | undefined,
 *   appId?: string
 * }} options
 */
export async function addMode({ ctx, silent, target, appId }) {
  const {
    appPaths,
    pkg: { appPkg }
  } = ctx

  if (isModeInstalled(appPaths, 'cordova')) {
    ensureWWW({ appPaths, forced: true })

    if (!fse.existsSync(appPaths.resolve.cordova('package.json'))) {
      warn(
        '/src-cordova/package.json not found. Your setup seems broken. Please remove Cordova support and add it again.'
      )
      warn()
      process.exit(1)
    }

    if (target) {
      await ensureModeDeps('cordova', ctx)
      await addPlatform(appPaths, target)
    } else if (silent !== true) {
      warn('Cordova support detected already. Aborting.')
    }

    return
  }

  const appName = appPkg.productName || appPkg.name || 'Quasar App'

  if (/^[0-9]/.test(appName)) {
    warn(
      'App product name cannot start with a number. ' +
        'Please change the "productName" prop in your /package.json then try again.'
    )
    return
  }

  const promptSession = await createPromptSession('Installing Cordova Mode...')

  const answer = {
    appId: await resolvePromptAnswer({
      promptSession,
      value: appId,
      validate: val => {
        if (!val) return 'The app id cannot be empty'
      },
      fallback: defaultAppId,
      fallbackNote: `Using "${defaultAppId}" as the app id.`,
      question: () =>
        promptSession.text({
          message: 'What is the Cordova app id?',
          placeholder: defaultAppId,
          validate: val => {
            if (!val) return 'Please fill in a value'
          }
        })
    })
  }

  await spawnSync('cordova', ['create', 'src-cordova', answer.appId, appName], {
    cwd: appPaths.appDir
  })

  ensureWWW({ appPaths, forced: true })

  promptSession.note(
    `App name was taken from package.json: "${appName}"` +
      '\n\nIf you want a different App name then remove Cordova support,' +
      '\nedit productName field from package.json then' +
      '\nadd Cordova support again.',
    'App name:'
  )

  promptSession.note(
    'If developing for iOS, it is HIGHLY recommended that you' +
      '\ninstall the Ionic Webview Plugin.' +
      `\n\n${green('https://quasar.dev/quasar-cli-vite/developing-cordova-apps/preparation')}`,
    'WARNING!'
  )

  if (target) {
    await addPlatform(appPaths, target)
  } else {
    promptSession.note(
      'Cordova support was added without any platform. ' +
        '\nYou can add Android or iOS platforms by running: ' +
        '\n "quasar dev -m cordova -T android" or ' +
        '\n "quasar dev -m cordova -T ios".',
      'Next step:'
    )
  }

  promptSession.end('Cordova support was added')
}

async function addPlatform(appPaths, target) {
  // if it has the platform
  if (fse.existsSync(appPaths.resolve.cordova(`platforms/${target}`))) return

  await spawnSync('cordova', ['platform', 'add', target], {
    cwd: appPaths.cordovaDir
  })
}

function ensureWWW({ appPaths, forced }) {
  const www = appPaths.resolve.cordova('www')

  if (forced) fse.removeSync(www)

  if (!fse.existsSync(www)) {
    fse.copySync(appPaths.resolve.cli('templates/cordova/www'), www)
  }
}
