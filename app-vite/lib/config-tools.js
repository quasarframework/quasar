
const { mergeConfig } = require('vite')
const { quasar: quasarVitePlugin } = require('@quasar/vite-plugin')
const vueVitePlugin = require('@vitejs/plugin-vue')
const getPackage = require('./helpers/get-package')
const { merge } = require('webpack-merge')

const appPaths = require('./app-paths')
const parseEnv = require('./parse-env')
const extensionRunner = require('./app-extension/extensions-runner')

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

function createViteConfig (quasarConf, quasarRunMode) {
  const { ctx, build } = quasarConf

  const vueVitePluginOptions = quasarRunMode !== 'ssr-server'
    ? build.viteVuePluginOptions
    : merge({
        ssr: true,
        template: { ssr: true }
      }, build.viteVuePluginOptions)

  const viteConf = {
    configFile: false,
    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder === true
      ? false
      : appPaths.publicDir,
    clearScreen: false,
    logLevel: 'warn',
    mode: ctx.dev === true ? 'development' : 'production',
    cacheDir: `node_modules/.vite/${ quasarRunMode || ctx.modeName }`,

    resolve: build.resolve,
    define: parseEnv(build.env, build.rawDefine),

    build: {
      target: quasarRunMode === 'ssr-server'
        ? build.target.node
        : build.target.browser,
      polyfillModulePreload: build.polyfillModulePreload,
      emptyOutDir: false,
      sourcemap: build.sourcemap === true
        ? 'inline'
        : build.sourcemap || false
    },

    plugins: [
      vueVitePlugin(vueVitePluginOptions),
      quasarVitePlugin({
        runMode: quasarRunMode || 'web-client',
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
    'assetsInclude',
    'worker'
  ])

  inject(viteConf.build, build, [
    'rollupOptions',
    'commonjsOptions',
    'dynamicImportVarsOptions',
    'reportCompressedSize',
    'chunkSizeWarningLimit',
    'assetsInlineLimit',
    'cssCodeSplit',
    'assetsDir'
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
    if (analyze) {
      viteConf.plugins.push(
        require('rollup-plugin-visualizer').visualizer({
          open: true,
          filename: `.quasar/stats-${ quasarRunMode }.html`,
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

function extendViteConfig (viteConf, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  if (typeof quasarConf.build.extendViteConfig === 'function') {
    quasarConf.build.extendViteConfig(viteConf, opts)
  }

  const promise = extensionRunner.runHook('extendViteConfig', async hook => {
    log(`Extension(${hook.api.extId}): Extending "${quasarRunMode}" Vite config`)
    await hook.fn(viteConf, opts, hook.api)
  })

  return promise.then(() => viteConf)
}

function extendEsbuildConfig (esbuildConf, quasarConfTarget, threadName) {
  const method = `extend${threadName}Conf`

  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[method] === 'function') {
    quasarConfTarget[method](esbuildConf)
  }

  const promise = extensionRunner.runHook(method, async hook => {
    log(`Extension(${hook.api.extId}): Extending "${threadName}" Esbuild config`)
    await hook.fn(esbuildConf, hook.api)
  })

  return promise.then(() => esbuildConf)
}

module.exports.createViteConfig = createViteConfig
module.exports.extendViteConfig = extendViteConfig
module.exports.mergeViteConfig = mergeConfig

module.exports.extendEsbuildConfig = extendEsbuildConfig
