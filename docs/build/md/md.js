const markdownIt = require('markdown-it')

const opts = {
  html: true,
  linkify: false,
  typographer: true,
  highlight: require('./highlight')
}

const md = markdownIt(opts)
  .use(require('./md-plugin-link'))
  .use(require('./md-plugin-token'))
  .use(require('./md-plugin-blockquote'))
  .use(require('./md-plugin-heading'))
  .use(require('./md-plugin-image'))
  .use(require('./md-plugin-containers'))
  .use(require('./md-plugin-table'))

md.$data = {}

module.exports = md
