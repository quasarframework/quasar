import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { playwright } from '@vitest/browser-playwright'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

function getReporterConfig() {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

export default defineConfig(() => ({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      devTreeshaking: true,
      sassVariables: false,
      autoImportComponentCase: 'combined'
    })
  ],

  resolve: {
    alias: {
      testing: resolve('.'),
      quasar: resolve('..')
    }
  },

  test: {
    ...getReporterConfig(),
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      pretendToBeVisual: true
    },
    // browser: {
    //   provider: playwright(),
    //   enabled: true,
    //   headless: true,
    //   // at least one instance is required
    //   instances: [{ browser: 'chromium' }]
    // },
    css: {
      include: [/.+/]
    },
    include: ['../src/**/*.test.js'],
    setupFiles: ['./vitest.setup.js']
  }
}))
