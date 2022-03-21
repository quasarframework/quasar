
const mdParse = require('./md-parse')
const mdRE = /.md$/

module.exports = {
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
