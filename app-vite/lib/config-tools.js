
import { quasar as quasarVitePlugin } from '@quasar/vite-plugin'
import vueVitePlugin from '@vitejs/plugin-vue'
import { merge } from 'webpack-merge'

import { cliPkg } from './utils/cli-runtime.js'
import { getPackage } from './utils/get-package.js'
import { getBuildSystemDefine } from './utils/env.js'
import { log, warn, tip } from './utils/logger.js'

import { quasarViteIndexHtmlTransformPlugin } from './plugins/vite.index-html-transform.js'
import { quasarViteStripFilenameHashesPlugin } from './plugins/vite.strip-filename-hashes.js'

const cliPkgDependencies = Object.keys(cliPkg.dependencies || {})

async function parseVitePlugins (entries, appDir) {
  const acc = []
  let showTip = false

  for (const entry of entries) {
    if (!entry) {
      // example:
      // [
      //   ctx.dev ? [ ... ] : null,
      //   // ...
      // ]
      continue
    }

    if (Array.isArray(entry) === false) {
      if (typeof entry === 'function') {
        showTip = true
      }

      acc.push(entry)
      continue
    }

    const [ name, opts = {} ] = entry

    if (typeof name === 'function') {
      acc.push(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        name(merge({}, opts))
      )
      continue
    }

    if (Object(name) === name) {
      acc.push(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        merge({}, name)
      )
      continue
    }

    if (typeof name !== 'string') {
      warn('quasar.config file > invalid Vite plugin specified: ' + name)
      warn('Correct form: [ \'my-vite-plugin-name\', { /* opts */ } ] or [ pluginFn, { /* opts */ } ]')
      continue
    }

    const plugin = await getPackage(name, appDir)

    if (!plugin) {
      warn('quasar.config file > invalid Vite plugin specified (cannot find it): ' + name)
      continue
    }

    const pluginFn = (
      plugin.default?.default // example: vite-plugin-checker
      || plugin.default
      || plugin
    )

    acc.push(
      pluginFn(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        merge({}, opts)
      )
    )
  }

  if (showTip === true) {
    tip('If you want changes to quasar.config file > build > vitePlugins to be picked up, specify them in this form: [ [ \'plugin-name\', { /* opts */ } ], ... ] or [ [ pluginFn, { /* opts */ } ], ... ]')
  }

  return acc
}

function getQuasarVitePluginRunMode (compileId) {
  if (compileId === 'vite-ssr-client') return 'ssr-client'
  if (compileId === 'vite-ssr-server') return 'ssr-server'
  return 'web-client'
}

export async function createViteConfig (quasarConf, { compileId }) {
  const { ctx, build, metaConf } = quasarConf
  const { appPaths } = ctx

  const cacheDir = appPaths.resolve.cache(compileId)

  // protect against Vite mutating its own options and triggering endless cfg diff loop
  const vueVitePluginOptions = merge(
    compileId !== 'vite-ssr-server'
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
      target: compileId === 'vite-ssr-server'
        ? build.target.node
        : build.target.browser,
      modulePreload: build.polyfillModulePreload === true
        ? true
        : { polyfill: false },
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
        runMode: getQuasarVitePluginRunMode(compileId),
        autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
        sassVariables: quasarConf.metaConf.css.variablesFile,
        devTreeshaking: quasarConf.build.devQuasarTreeshaking === true
      }),
      ...(await parseVitePlugins(build.vitePlugins, appPaths.appDir))
    ]
  }

  if (compileId !== 'vite-ssr-server') {
    if (ctx.prod === true && quasarConf.build.useFilenameHashes !== true) {
      viteConf.plugins.push(quasarViteStripFilenameHashesPlugin())
    }

    if (compileId !== 'vite-ssr-client' || quasarConf.ctx.prod === true) {
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
      const { default: rollupPluginVisualizer } = await import('rollup-plugin-visualizer')
      viteConf.plugins.push(
        rollupPluginVisualizer.visualizer({
          open: true,
          filename: appPaths.resolve.cache('stats.html'),
          ...(Object(analyze) === analyze ? analyze : {})
        })
      )
    }
  }

  if (compileId !== 'vite-ssr-server') {
    const { hasEslint } = await quasarConf.ctx.cacheProxy.getModule('eslint')
    if (hasEslint === true) {
      const { warnings, errors } = quasarConf.eslint
      if (warnings === true || errors === true) {
        // import only if actually needed (as it imports app's eslint pkg)
        const { quasarViteESLintPlugin } = await import('./plugins/vite.eslint.js')
        viteConf.plugins.push(
          await quasarViteESLintPlugin(quasarConf, compileId)
        )
      }
    }
  }

  return viteConf
}

export function extendViteConfig (viteConf, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  if (typeof quasarConf.build.extendViteConf === 'function') {
    quasarConf.build.extendViteConf(viteConf, opts)
  }

  const { appExt } = quasarConf.ctx
  const promise = appExt.runAppExtensionHook('extendViteConf', async hook => {
    log(`Extension(${ hook.api.extId }): Extending Vite config`)
    await hook.fn(viteConf, opts, hook.api)
  })

  return promise.then(() => viteConf)
}

export async function createNodeEsbuildConfig (quasarConf, { compileId, format }) {
  const {
    ctx: {
      pkg: { appPkg },
      cacheProxy
    }
  } = quasarConf

  const externalsList = cacheProxy.getRuntime('externalEsbuildParam', () => [
    ...cliPkgDependencies,
    ...Object.keys(appPkg.dependencies || {}),
    ...Object.keys(appPkg.devDependencies || {})
  ])

  const cfg = {
    platform: 'node',
    target: quasarConf.build.target.node,
    format,
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: {
      ...quasarConf.build.alias,
      'quasar/wrappers': format === 'esm' ? 'quasar/wrappers/index.mjs' : 'quasar/wrappers/index.js'
    },
    resolveExtensions: [ format === 'esm' ? '.mjs' : '.cjs', '.js', '.mts', '.ts', '.json' ],
    // we use a fresh list since this can be tampered with by the user:
    external: [ ...externalsList ],
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    })
  }

  const { hasEslint } = await cacheProxy.getModule('eslint')
  if (hasEslint === true) {
    const { warnings, errors } = quasarConf.eslint
    if (warnings === true || errors === true) {
      // import only if actually needed (as it imports app's eslint pkg)
      const { quasarEsbuildESLintPlugin } = await import('./plugins/esbuild.eslint.js')
      cfg.plugins = [
        await quasarEsbuildESLintPlugin(quasarConf, compileId)
      ]
    }
  }

  return cfg
}

export async function createBrowserEsbuildConfig (quasarConf, { compileId }) {
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

  const { hasEslint } = await quasarConf.ctx.cacheProxy.getModule('eslint')
  if (hasEslint === true) {
    const { warnings, errors } = quasarConf.eslint
    if (warnings === true || errors === true) {
      // import only if actually needed (as it imports app's eslint pkg)
      const { quasarEsbuildESLintPlugin } = await import('./plugins/esbuild.eslint.js')
      cfg.plugins = [
        await quasarEsbuildESLintPlugin(quasarConf, compileId)
      ]
    }
  }

  return cfg
}

export function extendEsbuildConfig (esbuildConf, quasarConfTarget, ctx, methodName) {
  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[ methodName ] === 'function') {
    quasarConfTarget[ methodName ](esbuildConf)
  }

  const promise = ctx.appExt.runAppExtensionHook(methodName, async hook => {
    log(`Extension(${ hook.api.extId }): Running "${ methodName }(esbuildConf)"`)
    await hook.fn(esbuildConf, hook.api)
  })

  return promise.then(() => esbuildConf)
}
