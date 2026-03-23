import markdownIt from 'markdown-it'

import highlight from './highlight.js'
import mdPluginContainers from '../md/md-plugin-containers.js'
import mdToken from '../md/md-plugin-token.js'
import mdBlockquote from '../md/md-plugin-blockquote.js'

const opts = {
  html: true,
  linkify: false,
  typographer: true,
  highlight
}

function mdPlugins(md) {
  mdToken(md)

  // link
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    token.attrSet('target', '__blank')
    token.attrSet('class', 'doc-link')
    return self.renderToken(tokens, idx, options)
  }

  mdPluginContainers(md)
  mdBlockquote(md)
}

export default markdownIt(opts).use(mdPlugins)
