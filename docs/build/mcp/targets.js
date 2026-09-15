/**
 * The docs slices bundled into the published packages, for the MCP
 * server to serve offline. Each package gets the pages its users need
 * for the code that package ships; pages that belong to neither stay
 * site-only.
 *
 * An entry is a menu key prefix: a section root (`vue-components`)
 * covers every page under it, a full route (`start/umd`) covers that
 * page only.
 */

export const TARGETS = {
  ui: {
    packageName: 'quasar',
    packageDir: 'ui',
    routes: [
      'layout',
      'options',
      'quasar-plugins',
      'quasar-utils',
      'security/dos-and-donts',
      'start/ai-agents',
      'start/how-to-use-vue',
      'start/browser-support',
      'start/umd',
      'start/vite-plugin',
      'style',
      'vue-components',
      'vue-composables',
      'vue-directives'
    ]
  },
  'app-vite': {
    packageName: '@quasar/app-vite',
    packageDir: 'app-vite',
    routes: [
      'app-extensions',
      'icongenie',
      'quasar-cli-vite',
      'start/ai-agents',
      'start/quasar-cli'
    ]
  }
}

/**
 * @param {{ routes: string[] }} target
 * @param {string} key Menu key (no leading slash, no `.md`).
 * @returns {boolean}
 */
export function targetIncludes(target, key) {
  return target.routes.some(
    route => key === route || key.startsWith(`${route}/`)
  )
}
