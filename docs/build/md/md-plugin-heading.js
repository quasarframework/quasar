/**
 * Manages headings
 */

import { slugify } from '../utils.js'

const titleRE = /<\/?[^>]+(>|$)/g
const apiRE = /^<DocApi /
const apiNameRE = /file="([^"]+)"/
const installationRE = /^<DocInstallation(?:\s+title="([^"]*)")?\s*/

function parseContent (str) {
  const title = String(str)
    .replace(titleRE, '')
    .trim()

  return {
    id: slugify(title),
    title
  }
}

export default function mdPluginHeading (md) {
  md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
    const token = tokens[ idx ]

    const content = tokens[ idx + 1 ]
      .children
      .reduce((acc, t) => acc + t.content, '')

    const { id, title } = parseContent(content)

    token.attrSet('id', id)
    token.attrSet('class', `doc-heading doc-${token.tag}`)
    token.attrSet('@click', `copyHeading(\`${id}\`)`)

    if (token.tag === 'h2') {
      md.$frontMatter.toc.push({ id, title })
    }
    else if (token.tag === 'h3') {
      md.$frontMatter.toc.push({ id, title, sub: true })
    }

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.html_block = function (tokens, idx /*, options, env */) {
    const token = tokens[ idx ]

    if (apiRE.test(token.content) === true) {
      const match = apiNameRE.exec(token.content)
      if (match !== null) {
        const title = `${ match[ 1 ] } API`
        md.$frontMatter.toc.push({ id: slugify(title), title, deep: true })
      }
    }

    const match = token.content.match(installationRE)
    if (match !== null) {
      const title = match[ 1 ] ?? 'Installation'
      md.$frontMatter.toc.push({ id: slugify(title), title, deep: true })
    }

    return tokens[ idx ].content
  }
}
