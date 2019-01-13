const markdownIt = require('markdown-it')

const
  mdPluginLink = require('./md-plugin-link'),
  mdPluginToken = require('./md-plugin-token'),
  mdPluginBlockquote = require('./md-plugin-blockquote'),
  mdPluginHeading = require('./md-plugin-heading'),
  mdPluginContainers = require('./md-plugin-containers'),
  mdPluginTable = require('./md-plugin-table')

const
  highlight = require('./highlight')

const opts = {
  html: true,
  linkify: false,
  typographer: true,
  highlight
}

const md = markdownIt(opts)
  .use(mdPluginLink)
  .use(mdPluginToken)
  .use(mdPluginBlockquote)
  .use(mdPluginHeading)
  .use(mdPluginContainers)
  .use(mdPluginTable)

md.$data = {}

module.exports = md
