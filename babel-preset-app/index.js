const path = require('path')

module.exports = (_, opts) => {
  const presetEnv = {
    modules: false,
    loose: false,
    useBuiltIns: 'usage',
    corejs: 3
  }

  if (opts !== void 0 && opts.presetEnv !== void 0) {
    Object.assign(presetEnv, opts.presetEnv)
  }

  const pluginTransformRuntime = {
    regenerator: true,
    corejs: presetEnv.useBuiltIns !== false ? false : 2,
    helpers: presetEnv.useBuiltIns === 'usage',
    absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
  }

  const pluginProposalDecorators = {
    legacy: true
  }

  const pluginProposalClassProperties = {
    loose: false
  }

  if (opts !== void 0) {
    if (opts.pluginTransformRuntime) {
      Object.assign(pluginTransformRuntime, opts.pluginTransformRuntime)
    }
    if (opts.pluginProposalDecorators) {
      Object.assign(pluginProposalDecorators, opts.pluginProposalDecorators)
    }
    if (opts.pluginProposalClassProperties) {
      Object.assign(pluginProposalClassProperties, opts.pluginProposalClassProperties)
    }
  }

  const presets = [
    [ require('@babel/preset-env'), presetEnv ]
  ]

  const plugins = [
    // Stage 2
    [
      require('@babel/plugin-proposal-decorators'),
      pluginProposalDecorators
    ],
    require('@babel/plugin-proposal-function-sent'),
    require('@babel/plugin-proposal-export-namespace-from'),
    require('@babel/plugin-proposal-numeric-separator'),
    require('@babel/plugin-proposal-throw-expressions'),

    // Stage 3
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-syntax-import-meta'),
    [
      require('@babel/plugin-proposal-class-properties'),
      pluginProposalClassProperties
    ],
    require('@babel/plugin-proposal-json-strings'),

    // transform runtime, but only for helpers
    [
      require('@babel/plugin-transform-runtime'),
      pluginTransformRuntime
    ]
  ]

  // use @babel/runtime-corejs3 so that helpers will reference core-js instead
  if (presetEnv.useBuiltIns === 'usage') {
    plugins.push([
      require('babel-plugin-module-resolver'), {
        alias: {
          '@babel/runtime': '@babel/runtime-corejs3',
          [pluginTransformRuntime.absoluteRuntime]: path.dirname(
            require.resolve('@babel/runtime-corejs3/package.json')
          )
        }
      }
    ])
  }

  return {
    presets,
    plugins
  }
}
