// Inspired by @vue/babel-preset-app

const path = require('path')

const {
  default: getTargets,
  isRequired
} = require('@babel/helper-compilation-targets')

function getPolyfills (targets, userPolyfills = []) {
  // if no targets specified, include all default polyfills
  if (!userPolyfills.length || !targets || !Object.keys(targets).length) {
    return userPolyfills
  }

  const compatData = require('core-js-compat').data
  return userPolyfills.filter(item => isRequired(item, targets, { compatData }))
}

module.exports = (_, opts = {}) => {
  const presets = []
  const plugins = []

  const runtimePath = path.dirname(require.resolve('@babel/runtime/package.json'))
  const runtimeVersion = require('@babel/runtime/package.json').version

  const {
    polyfills: userPolyfills,
    loose = false,
    debug = false,
    useBuiltIns = 'usage',
    modules = false,
    bugfixes = true,
    targets: rawTargets,
    spec,
    include,
    exclude,
    shippedProposals,
    forceAllTransforms,
    decoratorsBeforeExport,
    decoratorsLegacy,

    // Undocumented option of @babel/plugin-transform-runtime.
    // When enabled, an absolute path is used when importing a runtime helper after transforming.
    // This ensures the transpiled file always use the runtime version required in this package.
    // However, this may cause hash inconsistency if the project is moved to another directory.
    // So here we allow user to explicit disable this option if hash consistency is a requirement
    // and the runtime version is sure to be correct.
    absoluteRuntime = runtimePath,

    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#version
    // By default transform-runtime assumes that @babel/runtime@7.0.0-beta.0 is installed, which means helpers introduced later than 7.0.0-beta.0 will be inlined instead of imported.
    // See https://github.com/babel/babel/issues/10261
    // And https://github.com/facebook/docusaurus/pull/2111
    version = runtimeVersion
  } = opts

  let targets = getTargets(rawTargets)
  let polyfills = []

  if (useBuiltIns === 'usage') {
    polyfills = getPolyfills(targets, userPolyfills)

    if (polyfills.length > 0) {
      plugins.push([
        require('./polyfills'),
        { polyfills, useAbsolutePath: !!absoluteRuntime }
      ])
    }
  }

  const envOptions = {
    bugfixes,
    corejs: useBuiltIns ? require('core-js/package.json').version : false,
    spec,
    loose,
    debug,
    modules,
    targets,
    useBuiltIns,
    include,
    exclude: polyfills.concat(exclude || []),
    shippedProposals,
    forceAllTransforms
  }

  // pass options along to babel-preset-env
  presets.unshift([ require('@babel/preset-env'), envOptions ])

  plugins.push(
    // Stage 2
    [
      require('@babel/plugin-proposal-decorators'), {
        decoratorsBeforeExport,
        legacy: decoratorsLegacy !== false
      }
    ],
    [
      require('@babel/plugin-proposal-class-properties'), {
        loose
      }
    ],
    require('@babel/plugin-proposal-function-sent'),
    require('@babel/plugin-proposal-export-namespace-from'),
    require('@babel/plugin-proposal-numeric-separator'),
    require('@babel/plugin-proposal-throw-expressions'),

    // Stage 3
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-syntax-import-meta'),
    require('@babel/plugin-proposal-json-strings'),

    // Transform runtime, but only for helpers
    [
      require('@babel/plugin-transform-runtime'), {
        regenerator: useBuiltIns !== 'usage',

        // polyfills are injected by preset-env & polyfillsPlugin, so no need to add them again
        corejs: false,

        helpers: useBuiltIns === 'usage',
        useESModules: false,

        absoluteRuntime,

        version
      }
    ]
  )

  return {
    sourceType: 'unambiguous',
    overrides: [{
      exclude: [ /@babel[\/|\\\\]runtime/, /core-js/ ],
      presets,
      plugins
    }, {
      // there are some untranspiled code in @babel/runtime
      // https://github.com/babel/babel/issues/9903
      include: [ /@babel[\/|\\\\]runtime/ ],
      presets: [
        [ require('@babel/preset-env'), envOptions ]
      ]
    }]
  }
}
