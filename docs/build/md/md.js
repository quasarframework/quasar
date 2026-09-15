import markdownIt from 'markdown-it'

import { sharedMdOptions } from './md-rules.js'

import mdPluginLink from './md-plugin-link.js'
import mdPluginToken from './md-plugin-token.js'
import mdPluginBlockquote from './md-plugin-blockquote.js'
import mdPluginHeading from './md-plugin-heading.js'
import mdPluginImage from './md-plugin-image.js'
import mdPluginTable from './md-plugin-table.js'
import mdPluginCodeblock from './md-plugin-codeblock.js'

const md = markdownIt(sharedMdOptions)
  .use(mdPluginLink)
  .use(mdPluginToken)
  .use(mdPluginHeading)
  .use(mdPluginImage)
  .use(mdPluginTable)
  .use(mdPluginCodeblock)
  .use(mdPluginBlockquote)

md.$frontMatter = {}

export default md
