const { existsSync } = require('node:fs')
const { normalize, resolve, join, sep } = require('node:path')

const quasarConfigList = [
  { name: 'quasar.config.js', inputFormat: 'esm', outputFormat: 'cjs' },
  { name: 'quasar.config.mjs', inputFormat: 'esm', outputFormat: 'cjs' },
  { name: 'quasar.config.ts', inputFormat: 'ts', outputFormat: 'cjs' },
  { name: 'quasar.config.cjs', inputFormat: 'cjs', outputFormat: 'cjs' },
  { name: 'quasar.conf.js', inputFormat: 'cjs', outputFormat: 'cjs' } // legacy (removed during v2)
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const { name, inputFormat, outputFormat } of quasarConfigList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return { appDir, quasarConfigFilename, quasarConfigInputFormat: inputFormat, quasarConfigOutputFormat: outputFormat }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  const { fatal } = require('./utils/logger.js')
  fatal('Error. This command must be executed inside a Quasar project folder.')
}

const postcssConfigFilenameList = [
  'postcss.config.cjs',
  '.postcssrc.js',
  'postcss.config.js',
  'postcss.config.mjs',
  '.postcssrc.cjs',
  '.postcssrc.mjs'
]

function getPostcssConfigFile (appDir) {
  for (const name of postcssConfigFilenameList) {
    const filename = join(appDir, name)
    if (existsSync(filename)) {
      return filename
    }
  }
}

const babelConfigFilenameList = [
  'babel.config.cjs',
  'babel.config.js',
  'babel.config.mjs',
  '.babelrc.js',
  '.babelrc.cjs',
  '.babelrc.mjs',
  '.babelrc'
]

function getBabelConfigFile (appDir) {
  for (const name of babelConfigFilenameList) {
    const filename = join(appDir, name)
    if (existsSync(filename)) {
      return filename
    }
  }
}

const { appDir, quasarConfigFilename, quasarConfigInputFormat, quasarConfigOutputFormat } = getAppInfo()

const cliDir = resolve(__dirname, '..')
const srcDir = resolve(appDir, 'src')
const pwaDir = resolve(appDir, 'src-pwa')
const ssrDir = resolve(appDir, 'src-ssr')
const cordovaDir = resolve(appDir, 'src-cordova')
const capacitorDir = resolve(appDir, 'src-capacitor')
const electronDir = resolve(appDir, 'src-electron')
const bexDir = resolve(appDir, 'src-bex')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  ssrDir,
  cordovaDir,
  capacitorDir,
  electronDir,
  bexDir,

  quasarConfigFilename,
  quasarConfigInputFormat,
  quasarConfigOutputFormat,

  postcssConfigFilename: getPostcssConfigFile(appDir),
  babelConfigFilename: getBabelConfigFile(appDir),

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    ssr: dir => join(ssrDir, dir),
    cordova: dir => join(cordovaDir, dir),
    capacitor: dir => join(capacitorDir, dir),
    electron: dir => join(electronDir, dir),
    bex: dir => join(bexDir, dir)
  }
}
