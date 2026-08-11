import fse from 'fs-extra'

import { createPromptSession, warn } from '../../utils/logger.js'
import {
  copyModeWorkspace,
  ensureModeDeps,
  ensureModePackageJsonAndWorkspace,
  isModeInstalled,
  resolveSsrWebserver
} from '../modes-utils.js'

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean,
 *   webserver?: string
 * }} options
 */
export async function addMode({ ctx, silent, webserver }) {
  const { appPaths, cacheProxy } = ctx

  if (isModeInstalled(appPaths, 'ssr')) {
    const forceInstall = await ensureModePackageJsonAndWorkspace('ssr', ctx, {
      webserver
    })
    await ensureModeDeps('ssr', ctx, forceInstall)

    if (silent !== true) {
      warn('SSR support detected already. Aborting.')
    }

    return
  }

  const promptSession = await createPromptSession('Installing SSR Mode...')

  const answer = {
    webserver: await resolveSsrWebserver({
      promptSession,
      webserver,
      message: 'What production web server should Quasar use?'
    })
  }

  const copyTask = promptSession.taskLog({ title: 'Creating /src-ssr...' })

  await copyModeWorkspace('ssr', ctx)

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'

  fse.copySync(appPaths.resolve.cli(`templates/ssr/common`), appPaths.ssrDir)

  const webserverCommonPath = appPaths.resolve.cli(
    `templates/ssr/${answer.webserver}/common`
  )
  if (fse.existsSync(webserverCommonPath)) {
    fse.copySync(webserverCommonPath, appPaths.ssrDir)
  }

  fse.copySync(
    appPaths.resolve.cli(`templates/ssr/${answer.webserver}/${format}`),
    appPaths.ssrDir
  )

  copyTask.success('Created /src-ssr')
  await ensureModeDeps('ssr', ctx, true)

  promptSession.end('SSR support was added')
}
