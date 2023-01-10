const markdownIt = require('markdown-it')

const highlight = require('../md/highlight')
const mdPluginContainers = require('../md/md-plugin-containers')
const mdToken = require('../md/md-plugin-token')
const mdBlockquote = require('../md/md-plugin-blockquote')

const opts = {
  html: true,
  linkify: false,
  typographer: true,
  highlight
}

function mdPlugins (md) {
  // link
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]
    token.attrSet('target', '__blank')
    token.attrSet('class', 'doc-link')
    return self.renderToken(tokens, idx, options)
  }

  // headings
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[ idx ]
    token.attrSet('class', `doc-heading doc-${token.tag}`)
    return self.renderToken(tokens, idx, options)
  }

  mdPluginContainers(md)
  mdToken(md)
  mdBlockquote(md)
}

module.exports = markdownIt(opts).use(mdPlugins)
