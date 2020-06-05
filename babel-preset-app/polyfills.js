const { addSideEffect } = require('@babel/helper-module-imports')

// slightly modifiled from @babel/preset-env/src/utils
// use an absolute path for core-js modules, to fix conflicts of different core-js versions
// TODO: remove the `useAbsolutePath` option in v5,
// because `core-js` is sure to be present in newer projects;
// we only need absolute path for babel runtime helpers, not for polyfills
function getModulePath (mod, useAbsolutePath) {
  const modPath =
    mod === 'regenerator-runtime'
      ? 'regenerator-runtime/runtime'
      : `core-js/modules/${mod}`
  return useAbsolutePath ? require.resolve(modPath) : modPath
}

// add polyfill imports to the first file encountered.
module.exports = ({}, { polyfills, useAbsolutePath }) => {
  return {
    name: 'quasar-cli-inject-polyfills',
    visitor: {
      Program (path) {
        // imports are injected in reverse order
        polyfills
          .slice()
          .reverse()
          .forEach(mod => {
            // create import
            addSideEffect(path, getModulePath(mod, useAbsolutePath))
          })
      }
    }
  }
}
