import mdParse from './md-parse.js'

const mdRE = /.md$/

export default {
  name: 'quasar-docs:md',
  enforce: 'pre',

  transform (code, id) {
    if (mdRE.test(id) === false) return

    try {
      return mdParse(code, id)
    }
    catch (err) {
      this.error(err)
    }
  }
}
