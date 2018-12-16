/* eslint-disable */

module.exports =
  {
    'globals': {
      '__DEV__': true
    },
    'verbose': true,
    'testURL': 'http://localhost/',
    'testEnvironment': 'jsdom',
    'collectCoverage': false,
    'collectCoverageFrom': [
      '<rootDir>/src/**/*.{js}'
    ],
    'coverageDirectory': '<rootDir>/__test__/coverage',
    'coverageThreshold': {
      'global': {
        'branches': 0,
        'functions': 0,
        'lines': 0,
        'statements': 0
      }
    },
    'testMatch': [
      '<rootDir>/__test__/**/?(*.)(spec).js?(x)',
      '<rootDir>/__test__/**/?(*.)(test).js?(x)'
    ],
    'testPathIgnorePatterns': [
      '<rootDir>/dist/',
      '<rootDir>/node_modules/'
    ],
    "moduleDirectories": [
      "node_modules"
    ],
    'moduleFileExtensions': [
      'js',
      'json',
      'vue'
    ],
    'moduleNameMapper': {
      '@components/([^\\.]*)$': '<rootDir>/src/components.js',
      '^vue$': 'vue/dist/vue.common.js'
    },
    'resolver': null,
    'transformIgnorePatterns': [
      'node_modules/core-js',
      'node_modules/babel-runtime',
      'node_modules/lodash',
      'node_modules/vue'
    ],
    'transform': {
      '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
    },
    // 'snapshotSerializers': [
    //   '<rootDir>/node_modules/jest-serializer-vue'
    // ]
  }
