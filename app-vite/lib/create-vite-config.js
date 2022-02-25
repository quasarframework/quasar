const { quasar: quasarVitePlugin } = require('@quasar/vite-plugin')
const vueVitePlugin = require('@vitejs/plugin-vue')
const getPackage = require('./helpers/get-package')

const appPaths = require('./app-paths')
const parseEnv = require('./parse-env')

const quasarVitePluginIndexHtmlTransform = require('./vite-plugins/index-html-transform')

function printInvalidSyntax (name) {
  console.error('[Quasar CLI] quasar.config.js > invalid Vite plugin specified:', name)
  console.error(`Correct form: [ 'my-vite-plugin-name', { /* opts */ } ]`)
}

function isPlainObject (v) {
  return Object.prototype.toString.call(v) === '[object Object]'
}

function parseVitePlugins (entries) {
  const acc = []

  entries.forEach(entry => {
    if (Array.isArray(entry) === false) {
      printInvalidSyntax(name)
      return
    }

    const [ name, opts ] = entry

    if (typeof name === 'function') {
      acc.push(name(opts))
      return
    }

    if (typeof name !== 'string') {
      printInvalidSyntax(name)
      return
    }

    const plugin = getPackage(name)

    if (!plugin) {
      console.error('[Quasar CLI] quasar.config.js > invalid Vite plugin specified (cannot find it):', name)
      return
    }

    acc.push((plugin.default || plugin)(opts))
  })

  return acc
}

// Inject props only if explicitly specified
// otherwise it might mess up with Vite's defaults
function inject (target, source, propList) {
  for (const prop of propList) {
    const entry = source[prop]
    if (
      entry !== void 0
      && (
        isPlainObject(entry) === false
        || Object.keys(entry).length > 0
      )
    ) {
      target[prop] = entry
    }
  }
}

module.exports = function (quasarConf, quasarRunMode) {
  const { ctx, build } = quasarConf

  const viteConf = {
    configFile: false,
    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder === true
      ? false
      : appPaths.publicDir,
    clearScreen: false,
    mode: ctx.dev === true ? 'development' : 'production',
    cacheDir: appPaths.resolve.app(
      'node_modules/.cache/vite/'
      + (quasarRunMode || quasarConf.ctx.modeName)
    ),

    resolve: build.resolve,
    define: parseEnv(build.env, build.rawDefine),

    build: {
      emptyOutDir: false,
      sourcemap: build.sourcemap === true
        ? 'inline'
        : build.sourcemap || false
    },

    plugins: [
      vueVitePlugin({
        ssr: quasarRunMode === 'ssr-server',
        ...build.viteVuePluginOptions
      }),
      quasarVitePlugin({
        runMode: quasarRunMode || void 0,
        autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
        sassVariables: quasarConf.metaConf.css.variablesFile
      }),
      ...parseVitePlugins(build.vitePlugins)
    ]
  }

  inject(viteConf, build, [
    'css',
    'json',
    'optimizeDeps',
    'assetsInclude'
  ])

  inject(viteConf.build, build, [
    'rollupOptions',
    'commonjsOptions',
    'dynamicImportVarsOptions',
    'reportCompressedSize',
    'chunkSizeWarningLimit',
    'assetsInlineLimit',
    'cssCodeSplit'
  ])

  if (
    quasarRunMode !== 'ssr-server'
    && (quasarRunMode !== 'ssr-client' || quasarConf.ctx.prod === true)
  ) {
    viteConf.plugins.unshift(
      quasarVitePluginIndexHtmlTransform(quasarConf)
    )
  }

  if (ctx.dev) {
    viteConf.server = quasarConf.devServer
  }
  else {
    viteConf.build.outDir = build.distDir

    const analyze = quasarConf.build.analyze
    if (quasarRunMode !== 'ssr-server' && analyze) {
      viteConf.plugins.push(
        require('rollup-plugin-visualizer').visualizer({
          open: true,
          filename: 'stats-' + (quasarRunMode || quasarConf.ctx.modeName) + '.html',
          ...(Object(analyze) === analyze ? analyze : {})
        })
      )
    }
  }

  if (build.minify === false) {
    viteConf.build.minify = false
  }

  return viteConf
}
