import fse from 'fs-extra'
import { globSync } from 'tinyglobby'

import { createPromptSession, warn } from '../../utils/logger.js'
import { spawnSync } from '../../utils/spawn.js'
import { renderTemplate } from '../../utils/template.js'
import {
  copyModeWorkspace,
  ensureModeDeps,
  ensureModePackageJsonAndWorkspace,
  isModeInstalled,
  resolvePromptAnswer
} from '../modes-utils.js'

const defaultAppId = 'org.capacitor.quasar.app'

const validateAppName = val => {
  if (!val) {
    return 'The app display name cannot be empty'
  }
  if (/^[0-9]/.test(val)) {
    return 'The app display name cannot start with a number'
  }
}

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean,
 *   target: 'android' | 'ios' | undefined,
 *   appId?: string,
 *   appName?: string
 * }} options
 */
export async function addMode({ ctx, silent, target, appId, appName }) {
  const {
    appPaths,
    cacheProxy,
    pkg: { appPkg }
  } = ctx

  if (isModeInstalled(appPaths, 'capacitor')) {
    if (target) {
      ensureWWW(ctx)

      const forceInstall = await ensureModePackageJsonAndWorkspace(
        'capacitor',
        ctx
      )
      await ensureModeDeps('capacitor', ctx, forceInstall)
      await addPlatform(target, ctx)
    } else if (silent !== true) {
      warn('Capacitor support detected already. Aborting.')
    }

    return
  }

  const promptSession = await createPromptSession(
    'Installing Capacitor Mode...'
  )

  const defaultAppName = appPkg.productName || appPkg.name || 'Quasar App'

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
          message: 'What is the Capacitor app id?',
          placeholder: defaultAppId,
          validate: val => {
            if (!val) return 'Please fill in a value'
          }
        })
    }),
    appName: await resolvePromptAnswer({
      promptSession,
      value: appName,
      validate: validateAppName,
      fallback: defaultAppName,
      fallbackNote: `Using "${defaultAppName}" as the app display name.`,
      question: () =>
        promptSession.text({
          message: 'What is the Capacitor app display name?',
          initialValue: defaultAppName,
          validate: validateAppName
        })
    })
  }

  const copyTask = promptSession.taskLog({
    title: 'Creating /src-capacitor...'
  })

  await copyModeWorkspace('capacitor', ctx)
  fse.copySync(
    appPaths.resolve.cli('templates/capacitor/common'),
    appPaths.capacitorDir
  )

  const nodePackager = await cacheProxy.getModule('nodePackager')
  const scope = {
    appName: answer.appName,
    appId: answer.appId,
    nodePackager: nodePackager.name
  }

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'
  const cwd = appPaths.resolve.cli(`templates/capacitor/${format}`)
  globSync(['**/*'], { cwd }).forEach(filePath => {
    const dest = appPaths.resolve.capacitor(filePath)
    const content = fse.readFileSync(`${cwd}/${filePath}`, 'utf8')
    fse.writeFileSync(dest, renderTemplate(content, scope), 'utf8')
  })

  copyTask.success('Created /src-capacitor')

  // `cap init` refuses to run when a non-JSON config exists (e.g., js or ts).
  // The scaffolded capacitor.config.{ts,js} already declares appId / appName,
  // which is the only thing `cap init` would write. So, we don't run `cap init`.

  await ensureModeDeps('capacitor', ctx, true)

  if (target) {
    await addPlatform(target, ctx)
  } else {
    promptSession.note(
      'Capacitor support was added without any platform. ' +
        '\nYou can add Android or iOS platforms by running: ' +
        '\n "quasar dev -m capacitor -T android" or ' +
        '\n "quasar dev -m capacitor -T ios".',
      'Next step:'
    )
  }

  promptSession.end('Capacitor support was added')
}

async function addPlatform(target, ctx) {
  const { appPaths, cacheProxy } = ctx

  // if it has the platform
  if (fse.existsSync(appPaths.resolve.capacitor(target))) return

  const { capBin, capVersion } = await cacheProxy.getModule('capCli')

  const nodePackager = await cacheProxy.getModule('nodePackager')
  await nodePackager.installPackage(`@capacitor/${target}@^${capVersion}.0.0`, {
    cwd: appPaths.capacitorDir
  })

  await spawnSync(capBin, ['add', target], { cwd: appPaths.capacitorDir })
}

function ensureWWW({ appPaths }) {
  const www = appPaths.resolve.capacitor('www')

  if (!fse.existsSync(www)) {
    fse.copySync(appPaths.resolve.cli('templates/capacitor/common/www'), www)
  }
}
