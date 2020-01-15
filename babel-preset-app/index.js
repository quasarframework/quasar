const path = require('path')

module.exports = (_, opts) => {
  const presetEnv = {
    modules: false,
    loose: false,
    useBuiltIns: 'usage',
    corejs: 2
  }

  if (opts !== void 0 && opts.presetEnv !== void 0) {
    Object.assign(presetEnv, opts.presetEnv)
  }

  if (presetEnv.corejs !== 2 && presetEnv.corejs !== 3 && presetEnv.corejs !== false) {
    console.log()
    console.error(`[error] @quasar/babel-preset-app: invalid value for presetEnv > corejs: ${presetEnv.corejs}`)
    console.log()
    process.exit(1)
  }

  const pluginTransformRuntime = {
    regenerator: true,
    corejs: false, // included by preset, no need to do it again
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

  // Use @babel/runtime-corejs2 so that helpers will reference existing core-js.
  // Not using @babel/runtime-corejs3 that would just duplicate code with core-js-pure.
  if (presetEnv.corejs == 2 && presetEnv.useBuiltIns === 'usage') {
    plugins.push([
      require('babel-plugin-module-resolver'), {
        alias: {
          '@babel/runtime': '@babel/runtime-corejs' + presetEnv.corejs,
          [pluginTransformRuntime.absoluteRuntime]: path.dirname(
            require.resolve('@babel/runtime-corejs'  + presetEnv.corejs + '/package.json')
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
