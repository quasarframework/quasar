var
  testsContext,
  srcContext,
  scope = typeof window === 'undefined'
    ? global
    : window

// shim process
scope.process = {
  env: {
    NODE_ENV: 'development'
  }
}

// require all test files
testsContext = require.context('.', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except app.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
srcContext = require.context('../../src', true, /\.(js|vue)$/)
srcContext.keys().forEach(srcContext)
