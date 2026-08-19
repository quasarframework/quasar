import { join } from 'node:path'
import { resolveConfig } from 'vite'
import { describe, expect, test } from 'vitest'

import { quasar } from '../../../src/index'

const packageRoot = join(import.meta.dirname, '../../..')

const bareImport = "import {QBtn} from 'quasar'"
const mappedImport = "import QBtn from 'quasar/src/components/btn/QBtn.js'"

/**
 * Runs the plugin through Vite's real config resolution instead of a
 * mocked resolvedConfig, mirroring the CLI launch: no inherited
 * NODE_ENV and the CLI's per-command default (serve => development,
 * build => production), then returns the script plugin to probe.
 */
async function resolveScriptPlugin(command, mode) {
  const plugins = quasar({ devTreeshaking: false })
  const prevNodeEnv = process.env.NODE_ENV

  delete process.env.NODE_ENV

  try {
    await resolveConfig(
      {
        configFile: false,
        envFile: false,
        logLevel: 'silent',
        root: packageRoot,
        plugins: [{ name: 'vite:vue' }, ...plugins]
      },
      command,
      mode,
      command === 'build' ? 'production' : 'development'
    )
  } finally {
    process.env.NODE_ENV = prevNodeEnv
  }

  return plugins.find(({ name }) => name === 'vite:quasar:script')
}

describe('dev detection through real Vite config resolution', () => {
  test.each([
    ['serve', 'development'],
    ['serve', 'staging']
  ])(
    '%s with mode "%s" keeps bare quasar imports (dev path)',
    async (command, mode) => {
      const scriptPlugin = await resolveScriptPlugin(command, mode)

      expect(scriptPlugin.transform.handler(bareImport, 'test.js')).toBeNull()
    }
  )

  test.each([
    ['build', 'production'],
    ['build', 'qa']
  ])(
    '%s with mode "%s" maps quasar imports to per-file paths',
    async (command, mode) => {
      const scriptPlugin = await resolveScriptPlugin(command, mode)
      const result = scriptPlugin.transform.handler(bareImport, 'test.js')

      expect(result.code).toContain(mappedImport)
      expect(result.code).not.toContain("from 'quasar'")
    }
  )
})
