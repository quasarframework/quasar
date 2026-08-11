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
    }
  }
}
