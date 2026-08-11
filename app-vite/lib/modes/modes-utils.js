import { existsSync } from 'node:fs'
import { isCI } from 'ci-info'
import fse from 'fs-extra'

import { createPromptSession, fatal, info } from '../utils/logger.js'

export const ssrWebservers = [
  { value: 'hono', label: 'Hono' },
  { value: 'fastify', label: 'Fastify' },
  { value: 'express', label: 'Express' },
  { value: 'koa', label: 'Koa' }
]

const defaultSsrWebserver = 'hono'

export const isNonInteractive = () => isCI || !process.stdin.isTTY

/**
 * Resolves the answer to a mode installation question without assuming an
 * interactive terminal: an explicitly supplied value (validated) wins, a
 * non-interactive run (CI or piped stdin, where prompting would abort the
 * whole command) falls back to a default, and an interactive terminal gets
 * the prompt.
 *
 * @param {Object} opts
 * @param {Awaited<ReturnType<createPromptSession>>} opts.promptSession
 * @param {any} [opts.value] explicitly supplied answer (e.g. a CLI param)
 * @param {(value: any) => string | undefined} [opts.validate] returns an
 *   error message for an unacceptable value (applied to the explicit value
 *   AND to the non-interactive fallback)
 * @param {any} opts.fallback the non-interactive answer
 * @param {string} opts.fallbackNote logged when the fallback is used;
 *   phrase it as the decision taken, e.g. 'Using the "X" webserver.'
 * @param {() => any} opts.question the interactive prompt
 * @returns {Promise<any>}
 */
export async function resolvePromptAnswer({
  promptSession,
  value,
  validate,
  fallback,
  fallbackNote,
  question
}) {
  if (value !== void 0) {
    const error = validate?.(value)
    if (error) fatal(error)
    return value
  }

  if (isNonInteractive()) {
    const error = validate?.(fallback)
    if (error) fatal(error)

    promptSession.log.info(
      `Non-interactive environment detected. ${fallbackNote}`
    )
    return fallback
  }

  const { answer } = await promptSession.prompt({ answer: question })
  return answer
}

/**
 * @param {Object} opts
 * @param {Awaited<ReturnType<createPromptSession>>} opts.promptSession
 * @param {string} [opts.webserver] explicitly requested flavor
 * @param {string} opts.message prompt message
 * @returns {Promise<string>}
 */
export function resolveSsrWebserver({ promptSession, webserver, message }) {
  return resolvePromptAnswer({
    promptSession,
    value: webserver,
    validate: value =>
      ssrWebservers.some(entry => entry.value === value)
        ? void 0
        : `Unknown SSR webserver "${value}". Valid values: ${ssrWebservers.map(entry => entry.value).join(' | ')}`,
    fallback: defaultSsrWebserver,
    fallbackNote: `Using the "${defaultSsrWebserver}" webserver.`,
    question: () =>
      promptSession.select({
        message,
        options: ssrWebservers
      })
  })
}

/**
 * @param {import('../../types/app-paths').QuasarAppPaths} appPaths
 * @param {import('../../types/configuration/context').QuasarMode} modeName
 * @returns {boolean}
 */
export function isModeInstalled(appPaths, modeName) {
  return (
    modeName === 'spa' || // always installed
    existsSync(appPaths[`${modeName}Dir`])
  )
}

async function getScriptFormat(cacheProxy) {
  const hasTypescript = await cacheProxy.getModule('hasTypescript')
  return hasTypescript ? 'ts' : 'js'
}

/**
 * @param {import('../../types/configuration/context').QuasarMode} modeName
 * @param {Object} opts
 * @param {import('../../types/app-paths').QuasarAppPaths} opts.appPaths
 * @param {import('../../types/configuration/context').CacheProxy} opts.cacheProxy
 * @param {Object} [preferences]
 * @param {string} [preferences.webserver] SSR mode only: the webserver flavor
 *   to use should package.json need to be re-created
 * @returns {Promise<boolean>} true if it had to create anything that requires re-install
 */
export async function ensureModePackageJsonAndWorkspace(
  modeName,
  { appPaths, cacheProxy },
  { webserver: webserverPreference } = {}
) {
  // Nothing to do for SPA or Cordova mode
  if (modeName === 'spa' || modeName === 'cordova') return false

  let hadToCreateFiles = false

  const packageJsonPath = appPaths.resolve[modeName]('package.json')
  if (!existsSync(packageJsonPath)) {
    if (modeName === 'ssr') {
      const promptSession = await createPromptSession(
        '⚠️  SSR Mode is missing package.json...'
      )

      const webserver = await resolveSsrWebserver({
        promptSession,
        webserver: webserverPreference,
        message: 'What production webserver are you currently using?'
      })

      const subfolder =
        webserver === 'express' || webserver === 'koa'
          ? await getScriptFormat(cacheProxy)
          : 'common'

      fse.copySync(
        appPaths.resolve.cli(
          `templates/ssr/${webserver}/${subfolder}/package.json`
        ),
        packageJsonPath
      )

      promptSession.end('Created /src-ssr/package.json')
      hadToCreateFiles = true
    } else {
      const sourceSuffixPackageJsonPath =
        modeName === 'bex'
          ? `${await getScriptFormat(cacheProxy)}/package.json`
          : 'common/package.json'

      fse.copySync(
        appPaths.resolve.cli(
          `templates/${modeName}/${sourceSuffixPackageJsonPath}`
        ),
        packageJsonPath
      )

      info(`Created missing package.json in /src-${modeName}`)
      hadToCreateFiles = true
    }
  }

  const pnpmWorkspaceYamlPath = appPaths.resolve[modeName](
    'pnpm-workspace.yaml'
  )
  if (!existsSync(pnpmWorkspaceYamlPath)) {
    const nodePackager = await cacheProxy.getModule('nodePackager')
    // If the user is not using pnpm, and they are deleting the pnpm workspace file on purpose,
    // re-creating could be annoying. So, we only create it if using pnpm.
    if (nodePackager.name === 'pnpm') {
      // a mode-specific workspace file wins over the generic one (e.g.
      // electron's, which allowlists electron's binary-downloading
      // postinstall script — pnpm blocks lifecycle scripts by default)
      const modeSpecificPath = appPaths.resolve.cli(
        `templates/${modeName}/common/pnpm-workspace.yaml`
      )

      fse.copySync(
        existsSync(modeSpecificPath)
          ? modeSpecificPath
          : appPaths.resolve.cli(`templates/workspace/pnpm-workspace.yaml`),
        pnpmWorkspaceYamlPath
      )

      info(`Created missing pnpm-workspace.yaml in /src-${modeName}`)
      hadToCreateFiles = true
    }
  }

  return hadToCreateFiles
}

/**
 * @param {import('../../types/configuration/context').QuasarMode} modeName
 * @param {Object} opts
 * @param {import('../../types/app-paths').QuasarAppPaths} opts.appPaths
 * @param {import('../../types/configuration/context').CacheProxy} opts.cacheProxy
 * @param {boolean} force - maybe mode package.json was missing
 */
export async function ensureModeDeps(
  modeName,
  { appPaths, cacheProxy },
  force = false
) {
  if (
    modeName === 'spa' ||
    (!force && existsSync(appPaths.resolve[modeName]('node_modules')))
  ) {
    return
  }

  if (modeName === 'cordova') {
    // Cordova CLI works only with NPM...
    const { spawnSync } = await import('../utils/spawn.js')
    await spawnSync('npm', ['install'], {
      cwd: appPaths.cordovaDir,
      env: { NODE_ENV: 'development' }
    })
  } else {
    const nodePackager = await cacheProxy.getModule('nodePackager')
    await nodePackager.install({ cwd: appPaths[`${modeName}Dir`] })
  }
}

/**
 * @param {import('../../types/configuration/context').QuasarMode} modeName
 * @param {Object} opts
 * @param {import('../../types/app-paths').QuasarAppPaths} opts.appPaths
 * @param {import('../../types/configuration/context').CacheProxy} opts.cacheProxy
 */
export async function copyModeWorkspace(modeName, { appPaths, cacheProxy }) {
  if (modeName === 'spa' || modeName === 'cordova') return

  const nodePackager = await cacheProxy.getModule('nodePackager')
  if (nodePackager.name === 'pnpm') {
    fse.copySync(
      appPaths.resolve.cli('templates/workspace'),
      appPaths[`${modeName}Dir`]
    )
  }
}
