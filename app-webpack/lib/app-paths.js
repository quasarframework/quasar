
const { existsSync } = require('fs')
const { normalize, resolve, join, sep } = require('path')

const quasarConfigFilenameList = [
  'quasar.config.js',
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

  const { fatal } = require('./helpers/logger')
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

const { appDir, quasarConfigFilename } = getAppInfo()

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
