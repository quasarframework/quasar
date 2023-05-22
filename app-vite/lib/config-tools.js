
const { mergeConfig } = require('vite')
const { quasar: quasarVitePlugin } = require('@quasar/vite-plugin')
const vueVitePlugin = require('@vitejs/plugin-vue')
const { merge } = require('webpack-merge')
const { removeSync } = require('fs-extra')

const appPaths = require('./app-paths.js')
const { cliPkg, appPkg } = require('./app-pkg.js')
const { getPackage } = require('./utils/get-package.js')
const { getBuildSystemDefine } = require('./utils/env.js')
const { log, warn, tip } = require('./utils/logger.js')
const { extensionRunner } = require('./app-extension/extensions-runner.js')

const { quasarViteIndexHtmlTransformPlugin } = require('./plugins/vite.index-html-transform.js')
const { quasarViteStripFilenameHashesPlugin } = require('./plugins/vite.strip-filename-hashes.js')

const externalsList = [
  ...Object.keys(cliPkg.dependencies || {}),
  ...Object.keys(appPkg.dependencies || {}),
  ...Object.keys(appPkg.devDependencies || {})
]

function parseVitePlugins (entries) {
  const acc = []
  let showTip = false

  entries.forEach(entry => {
    if (!entry) {
      // example:
      // [
      //   ctx.dev ? [ ... ] : null,
      //   // ...
      // ]
      return
    }

    if (Array.isArray(entry) === false) {
      if (typeof entry === 'function') {
        showTip = true
      }

      acc.push(entry)
      return
    }

    const [ name, opts = {} ] = entry

    if (typeof name === 'function') {
      acc.push(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        name(merge({}, opts))
      )
      return
    }

    if (Object(name) === name) {
      acc.push(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        merge({}, name)
      )
      return
    }

    if (typeof name !== 'string') {
      warn('quasar.config file > invalid Vite plugin specified: ' + name)
      warn('Correct form: [ \'my-vite-plugin-name\', { /* opts */ } ] or [ pluginFn, { /* opts */ } ]')
      return
    }

    const plugin = getPackage(name)

    if (!plugin) {
      warn('quasar.config file > invalid Vite plugin specified (cannot find it): ' + name)
      return
    }

    acc.push(
      (plugin.default || plugin)(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        merge({}, opts)
      )
    )
  })

  if (showTip === true) {
    tip('If you want changes to quasar.config file > build > vitePlugins to be picked up, specify them in this form: [ [ \'plugin-name\', { /* opts */ } ], ... ] or [ [ pluginFn, { /* opts */ } ], ... ]')
  }

  return acc
}

module.exports.createViteConfig = function createViteConfig (quasarConf, quasarRunMode) {
  const { ctx, build, metaConf } = quasarConf
  const cacheSuffix = quasarRunMode || ctx.modeName
  const cacheDir = appPaths.resolve.app(`node_modules/.q-cache/vite/${ cacheSuffix }`)

  if (quasarConf.build.rebuildCache === true) {
    removeSync(cacheDir)
  }

  // protect against Vite mutating its own options and triggering endless cfg diff loop
  const vueVitePluginOptions = merge(
    quasarRunMode !== 'ssr-server'
      ? {}
      : { ssr: true, template: { ssr: true } },
    build.viteVuePluginOptions
  )

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
    cacheDir,
    define: getBuildSystemDefine({
      buildEnv: build.env,
      buildRawDefine: build.rawDefine,
      fileEnv: metaConf.fileEnv
    }),

    resolve: {
      alias: build.alias
    },

    build: {
      target: quasarRunMode === 'ssr-server'
        ? build.target.node
        : build.target.browser,
      polyfillModulePreload: build.polyfillModulePreload,
      emptyOutDir: false,
      minify: build.minify,
      sourcemap: build.sourcemap === true
        ? 'inline'
        : build.sourcemap || false
    },

    optimizeDeps: {
      entries: [ 'index.html' ]
    },

    plugins: [
      vueVitePlugin(vueVitePluginOptions),
      quasarVitePlugin({
        runMode: quasarRunMode || 'web-client',
        autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
        sassVariables: quasarConf.metaConf.css.variablesFile,
        devTreeshaking: quasarConf.build.devQuasarTreeshaking === true
      }),
      ...parseVitePlugins(build.vitePlugins)
    ]
  }

  if (quasarRunMode !== 'ssr-server') {
    if (ctx.prod === true && quasarConf.build.useFilenameHashes !== true) {
      viteConf.plugins.push(quasarViteStripFilenameHashesPlugin())
    }

    if (quasarRunMode !== 'ssr-client' || quasarConf.ctx.prod === true) {
      viteConf.plugins.unshift(
        quasarViteIndexHtmlTransformPlugin(quasarConf)
      )
    }
  }

  if (ctx.dev) {
    // protect against Vite (or a Vite plugin) mutating the original
    // and triggering endless cfg diff loop
    viteConf.server = merge({}, quasarConf.devServer)
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

  if (quasarRunMode !== 'ssr-server') {
    const { warnings, errors } = quasarConf.eslint
    if (warnings === true || errors === true) {
      // require only if actually needed (as it imports app's eslint pkg)
      const { quasarViteESLintPlugin } = require('./plugins/vite.eslint.js')
      viteConf.plugins.push(
        quasarViteESLintPlugin(quasarConf, { cacheSuffix })
      )
    }
  }

  return viteConf
}

module.exports.extendViteConfig = function extendViteConfig (viteConf, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  if (typeof quasarConf.build.extendViteConf === 'function') {
    quasarConf.build.extendViteConf(viteConf, opts)
  }

  const promise = extensionRunner.runHook('extendViteConf', async hook => {
    log(`Extension(${ hook.api.extId }): Extending Vite config`)
    await hook.fn(viteConf, opts, hook.api)
  })

  return promise.then(() => viteConf)
}

module.exports.createNodeEsbuildConfig = function createNodeEsbuildConfig (quasarConf, getLinterOpts) {
  const cfg = {
    platform: 'node',
    target: quasarConf.build.target.node,
    format: 'cjs',
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: quasarConf.build.alias,
    external: [ ...externalsList ],
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    })
  }

  const { warnings, errors } = quasarConf.eslint
  if (warnings === true || errors === true) {
    // require only if actually needed (as it imports app's eslint pkg)
    const { quasarEsbuildESLingPlugin } = require('./plugins/esbuild.eslint.js')
    cfg.plugins = [
      quasarEsbuildESLingPlugin(quasarConf, getLinterOpts)
    ]
  }

  return cfg
}

module.exports.createBrowserEsbuildConfig = function createBrowserEsbuildConfig (quasarConf, getLinterOpts) {
  const cfg = {
    platform: 'browser',
    target: quasarConf.build.target.browser,
    format: 'iife',
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: quasarConf.build.alias,
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    })
  }

  const { warnings, errors } = quasarConf.eslint
  if (warnings === true || errors === true) {
    // require only if actually needed (as it imports app's eslint pkg)
    const { quasarEsbuildESLingPlugin } = require('./plugins/esbuild.eslint.js')
    cfg.plugins = [
      quasarEsbuildESLingPlugin(quasarConf, getLinterOpts)
    ]
  }

  return cfg
}

module.exports.extendEsbuildConfig = function extendEsbuildConfig (esbuildConf, quasarConfTarget, threadName) {
  const method = `extend${ threadName }Conf`

  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[ method ] === 'function') {
    quasarConfTarget[ method ](esbuildConf)
  }

  const promise = extensionRunner.runHook(method, async hook => {
    log(`Extension(${ hook.api.extId }): Extending "${ threadName }" Esbuild config`)
    await hook.fn(esbuildConf, hook.api)
  })

  return promise.then(() => esbuildConf)
}

module.exports.mergeViteConfig = mergeConfig
