import fse from 'fs-extra'

import { createPromptSession, warn } from '../../utils/logger.js'
import {
  copyModeWorkspace,
  ensureModeDeps,
  ensureModePackageJsonAndWorkspace,
  isModeInstalled,
  resolvePromptAnswer
} from '../modes-utils.js'

/**
 * @param {{
 *   ctx: import('../../../types/configuration/context').InternalQuasarContext,
 *   silent: boolean,
 *   filenameBasedRouting?: boolean
 * }} options
 */
export async function addMode({ ctx, silent, filenameBasedRouting }) {
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

  const scope = {
    filenameBasedRouting: await resolvePromptAnswer({
      promptSession,
      value: filenameBasedRouting,
      fallback: false,
      fallbackNote: 'Scaffolding for filename-based routing NOT being used.',
      question: () =>
        promptSession.confirm({
          message: `Are you using filename-based routing?`,
          initialValue: false
        })
    })
  }

  const copyTask = promptSession.taskLog({ title: 'Creating /src-ssg...' })

  await copyModeWorkspace('ssg', ctx)

  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  const format = hasTypescript ? 'ts' : 'js'

  fse.copySync(appPaths.resolve.cli(`templates/ssg/common`), appPaths.ssgDir)

  const { renderTemplate } = await import('../../utils/template.js')
  const { globSync } = await import('tinyglobby')
  const formatFiles = globSync(['**/*'], {
    cwd: appPaths.resolve.cli(`templates/ssg/${format}`)
  })

  for (const file of formatFiles) {
    const srcFile = appPaths.resolve.cli(`templates/ssg/${format}/${file}`)
    const destFile = appPaths.resolve.ssg(file)

    const content = fse.readFileSync(srcFile, 'utf8')
    const renderedContent = renderTemplate(content, scope)

    fse.writeFileSync(destFile, renderedContent, 'utf8')
  }

  copyTask.success('Created /src-ssg')
  await ensureModeDeps('ssg', ctx, true)

  promptSession.end('SSG support was added')
}
