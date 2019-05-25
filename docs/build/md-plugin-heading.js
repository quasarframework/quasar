/**
 * Manages headings
 */

function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

module.exports = function (md) {
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const title = tokens[idx + 1]
      .children
      .reduce((acc, t) => acc + t.content, '')

    const id = slugify(title)
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
