import { join } from 'node:path'
import { quasar as quasarVitePlugin } from '@quasar/vite-plugin'
import vueVitePlugin from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import { merge } from 'webpack-merge'

import { getPackage } from './utils/get-package.js'
import { tip, warn } from './utils/logger.js'
import {
  BASELINE_WIDELY_AVAILABLE,
  BASELINE_WIDELY_AVAILABLE_TARGET_STRING
} from './utils/build-targets.js'

import { quasarViteIndexHtmlTransformPlugin } from './plugins/vite.index-html-transform.js'
import { quasarViteStripFilenameHashesPlugin } from './plugins/vite.strip-filename-hashes.js'

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

    if (!Array.isArray(entry)) {
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

  if (showTip) {
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

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export async function createViteConfig(
  quasarConf,
  {
    compileId,
    shippedToClient,
    modeDeps = null // support for modes with their own package.json
  }
) {
  const { ctx, build, metaConf } = quasarConf
  const { appPaths } = ctx

  const cacheDir = appPaths.resolve.cache(compileId)

  // protect against Vite mutating its own options and triggering endless cfg diff loop
  const vueVitePluginOptions = merge(
    compileId === 'vite-ssr-server'
      ? { ssr: true, template: { ssr: true } }
      : {},
    build.viteVuePluginOptions
  )

  /**
   * @type {import('vite').UserConfig}
   */
  const viteConf = {
    // also used by "inspect" cmd to determine if it's a Vite config or not:
    configFile: false,

    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder ? false : appPaths.publicDir,
    clearScreen: false,
    logLevel: 'warn',
    mode: ctx.dev ? 'development' : 'production',
    cacheDir,
    define: {
      ...metaConf[
        shippedToClient ? 'clientEnvDefineList' : 'backendEnvDefineList'
      ],
      ...build.define
    },

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
        devTreeshaking: Boolean(quasarConf.framework.devTreeshaking),
        sassVariables: quasarConf.metaConf.css.variablesFile
      }),
      ...(await parseVitePlugins(build.vitePlugins, appPaths.appDir, compileId))
    ]
  }

  const { filenameBasedRouting } = quasarConf.build
  if (filenameBasedRouting) {
    const vueRouterVite = await ctx.cacheProxy.getModule('vueRouter')
    viteConf.plugins.unshift(
      vueRouterVite({
        // protect against the Vite plugin mutating its own options
        // and triggering endless cfg diff loop
        ...filenameBasedRouting
      })
    )
  }

  if (compileId !== 'vite-ssr-server') {
    if (ctx.prod && quasarConf.build.useFilenameHashes !== true) {
      viteConf.plugins.push(quasarViteStripFilenameHashesPlugin())
    }

    if (compileId !== 'vite-ssr-client' || quasarConf.ctx.prod) {
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
  }

  modeDeps?.forEach(({ dir, deps }) => {
    if (!deps) return

    // dir is of type: "src-<modeName>", example: "src-pwa"
    const target = appPaths.resolve.app(`${dir}/node_modules`)

    // we need to set alias as various mode deps
    // are installed in /src-{modeName} and not in root
    // so it breaks Vite
    Object.keys(deps).forEach(depName => {
      viteConf.resolve.alias[depName] = join(target, depName)
    })
  })

  return viteConf
}

export async function extendViteConfig(viteConf, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  if (typeof quasarConf.build.extendViteConf === 'function') {
    const overrides = await quasarConf.build.extendViteConf(viteConf, opts)
    if (Object(overrides) === overrides) {
      viteConf = mergeConfig(viteConf, overrides)
    }
  }

  await quasarConf.ctx.appExt.runAppExtensionHook(
    'extendViteConf',
    async hook => {
      hook.api.logger.log(`Extending Vite config`)
      const overrides = await hook.fn(viteConf, opts, hook.api)
      if (Object(overrides) === overrides) {
        viteConf = mergeConfig(viteConf, overrides)
      }
    }
  )

  return viteConf
}

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export function createNodeRolldownConfig(
  quasarConf,
  { format, shippedToClient }
) {
  return {
    platform: 'node',
    tsconfig: false,

    output: {
      format,
      codeSplitting: false,
      minify: quasarConf.build.minify,
      sourcemap: quasarConf.build.sourcemap,
      cleanDir: false
    },

    resolve: {
      alias: {
        ...quasarConf.build.alias
      },
      extensions:
        format === 'esm'
          ? ['.js', '.ts', '.json', '.jsx', '.tsx']
          : ['.cjs', '.js', '.ts', '.json', '.jsx', '.tsx']
    },

    /**
     * Required for Windows host, otherwise Node.js will complain
     * about importing with absolute paths and will fail with
     * ESM error ("ERR_UNSUPPORTED_ESM_URL_SCHEME"):
     */
    makeAbsoluteExternalsRelative: true,
    external: quasarConf.ctx.dev ? [/node_modules/] : [],

    transform: {
      target: quasarConf.build.target.node,
      define: {
        ...quasarConf.metaConf[
          shippedToClient ? 'clientEnvDefineList' : 'backendEnvDefineList'
        ],
        ...quasarConf.build.define
      }
    }
  }
}

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export function createBrowserRolldownConfig(quasarConf, { shippedToClient }) {
  const { browser } = quasarConf.build.target
  const target =
    browser === BASELINE_WIDELY_AVAILABLE_TARGET_STRING
      ? [...BASELINE_WIDELY_AVAILABLE]
      : structuredClone(browser)

  return {
    platform: 'browser',
    tsconfig: false,

    output: {
      format: 'iife',
      codeSplitting: false,
      minify: quasarConf.build.minify,
      sourcemap: quasarConf.build.sourcemap,
      cleanDir: false
    },

    resolve: {
      alias: {
        ...quasarConf.build.alias
      }
    },

    transform: {
      target,
      define: {
        ...quasarConf.metaConf[
          shippedToClient ? 'clientEnvDefineList' : 'backendEnvDefineList'
        ],
        ...quasarConf.build.define
      }
    },

    plugins: []
  }
}

export async function extendRolldownConfig(
  rolldownConfig,
  quasarConfTarget,
  ctx,
  methodName
) {
  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[methodName] === 'function') {
    const overrides = await quasarConfTarget[methodName](rolldownConfig)
    if (Object(overrides) === overrides) {
      rolldownConfig = merge({}, rolldownConfig, overrides)
    }
  }

  await ctx.appExt.runAppExtensionHook(methodName, async hook => {
    hook.api.logger.log(`Running "${methodName}(rolldownConfig)"`)
    const overrides = await hook.fn(rolldownConfig, hook.api)
    if (Object(overrides) === overrides) {
      rolldownConfig = merge({}, rolldownConfig, overrides)
    }
  })

  /**
   * Avoid "import.meta.env is not defined"
   * as this is not available in Node.js.
   *
   * Should be the last statement in "define",
   * otherwise it will override all previous statements.
   */
  rolldownConfig.transform.define['import.meta.env'] = '{}'

  return rolldownConfig
}
