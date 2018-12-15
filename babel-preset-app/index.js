const path = require('path')

module.exports = (context, opts) => {
  const presetEnvOptions = {
    modules: false,
    loose: false,
    useBuiltIns: 'usage'
  }

  if (opts.presetEnvOptions !== void 0) {
    Object.assign(presetEnv, opts.presetEnvOptions)
  }

  const presets = [
    [ require('@babel/preset-env'), presetEnvOptions ]
  ]

  const plugins = [
    // Stage 2
    [
      require('@babel/plugin-proposal-decorators'), {
        legacy: true
      }
    ],
    require('@babel/plugin-proposal-function-sent'),
    require('@babel/plugin-proposal-export-namespace-from'),
    require('@babel/plugin-proposal-numeric-separator'),
    require('@babel/plugin-proposal-throw-expressions'),

    // Stage 3
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-syntax-import-meta'),
    [
      require('@babel/plugin-proposal-class-properties'), {
        loose: false
      }
    ],
    require('@babel/plugin-proposal-json-strings'),

    // transform runtime, but only for helpers
    [
      require('@babel/plugin-transform-runtime'), {
        regenerator: presetEnvOptions.useBuiltIns !== 'usage',
        corejs: presetEnvOptions.useBuiltIns !== false ? false : 2,
        helpers: presetEnvOptions.useBuiltIns === 'usage',
        absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
      }
    ]
  ]

  return {
    presets,
    plugins
  }
}
