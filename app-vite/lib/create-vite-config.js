const { quasar: quasarVitePlugin } = require('@quasar/vite-plugin')
const vueVitePlugin = require('@vitejs/plugin-vue')
const getPackage = require('./helpers/get-package')

const appPaths = require('./app-paths')
const parseEnv = require('./parse-env')

const quasarVitePluginIndexHtmlTransform = require('./vite-plugins/index-html-transform')

function parseVitePlugins (entries) {
  const acc = []

  entries.forEach(([ name, opts ]) => {
    if (typeof name === 'function') {
      acc.push(name(opts))
      return
    }

    if (typeof name !== 'string') {
      console.error('[Quasar CLI] quasar.config.js > invalid Vite plugin specified:', name)
      console.error(`Correct form: [ 'my-vite-plugin-name', { /* opts */ } ]`)
      return
    }

    const plugin = getPackage(name)

    if (!plugin) {
      console.error('[Quasar CLI] quasar.config.js > invalid Vite plugin specified (cannot find it):', name)
      return
    }

    acc.push(plugin(opts))
  })

  return acc
}

module.exports = function (quasarConf, quasarRunMode) {
  const { ctx, build } = quasarConf
  const quasarPluginOptions = {
    autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
    sassVariables: quasarConf.metaConf.css.variablesFile
  }

  if (quasarRunMode !== void 0) {
    quasarPluginOptions.runMode = quasarRunMode
  }

  const viteConf = {
    configFile: false,
    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder === true
      ? false
      : appPaths.publicDir,
    clearScreen: false,
    mode: ctx.dev === true ? 'development' : 'production',
    resolve: build.resolve,
    define: parseEnv(build.env, build.rawDefine),
    css: build.css,
    json: build.json,
    optimizeDeps: build.optimizeDeps,
    assetsInclude: build.assetsInclude,
    build: {
      rollupOptions: build.rollupOptions,
      commonjsOptions: build.commonjsOptions,
      dynamicImportVarsOptions: build.dynamicImportVarsOptions,
      reportCompressedSize: build.reportCompressedSize,
      chunkSizeWarningLimit: build.chunkSizeWarningLimit,
      assetsInlineLimit: build.assetsInlineLimit,
      cssCodeSplit: build.cssCodeSplit,
      sourcemap: build.sourcemap === true
        ? 'inline'
        : build.sourcemap || false
    },
    plugins: [
      quasarVitePluginIndexHtmlTransform(quasarConf),
      vueVitePlugin(build.viteVuePluginOptions),
      quasarVitePlugin(quasarPluginOptions),
      ...parseVitePlugins(build.vitePlugins)
    ]
  }

  if (ctx.dev) {
    viteConf.server = quasarConf.devServer
  }
  else {
    viteConf.build.outDir = build.distDir
  }

  if (build.minify === false) {
    viteConf.build.minify = false
  }

  return viteConf
}
