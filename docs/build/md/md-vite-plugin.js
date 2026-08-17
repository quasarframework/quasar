import mdParse from './md-parse.js'

const mdRE = /\.md$/

export function mdVitePlugin(isProd) {
  return {
    name: 'quasar:docs:md',
    enforce: 'pre',

    transform: {
      // rust-side filter: non-.md modules never cross into JS
      filter: { id: mdRE },

      handler(code, id) {
        try {
          return mdParse(code, id, isProd)
        } catch (err) {
          this.error(err)
        }
      }
    },

    /**
     * @vitejs/plugin-vue decides what to hot-update by parsing the file on
     * disk and diffing its SFC blocks against the ones it compiled last time.
     * A page is markdown on disk, so there are no blocks to find: from the
     * second save on, that diff reads "nothing changed" and the browser is
     * never told. The first save gets through only because nothing has been
     * cached to compare against yet.
     *
     * So hand it what this plugin actually compiles. `enforce: 'pre'` is what
     * puts this ahead of its hook, and the parse is for the comparison alone -
     * the transform above runs again right after, and that is the one that
     * reports the page's ids.
     */
    handleHotUpdate(ctx) {
      if (!mdRE.test(ctx.file)) return

      const read = ctx.read
      ctx.read = async () => mdParse(await read(), ctx.file, isProd, false)
    }
  }
}
