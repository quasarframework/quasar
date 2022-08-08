/**
 * @typedef {{
 *  vue: () => boolean;
 *  template: () => boolean;
 *  script: (extensions?: string | string[]) => boolean;
 *  style: (extensions?: string | string[]) => boolean;
 * }} ViteQueryIs
 */

/**
 * @see https://github.com/vitejs/vite/blob/364aae13f0826169e8b1c5db41ac6b5bb2756958/packages/plugin-vue/src/utils/query.ts - source of inspiration
 * @example
 * '/absolute/path/src/App.vue' // Can contain combined template&script -> template: true, script: true, style: false
 * '/absolute/path/src/App.vue?vue&type=script&lang.js' // Only contains script -> template: false, script: true, style: false
 * '/absolute/path/src/App.vue?vue&type=style&lang.sass' // Only contains style -> template: false, script: false, style: true
 * '/absolute/path/src/script.js' // Only contains script -> template: false, script: true, style: false
 * '/absolute/path/src/index.scss' // Only contains style -> template: false, script: false, style: true
 *
 * @param {string} id
 * @returns {{ filename: string; query: { [key: string]: string; }; is: ViteQueryIs }}
 */
export function parseViteRequest(id) {
  const [filename, rawQuery] = id.split('?', 2)
  const query = Object.fromEntries(new URLSearchParams(rawQuery))

  const isVueQuery = query.vue !== void 0

  return {
    filename,
    query,

    is: {
      vue: () => isVueQuery || isOfExt({ extensions: '.vue', filename }),
      template: () =>
        isVueQuery
          ? query.type === void 0 || query.type === 'template'
          : isOfExt({ filename, extensions: '.vue' }),
      script: (extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']) =>
        isVueQuery
          ? (query.type === void 0 || query.type === 'script') &&
            isOfExt({ query, extensions })
          : isOfExt({ filename, extensions }),
      style: (extensions = ['.css', '.scss', '.sass']) =>
        isVueQuery
          ? query.type === 'style' && isOfExt({ query, extensions })
          : isOfExt({ filename, extensions }),
    },
  }
}

function isOfExt({ extensions, filename, query }) {
  extensions = Array.isArray(extensions) ? extensions : [extensions]

  return extensions.some(
    (ext) => filename?.endsWith(ext) || query?.[`lang${ext}`] !== void 0
  )
}
