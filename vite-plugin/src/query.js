
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
export function parseViteRequest (id) {
  const [ filename, rawQuery ] = id.split('?', 2)
  const query = Object.fromEntries(new URLSearchParams(rawQuery))

  return query.raw !== void 0
    ? {
        // if it's a ?raw request, then don't touch it at all
        vue: () => false,
        template: () => false,
        script: () => false,
        style: () => false
      }
    : (
        query.vue !== void 0 // is vue query?
          ? {
              template: () => (
                query.type === void 0
                || query.type === 'template'
                // On prod, TS code turns into a separate 'script' request.
                // See: https://github.com/vitejs/vite/pull/7909
                || (query.type === 'script' && (query[ 'lang.ts' ] !== void 0 || query[ 'lang.tsx' ] !== void 0))
              ),

              script: ext => (
                (query.type === void 0 || query.type === 'script')
                && ext.list.some(x => query[ `lang.${ x }` ] !== void 0) === true
              ),

              style: ext => (
                query.type === 'style'
                && ext.list.some(x => query[ `lang.${ x }` ] !== void 0) === true
              )
            }
          : {
              template: ext => ext.regex.test(filename),
              script: ext => ext.regex.test(filename),
              style: ext => ext.regex.test(filename)
            }
      )
}

export function createExtMatcher (extList) {
  return {
    list: extList,
    regex: new RegExp(`\\.(${ extList.join('|') })$`)
  }
}
