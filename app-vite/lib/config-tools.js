import { join } from 'node:path'
import { quasar as quasarVitePlugin } from '@quasar/vite-plugin'
import vueVitePlugin from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import { merge } from 'webpack-merge'

import { getPackage } from './utils/get-package.js'
import { isModeInstalled } from './modes/modes-utils.js'
import { tip, warn } from './utils/logger.js'
import {
  BASELINE_WIDELY_AVAILABLE,
  BASELINE_WIDELY_AVAILABLE_TARGET_STRING
} from './utils/build-targets.js'

import { quasarViteIndexHtmlTransformPlugin } from './plugins/vite.html.js'
import { quasarViteStripFilenameHashesPlugin } from './plugins/vite.strip-filename-hashes.js'

const compileIdToRunModeMap = {
  'vite-ssr-client': 'ssr-client',
  'vite-ssr-server': 'ssr-server',
  'vite-ssg-client': 'ssr-client',
  'vite-ssg-server': 'ssr-server'
}

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

    if (compileId === 'vite-ssr-server' || compileId === 'vite-ssg-server') {
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

/**
 * Deps installed in a /src-<modeName> folder instead of the app root
 * would otherwise not be resolvable by Vite from /src code.
 *
 * Capacitor deps are aliased in EVERY mode (not just Capacitor mode):
 * Capacitor plugins ship web implementations, so shared /src code may
 * import them guarded by import.meta.env.QUASAR_CAPACITOR_MODE (the
 * guarded branch is dead-code eliminated in production builds). #17681
 * The types-generator mirrors this by adding these deps to
 * compilerOptions.paths whenever Capacitor mode is installed.
 *
 * Exported for testing purposes.
 */
export function getModeDepsAliases(appPaths, pkg, modeDeps) {
  const acc = {}

  const injectDeps = ({ dir, deps }) => {
    if (!deps) return

    // dir is of type: "src-<modeName>", example: "src-pwa"
    const target = appPaths.resolve.app(`${dir}/node_modules`)

    Object.keys(deps).forEach(depName => {
      acc[depName] = join(target, depName)
    })
  }

  if (isModeInstalled(appPaths, 'capacitor')) {
    injectDeps({ dir: 'src-capacitor', deps: pkg.capacitorPkg.dependencies })
  }

  // specified last so that a mode's own deps win on any name clash
  modeDeps?.forEach(injectDeps)

  return acc
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
    compileId === 'vite-ssr-server' || compileId === 'vite-ssg-server'
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

    /**
     * Important! Avoid Vite looking for .env files and loading them,
     * since we already handle them ourselves. But the main problem is that
     * it forces client reloads before our server is ready to react,
     * or even mid server rebuild, which causes browser refresh with page
     * unavailable and errors and is not a good DX.
     */
    envDir: false,

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

    // when JSX/TSX is enabled, tell Oxc which JSX runtime to compile to
    // (Vue's, not the React default); the generated .quasar/tsconfig.json
    // is kept in sync by types-generator.js
    ...(build.vueJsx ? { oxc: { jsx: build.vueJsx } } : {}),

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
        compileId === 'vite-ssr-server' || compileId === 'vite-ssg-server'
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
      ...quasarVitePlugin({
        runMode: compileIdToRunModeMap[compileId] || 'web-client',
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

  if (compileId !== 'vite-ssr-server' && compileId !== 'vite-ssg-server') {
    viteConf.plugins.unshift(quasarViteIndexHtmlTransformPlugin(quasarConf))

    if (ctx.prod && quasarConf.build.useFilenameHashes !== true) {
      viteConf.plugins.push(quasarViteStripFilenameHashesPlugin())
    }
  }

  if (ctx.dev) {
    if (compileId !== 'vite-ssr-server' && compileId !== 'vite-ssg-server') {
      if (quasarConf.metaConf.vueDevtoolsOptions) {
        const vitePluginVueDevtools =
          await ctx.cacheProxy.getModule('vueDevtools')

        viteConf.plugins.push(
          vitePluginVueDevtools({
            // protect against the Vite plugin mutating its own options
            // and triggering endless cfg diff loop
            ...quasarConf.metaConf.vueDevtoolsOptions
          })
        )
      }

      // also protects against Vite (or a Vite plugin) mutating the original
      // and triggering endless cfg diff loop
      viteConf.server = merge(
        {
          warmup: {
            clientFiles: [quasarConf.metaConf.entryScript.absolutePath]
          }
        },
        quasarConf.devServer
      )
    } else {
      // protect against Vite (or a Vite plugin) mutating the original
      // and triggering endless cfg diff loop
      viteConf.server = merge({}, quasarConf.devServer)
    }
  } else {
    viteConf.build.outDir = build.distDir
  }

  Object.assign(
    viteConf.resolve.alias,
    getModeDepsAliases(appPaths, ctx.pkg, modeDeps)
  )

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
      // same JSX/TSX handling as the Vite pipeline (see createViteConfig),
      // for the browser-targeted scripts built by Rolldown alone
      // (BEX scripts, the custom PWA service worker)
      ...(quasarConf.build.vueJsx ? { jsx: quasarConf.build.vueJsx } : {}),
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
