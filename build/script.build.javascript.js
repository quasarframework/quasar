process.env.BABEL_ENV = 'production'

const

  path = require('path'),

  rollup = require('rollup'),
  uglify = require('uglify-es'),
  buble = require('rollup-plugin-buble'),
  json = require('rollup-plugin-json'),
  vue = require('rollup-plugin-vue'),
  replace = require('rollup-plugin-replace'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  buildConf = require('./build.conf'),
  buildUtils = require('./build.utils'),
  vueConfig = {
    compileTemplate: true,
    htmlMinifier: {collapseBooleanAttributes: false}
  }

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

build([
  {
    input: resolve(`src/index.esm.js`),
    output: resolve(`dist/quasar.${buildConf.themeToken}.esm.js`),
    format: 'es'
  },
  {
    input: resolve('src/ie-compat/ie.js'),
    output: resolve('dist/quasar.ie.polyfills.js'),
    format: 'umd'
  },
  {
    input: resolve(`src/index.umd.js`),
    output: resolve(`dist/quasar.${buildConf.themeToken}.umd.js`),
    format: 'umd'
  }
])

function processEntries (entries) {
  const builds = []

  entries.forEach(entry => {
    if (entry.output.indexOf(buildConf.themeToken) === -1) {
      builds.push(entry)
      return
    }

    buildConf.themes.forEach(theme => {
      builds.push({
        input: entry.input,
        output: entry.output.replace(buildConf.themeToken, theme),
        format: entry.format,
        meta: { theme }
      })
    })
  })

  return builds
}

function build (builds) {
  Promise
    .all(processEntries(builds).map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  const theme = opts.meta && opts.meta.theme
    ? opts.meta.theme
    : null

  const plugins = [
    nodeResolve({
      extensions: theme
        ? [`.${theme}.js`, '.js', `.${theme}.vue`, '.vue']
        : ['.js', '.vue'],
      preferBuiltins: false
    }),
    json(),
    vue(vueConfig),
    buble()
  ]

  if (theme) {
    plugins.push(
      replace({
        '__THEME__': JSON.stringify(theme)
      })
    )
  }

  Object.assign(opts, {
    banner: buildConf.banner,
    name: 'Quasar',
    plugins
  })

  delete opts.meta

  if (opts.format === 'umd') {
    opts.globals = {vue: 'Vue'}
    opts.external = ['vue']
  }

  return opts
}

function addMinExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.min${filename.slice(insertionPoint)}`
}

function buildEntry (config) {
  return rollup
    .rollup(config)
    .then(bundle => bundle.generate(config))
    .then(({ code }) => buildUtils.writeFile(config.output, code))
    .then(code => {
      if (config.format !== 'umd') {
        return new Promise((resolve) => resolve(code))
      }

      const minified = uglify.minify(code, {
        compress: {
          pure_funcs: ['makeMap']
        }
      })

      if (minified.error) {
        return new Promise((resolve, reject) => reject(minified.error))
      }

      return buildUtils.writeFile(
        addMinExtension(config.output),
        (config.banner ? config.banner + '\n' : '') + minified.code,
        true
      )
    })
}
