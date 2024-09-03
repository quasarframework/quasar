import markdownIt from 'markdown-it'

import mdPluginLink from './md-plugin-link.js'
import mdPluginToken from './md-plugin-token.js'
import mdPluginBlockquote from './md-plugin-blockquote.js'
import mdPluginHeading from './md-plugin-heading.js'
import mdPluginImage from './md-plugin-image.js'
import mdPluginContainers from './md-plugin-containers.js'
import mdPluginTable from './md-plugin-table.js'
import mdPluginCodeblock from './md-plugin-codeblock.js'

const opts = {
  html: true,
  linkify: false,
  typographer: true
}

const md = markdownIt(opts)
  .use(mdPluginLink)
  .use(mdPluginToken)
  .use(mdPluginBlockquote)
  .use(mdPluginHeading)
  .use(mdPluginImage)
  .use(mdPluginContainers)
  .use(mdPluginTable)
  .use(mdPluginCodeblock)

md.$frontMatter = {}

export default md
