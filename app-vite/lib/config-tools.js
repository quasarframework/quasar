import { quasar as quasarVitePlugin } from '@quasar/vite-plugin'
import vueVitePlugin from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import { merge } from 'webpack-merge'

import { cliPkg } from './utils/cli-runtime.js'
import { getPackage } from './utils/get-package.js'
import { getBuildSystemDefine } from './utils/env.js'
import { log, warn, tip } from './utils/logger.js'

import { quasarViteIndexHtmlTransformPlugin } from './plugins/vite.index-html-transform.js'
import { quasarViteStripFilenameHashesPlugin } from './plugins/vite.strip-filename-hashes.js'

const cliPkgDependencies = Object.keys(cliPkg.dependencies || {})

/* Should match Vite's own hard-coded values */
export const BASELINE_WIDELY_AVAILABLE_TARGET_STRING =
  'baseline-widely-available'
const ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET = [
  'chrome111',
  'edge111',
  'firefox114',
  'safari16.4',
  'ios16.4'
]

async function parseVitePlugins(entries, appDir, compileId) {
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

    const [name, pluginOpts = {}, runOpts = { client: true, server: true }] =
      entry

    if (compileId === 'vite-ssr-server') {
      // if it's configured to not run on server, then skip it
      if (runOpts.server === false) continue
    } else if (runOpts.client === false) {
      // if it's configured to not run on client, then skip it
      continue
    }

    if (typeof name === 'function') {
      acc.push(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        name(merge({}, pluginOpts))
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
      warn(
        "Correct form: [ 'my-vite-plugin-name', { /* pluginOpts */ } ] or [ pluginFn, { /* pluginOpts */ } ]"
      )
      continue
    }

    const plugin = await getPackage(name, appDir)

    if (!plugin) {
      warn(
        'quasar.config file > invalid Vite plugin specified (cannot find it): ' +
          name
      )
      continue
    }

    const pluginFn =
      plugin.default?.default || // example: vite-plugin-checker
      plugin.default ||
      plugin

    acc.push(
      pluginFn(
        // protect against the Vite plugin mutating its own options and triggering endless cfg diff loop
        merge({}, pluginOpts)
      )
    )
  }

  if (showTip === true) {
    tip(
      'If you want changes to quasar.config file > build > vitePlugins to be picked up,' +
        ' specify them in this form:' +
        "[ [ 'plugin-name', { /* pluginOpts */ }, { client: true, server: true } ], ... ]" +
        ' or [ [ pluginFn, { /* pluginOpts */ }, { client: true, server: true } ], ... ]'
    )
  }

  return acc
}

function getQuasarVitePluginRunMode(compileId) {
  if (compileId === 'vite-ssr-client') return 'ssr-client'
  if (compileId === 'vite-ssr-server') return 'ssr-server'
  return 'web-client'
}

export async function createViteConfig(quasarConf, { compileId }) {
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

  /**
   * @type {import('vite').UserConfig}
   */
  const viteConf = {
    configFile: false,
    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder === true ? false : appPaths.publicDir,
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
      alias: {
        ...build.alias
      }
    },

    css: {
      preprocessorOptions: {
        sass: {
          silenceDeprecations: ['import', 'global-builtin']
        },
        scss: {
          silenceDeprecations: ['import', 'global-builtin']
        }
      }
    },

    build: {
      target:
        compileId === 'vite-ssr-server'
          ? build.target.node
          : build.target.browser,
      modulePreload:
        build.polyfillModulePreload === true ? true : { polyfill: false },
      emptyOutDir: false,
      minify: build.minify,
      sourcemap: build.sourcemap
    },

    optimizeDeps: {
      entries: ['index.html']
    },

    plugins: [
      vueVitePlugin(vueVitePluginOptions),
      quasarVitePlugin({
        runMode: getQuasarVitePluginRunMode(compileId),
        autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
        autoImportVueExtensions: quasarConf.framework.autoImportVueExtensions,
        autoImportScriptExtensions:
          quasarConf.framework.autoImportScriptExtensions,
        devTreeshaking: quasarConf.framework.devTreeshaking === true,
        sassVariables: quasarConf.metaConf.css.variablesFile
      }),
      ...(await parseVitePlugins(build.vitePlugins, appPaths.appDir, compileId))
    ]
  }

  if (compileId !== 'vite-ssr-server') {
    if (ctx.prod === true && quasarConf.build.useFilenameHashes !== true) {
      viteConf.plugins.push(quasarViteStripFilenameHashesPlugin())
    }

    if (compileId !== 'vite-ssr-client' || quasarConf.ctx.prod === true) {
      viteConf.plugins.unshift(quasarViteIndexHtmlTransformPlugin(quasarConf))
    }
  }

  if (ctx.dev) {
    const warmup =
      compileId !== 'vite-ssr-server'
        ? {
            clientFiles: [quasarConf.metaConf.entryScript.absolutePath]
          }
        : {}

    // protect against Vite (or a Vite plugin) mutating the original
    // and triggering endless cfg diff loop
    viteConf.server = merge({ warmup }, quasarConf.devServer)
  } else {
    viteConf.build.outDir = build.distDir

    const analyze = quasarConf.build.analyze
    if (analyze) {
      const { visualizer } = await import('rollup-plugin-visualizer')
      viteConf.plugins.push(
        visualizer({
          open: true,
          filename: appPaths.resolve.cache('stats.html'),
          ...(Object(analyze) === analyze ? analyze : {})
        })
      )
    }
  }

  return viteConf
}

export function extendViteConfig(viteConf, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  if (typeof quasarConf.build.extendViteConf === 'function') {
    const overrides = quasarConf.build.extendViteConf(viteConf, opts)
    if (overrides) {
      viteConf = mergeConfig(viteConf, overrides)
    }
  }

  const { appExt } = quasarConf.ctx
  const promise = appExt.runAppExtensionHook('extendViteConf', async hook => {
    log(`Extension(${hook.api.extId}): Extending Vite config`)
    await hook.fn(viteConf, opts, hook.api)
  })

  return promise.then(() => viteConf)
}

export function createNodeEsbuildConfig(quasarConf, { format }) {
  const {
    ctx: {
      pkg: { appPkg },
      cacheProxy
    }
  } = quasarConf

  const externalsList = cacheProxy.getRuntime('externalEsbuildParam', () =>
    [
      ...cliPkgDependencies,
      ...Object.keys(appPkg.dependencies || {}),
      ...Object.keys(appPkg.devDependencies || {})
    ].filter(
      // the possible imports of '#q-app/wrappers' / '@quasar/app-vite/wrappers'
      dep => dep !== cliPkg.name
    )
  )

  return {
    platform: 'node',
    target: quasarConf.build.target.node,
    format,
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: {
      ...quasarConf.build.alias
    },
    resolveExtensions:
      format === 'esm'
        ? ['.mjs', '.js', '.cjs', '.ts', '.json']
        : ['.cjs', '.js', '.mjs', '.ts', '.json'],
    // we use a fresh list since this can be tampered with by the user:
    external: [...externalsList],
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    }),
    plugins: []
  }
}

export function createBrowserEsbuildConfig(quasarConf) {
  const { browser } = quasarConf.build.target
  const target =
    browser === BASELINE_WIDELY_AVAILABLE_TARGET_STRING
      ? ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET
      : browser

  return {
    platform: 'browser',
    target,
    format: 'iife',
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: {
      ...quasarConf.build.alias
    },
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    }),
    plugins: []
  }
}

export function extendEsbuildConfig(
  esbuildConf,
  quasarConfTarget,
  ctx,
  methodName
) {
  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[methodName] === 'function') {
    quasarConfTarget[methodName](esbuildConf)
  }

  const promise = ctx.appExt.runAppExtensionHook(methodName, async hook => {
    log(`Extension(${hook.api.extId}): Running "${methodName}(esbuildConf)"`)
    await hook.fn(esbuildConf, hook.api)
  })

  return promise.then(() => esbuildConf)
}
