import { getAvailableUpdate } from '@quasar/update-notifier'

import { version } from './version.js'

const REFRESH_TIMEOUT = 10_000

/**
 * @typedef {object} UpdateState
 * @property {string} name
 * @property {string} version
 * @property {string | undefined} latest A newer release, when one is known.
 */

/**
 * Newer releases of the server and of the docs packages installed in
 * the project's apps (a version shared by several apps is checked once), via
 * the notifier shared with the Quasar CLIs: from its cache (refreshed in
 * the background, so a session usually learns about a release the day
 * after it ships), or straight from the registry with `refresh`. An
 * offline machine gets no check at all.
 *
 * @param {import('./project.js').Project} project
 * @param {{ refresh?: boolean }} [opts]
 * @returns {Promise<UpdateState[]>}
 */
export function checkUpdates(project, { refresh = false } = {}) {
  const targets = [{ name: '@quasar/mcp', version }]
  for (const pkg of project.apps.flatMap(app => app.packages)) {
    if (!targets.some(t => t.name === pkg.name && t.version === pkg.version)) {
      targets.push({ name: pkg.name, version: pkg.version })
    }
  }
  return Promise.all(
    targets.map(async target => ({
      ...target,
      latest: await getAvailableUpdate({
        ...target,
        refresh,
        // a tool call is waited on; the background check keeps the default
        timeout: REFRESH_TIMEOUT
      })
    }))
  )
}
