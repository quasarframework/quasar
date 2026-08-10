// Root projects config for IDE integration (VS Code Vitest extension).
// E2e configs (vitest-e2e.config.js, ui's vitest-e2e-ssr.config.js)
// and the vite-plugin runtime variants are intentionally excluded —
// they boot servers/registries; run them via package scripts.
// Plain object (no defineConfig import): vitest is not installed at
// the workspace root, only in the packages.
export default {
  test: {
    projects: [
      './app-vite/vitest.config.js',
      './cli/vitest.config.js',
      './create-quasar/vitest.config.js',
      './docs/vitest.config.js',
      './utils/*/vitest.config.js',

      // the ui and vite-plugin configs resolve their include/setup
      // paths against their package root (their scripts' cwd), so
      // they need their project root pinned there
      {
        extends: './ui/test/vitest.config.js',
        test: { name: 'ui', root: './ui' }
      },
      {
        extends: './ui/test/vitest.hydration.config.js',
        test: { name: 'ui-hydration', root: './ui' }
      },
      {
        extends: './ui/test/vitest.hydration-pwa.config.js',
        test: { name: 'ui-hydration-pwa', root: './ui' }
      },
      {
        extends: './vite-plugin/test/usage/vitest.config.js',
        test: { name: 'vite-plugin-usage', root: './vite-plugin' }
      },
      {
        extends: './vite-plugin/test/runtime/vitest.config.js',
        test: { name: 'vite-plugin-runtime', root: './vite-plugin' }
      }
    ]
  }
}
