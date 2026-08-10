import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // SFC support for the component render tests (node-side SSR
  // rendering through test/render.js — no browser needed)
  plugins: [vue()],

  resolve: {
    // the quasar app's "@" alias, for src modules under test
    alias: { '@': join(import.meta.dirname, 'src') }
  },

  test: {
    globalSetup: './vitest.global-setup.js',
    include: ['build/**/*.test.js', 'src/**/*.test.js']
  }
})
