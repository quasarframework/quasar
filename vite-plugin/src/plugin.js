import { normalizePath } from 'vite'

import { getViteConfig } from './vite-config.js'
import { vueTransform } from './vue-transform.js'
import { createQuasarNodeTransform } from './vue-ast-transform.js'
import {
  areVariablesDefinitionsOnly,
  createScssTransform
} from './scss-transform.js'
import { buildVariablesGraph } from './sass-variables-graph.js'
import { createExtMatcher, parseViteRequest } from './query.js'
import {
  hasResidualQuasarImports,
  loadQuasarImportMap,
  mapQuasarImports
} from './js-transform.js'

const defaultOptions = {
  runMode: 'web-client',
  sassVariables: true,
  devTreeshaking: false,
  astAutoImport: true,
  autoImportComponentCase: 'kebab',
  autoImportVueExtensions: ['vue'],
  autoImportScriptExtensions: ['js', 'jsx', 'ts', 'tsx']
}
const defaultOptionsKeys = Object.keys(defaultOptions)

const rawQueryRegex = /[?&]raw(?:&|$)/
const quasarCodeRegex = /_resolveComponent\(|_resolveDirective\(|['"]quasar['"]/

function parsePluginOptions(userOpts = {}) {
  const opts = { ...userOpts }

  for (const key of defaultOptionsKeys) {
    if (opts[key] === void 0) {
      opts[key] = defaultOptions[key]
    }
  }

  return opts
}

function getConfigPlugin(opts) {
  return {
    name: 'vite:quasar:vite-conf',

    configResolved(viteConf) {
      const vueCfg = viteConf.plugins.find(entry => entry.name === 'vite:vue')

      if (vueCfg === void 0) {
        throw new Error(
          '[Quasar] In your Vite config file, please add the Quasar plugin ** after ** the Vue one'
        )
      }
    },

    config(viteConf, { mode }) {
      return getViteConfig(opts.runMode, mode, viteConf, opts.sassVariables)
    }
  }
}

const scssMatcher = createExtMatcher(['scss', 'module.scss'])
const sassMatcher = createExtMatcher(['sass', 'module.sass'])

function getScssTransformsPlugin(opts) {
  const sassVariables =
    typeof opts.sassVariables === 'string'
      ? normalizePath(opts.sassVariables)
      : opts.sassVariables

  const canSkipInjection = areVariablesDefinitionsOnly(sassVariables)

  // targeted injection requires confidently parsed, declarations-only files
  const variablesGraph =
    canSkipInjection === true ? buildVariablesGraph(sassVariables) : null

  const scssTransform = createScssTransform(
    'scss',
    sassVariables,
    canSkipInjection,
    variablesGraph
  )
  const sassTransform = createScssTransform(
    'sass',
    sassVariables,
    canSkipInjection,
    variablesGraph
  )

  function transformHandler(src, id) {
    const is = parseViteRequest(id)

    if (is.style(scssMatcher)) {
      const code = scssTransform(src)
      return code === src ? null : { code, map: null }
    }

    if (is.style(sassMatcher)) {
      const code = sassTransform(src)
      return code === src ? null : { code, map: null }
    }

    return null
  }

  return {
    name: 'vite:quasar:scss',

    enforce: 'pre',

    transform: {
      filter: {
        id: {
          include: [/\.s[ac]ss(?:\?|$)/, /[?&]lang\.s[ac]ss(?:&|$)/],
          exclude: rawQueryRegex
        }
      },
      handler: transformHandler
    }
  }
}

function getScriptTransformsPlugin(opts) {
  let useTreeshaking = true
  let astAutoImportActive = false

  const vueMatcher = createExtMatcher(opts.autoImportVueExtensions)
  const scriptMatcher = createExtMatcher(opts.autoImportScriptExtensions)

  const warnedFiles = new Set()

  function warnResidualImports(ctx, code, id) {
    if (
      useTreeshaking === true &&
      warnedFiles.has(id) === false &&
      hasResidualQuasarImports(code) === true
    ) {
      warnedFiles.add(id)
      const msg =
        `[Quasar] "${id}" contains an import from "quasar" that could not be` +
        ' transformed into per-file imports, so the full Quasar bundle may' +
        ' end up in your build output'

      if (ctx !== void 0 && typeof ctx.warn === 'function') {
        ctx.warn(msg)
      } else {
        console.warn(msg)
      }
    }
  }

  function transformHandler(src, id) {
    // when hook filters are not available, this mirrors their fast bail out
    if (quasarCodeRegex.test(src) === false) {
      return null
    }

    const is = parseViteRequest(id)

    if (is.template(vueMatcher)) {
      // with the AST transform active, components and directives are
      // already resolved at template compile time; only user-written
      // "quasar" imports are left to map when treeshaking
      const code = astAutoImportActive
        ? useTreeshaking === true
          ? mapQuasarImports(src)
          : src
        : vueTransform(src, opts.autoImportComponentCase, useTreeshaking)

      warnResidualImports(this, code, id)

      return code === src
        ? null
        : {
            code,
            map: null // the transformations preserve line positions
          }
    }

    if (useTreeshaking && is.script(scriptMatcher)) {
      const code = mapQuasarImports(src)

      warnResidualImports(this, code, id)

      return {
        code,
        map: null // the transformations preserve line positions
      }
    }

    return null
  }

  return {
    name: 'vite:quasar:script',

    configResolved(resolvedConfig) {
      if (!opts.devTreeshaking && resolvedConfig.mode !== 'production') {
        useTreeshaking = false
      } else {
        loadQuasarImportMap()
      }

      if (opts.astAutoImport === true) {
        const vuePlugin = resolvedConfig.plugins?.find(
          entry => entry.name === 'vite:vue'
        )
        const vueOptions = vuePlugin?.api?.options

        // available on @vitejs/plugin-vue 4.2+; older versions
        // are handled by the regex-based vueTransform() fallback
        if (vueOptions !== void 0) {
          const template = (vueOptions.template ??= {})
          const compilerOptions = (template.compilerOptions ??= {})

          compilerOptions.nodeTransforms = [
            ...(compilerOptions.nodeTransforms || []),
            createQuasarNodeTransform(
              opts.autoImportComponentCase,
              useTreeshaking
            )
          ]

          astAutoImportActive = true
        }
      }
    },

    transform: {
      filter: {
        id: {
          include: [
            new RegExp(
              `\\.(?:${opts.autoImportVueExtensions.join('|')})(?:\\?|$)`
            ),
            new RegExp(
              `\\.(?:${opts.autoImportScriptExtensions.join('|')})(?:\\?|$)`
            )
          ],
          exclude: rawQueryRegex
        },
        code: quasarCodeRegex
      },
      handler: transformHandler
    }
  }
}

export default function quasarPlugin(userOpts) {
  const opts = parsePluginOptions(userOpts)

  const plugins = [getConfigPlugin(opts)]

  if (opts.sassVariables) {
    plugins.push(getScssTransformsPlugin(opts))
  }

  if (opts.runMode !== 'ssr-server') {
    plugins.push(getScriptTransformsPlugin(opts))
  }

  return plugins
}
