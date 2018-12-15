module.exports = () => {
  const presets = [
    [
      require('@babel/preset-env'), {
        modules: false,
        loose: false,
        useBuiltIns: 'usage'
      }
    ]
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
    require('@babel/plugin-proposal-json-strings'
  ]

  return {
    presets,
    plugins
  }
}
