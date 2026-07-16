import fs from 'node:fs'

import { fatal, log } from '../../utils/logger.js'
import { getPackageJson } from '../../utils/get-package-json.js'

// Quasar supports only .ts and .js. The Capacitor CLI itself also accepts
// .json, but Quasar refuses to load it (see #resolveSource).
const SOURCE_EXTENSIONS = ['ts', 'js']

const sslSkipVersion = {
  5: '^0.3.0',
  6: '^0.4.0',
  7: '^0.4.0',
  8: '^0.4.0',
  default: '^0.4.0'
}

export class CapacitorConfigFile {
  runtimeEnv = null

  #ctx

  async prepare(quasarConf, target) {
    this.#ctx = quasarConf.ctx

    const { cacheProxy } = quasarConf.ctx

    this.runtimeEnv = this.#buildRuntimeEnv(quasarConf)

    const source = this.#resolveSource()
    const { capVersion } = await cacheProxy.getModule('capCli')

    // The user's source is the authoritative config. Quasar passes its runtime info
    // to the Capacitor CLI process via env. The user's config file reads it via
    // defineCapacitorConfig and applies dev-time defaults at config-load time.
    log(`Using capacitor.config.${source.ext}`)
    await this.#updateSSL(quasarConf, target, capVersion)
  }

  #resolveSource() {
    const { appPaths } = this.#ctx
    for (const ext of SOURCE_EXTENSIONS) {
      const path = appPaths.resolve.capacitor(`capacitor.config.${ext}`)
      if (fs.existsSync(path)) {
        return { ext, path }
      }
    }

    const jsonPath = appPaths.resolve.capacitor('capacitor.config.json')
    if (fs.existsSync(jsonPath)) {
      fatal(
        'Found capacitor.config.json, which is no longer supported as of @quasar/app-vite v3.\n' +
          'See: https://v2.quasar.dev/quasar-cli-vite/upgrade-guide#-js-ts-capacitor-config'
      )
    }

    fatal(
      'Capacitor mode requires capacitor.config.ts or capacitor.config.js.\n' +
        'See: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor#file-format'
    )
  }

  #buildRuntimeEnv(quasarConf) {
    const env = {}

    // Values in backendEnvDefineList / build.define are Vite-define-encoded
    // (bool/number/null as-is, strings JSON-quoted), so unwrap and coerce to plain strings.
    const addFromDefines = defines => {
      for (const key in defines) {
        const envKey = key.replace(/^import\.meta\.env\./, '')
        const raw = defines[key]
        try {
          const parsed = JSON.parse(raw)
          env[envKey] = typeof parsed === 'string' ? parsed : String(parsed)
        } catch {
          env[envKey] = raw
        }
      }
    }

    // Forward user-defined env vars (.env files + quasar.config.build.env) so
    // they're readable as process.env.X inside capacitor.config.{ts,js}.
    addFromDefines(quasarConf.metaConf.backendEnvDefineList)

    // Forward Quasar's own QUASAR_* defines (e.g., QUASAR_DEV)
    const quasarDefines = Object.fromEntries(
      Object.entries(quasarConf.build.define).filter(([key]) =>
        key.startsWith('import.meta.env.QUASAR_')
      )
    )
    addFromDefines(quasarDefines)

    return env
  }

  async #updateSSL(quasarConf, target, capVersion) {
    const { appPaths, cacheProxy } = this.#ctx
    const add = quasarConf.ctx.dev ? quasarConf.devServer.https : false

    const hasPlugin =
      getPackageJson('@jcesarmobile/ssl-skip', appPaths.capacitorDir) !== void 0

    // nothing to do
    if (add ? hasPlugin : !hasPlugin) return

    const fn = `${add ? '' : 'un'}installPackage`
    const version = sslSkipVersion[capVersion] || sslSkipVersion.default
    const nameParam = add
      ? `@jcesarmobile/ssl-skip@${version}`
      : '@jcesarmobile/ssl-skip'

    const nodePackager = await cacheProxy.getModule('nodePackager')
    await nodePackager[fn](nameParam, {
      cwd: appPaths.capacitorDir
    })

    // make sure "cap sync" is run before triggering IDE or build
  }
}
