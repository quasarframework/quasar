// Root projects config for IDE integration (VS Code Vitest extension).
// E2e configs (vitest-e2e.config.js) and the vite-plugin runtime
// variants are intentionally excluded; run them via package scripts.
// Plain object (no defineConfig import): vitest is not installed at
// the workspace root, only in the packages.
export default {
  test: {
    projects: [
      './app-vite/vitest.config.js',
      './cli/vitest.config.js',
      './create-quasar/vitest.config.js',
      './docs/vitest.config.js',
      './ui/testing/vitest.config.js',

      // the vite-plugin configs resolve their include/setup paths
      // against /vite-plugin (their package scripts' cwd), so they
      // need their project root pinned there
      {
        extends: './vite-plugin/testing/usage/vitest.config.js',
        test: { name: 'vite-plugin-usage', root: './vite-plugin' }
      },
      {
        extends: './vite-plugin/testing/runtime/vitest.config.js',
        test: { name: 'vite-plugin-runtime', root: './vite-plugin' }
      }
    ]
  }
}
