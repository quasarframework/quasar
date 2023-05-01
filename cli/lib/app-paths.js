
import { existsSync } from 'node:fs'
import { normalize, join, sep } from 'node:path'

const quasarConfigFilenameList = [
  'quasar.config.js',
  'quasar.config.mjs',
  'quasar.config.ts',
  'quasar.config.cjs',
  'quasar.conf.js' // legacy
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const name of quasarConfigFilenameList) {
      const filename = join(appDir, name)
      if (existsSync(filename)) {
        return { appDir, quasarConfigFilename: filename }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  return {}
}

const { appDir, quasarConfigFilename } = getAppInfo()

const cliDir = new URL('..', import.meta.url).pathname

export default {
  cliDir,
  appDir,

  quasarConfigFilename,

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir)
  }
}
