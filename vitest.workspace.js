// eslint-disable-next-line n/no-extraneous-import
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './vite-plugin/testing/usage/vitest.config.js',
  './vite-plugin/testing/runtime/vitest.config.js',
  './ui/testing/vitest.config.js'
])
