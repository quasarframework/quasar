import fse from 'fs-extra'

import { createPromptSession, warn } from '../../utils/logger.js'
import {
  copyModeWorkspace,
  ensureModeDeps,
  ensureModePackageJsonAndWorkspace,
  isModeInstalled
} from '../modes-utils.js'

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean
 * }} options
 */
export async function addMode({ ctx, silent }) {
  const { appPaths, cacheProxy } = ctx

  if (isModeInstalled(appPaths, 'ssg')) {
    const forceInstall = await ensureModePackageJsonAndWorkspace('ssg', ctx)
    await ensureModeDeps('ssg', ctx, forceInstall)

    if (silent !== true) {
      warn('SSG support detected already. Aborting.')
    }

    return
  }

  const promptSession = await createPromptSession('Installing SSG Mode...')
  const copyTask = promptSession.taskLog({ title: 'Creating /src-ssg...' })

  await copyModeWorkspace('ssg', ctx)

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'

  fse.copySync(appPaths.resolve.cli(`templates/ssg/common`), appPaths.ssgDir)
  fse.copySync(appPaths.resolve.cli(`templates/ssg/${format}`), appPaths.ssgDir)

  copyTask.success('Created /src-ssg')
  await ensureModeDeps('ssg', ctx, true)

  promptSession.end('SSG support was added')
}
