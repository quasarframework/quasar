/**
 * Manages headings
 */

const { slugify } = require('./utils')

const titleRE = /<\/?[^>]+(>|$)/g

function parseContent (str) {
  const title = String(str)
    .replace(titleRE, '')
    .trim()

  return {
    id: slugify(title),
    title
  }
}

module.exports = function (md) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const content = tokens[idx + 1]
      .children
      .reduce((acc, t) => acc + t.content, '')

    const { id, title } = parseContent(content)

    token.attrSet('id', id)
    token.attrSet('class', `doc-heading doc-${token.tag}`)
    token.attrSet('@click', `copyHeading(\`${id}\`)`)

    if (token.tag === 'h2') {
      md.$data.toc.push(`{id:\`${id}\`,title:\`${title}\`}`)
    }
    else if (token.tag === 'h3') {
      md.$data.toc.push(`{id:\`${id}\`,title:\`${title}\`, sub: true}`)
    }

    return self.renderToken(tokens, idx, options)
  }
}
