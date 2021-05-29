const matter = require('gray-matter')
const toml = require('toml')

function getComponentsImport (comp) {
  return comp.map(c => {
    const parts = c.split('/')
    return `import ${parts[ parts.length - 1 ]} from 'components/page-parts/${c}.vue'\n`
  }).join('')
}

function getComponentsDeclaration (comp) {
  const list = comp.map(c => {
    const parts = c.split('/')
    return parts[ parts.length - 1 ]
  }).join(',')

  return `components: { ${list} },`
}

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
<template>
  <doc-page :meta-title="metaTitle" title="${data.heading !== false ? data.title : ''}"${data.related !== void 0 ? ` :related="related"` : ''}${data.nav !== void 0 ? ` :nav="nav"` : ''}${data.badge !== void 0 ? ` :badge="badge"` : ''}${data.related !== void 0 || data.nav !== void 0 ? ` :toc="toc"` : ''}${data.desc !== void 0 ? ' :meta-desc="metaDesc"' : ''}>${rendered}</doc-page>
</template>
<script>
import { copyHeading } from 'assets/page-utils'
${data.components !== void 0 ? getComponentsImport(data.components) : ''}
export default {
  name: 'DocMarkdownPage',
  ${data.components !== void 0 ? getComponentsDeclaration(data.components) : ''}
  setup () {
    return {
      metaTitle: ${JSON.stringify(data.title)},
      ${data.desc !== void 0 ? `metaDesc: ${JSON.stringify(data.desc)},` : ''}
      ${data.related !== void 0 ? `related: ${JSON.stringify(data.related)},` : ''}
      ${data.nav !== void 0 ? `nav: ${JSON.stringify(data.nav)},` : ''}
      ${data.badge !== void 0 ? `badge: ${JSON.stringify(data.badge)},` : ''}
      ${data.related !== void 0 || data.nav !== void 0 ? `toc: ${toc},` : ''}
      copyHeading
    }
  }
}
</script>`
}

module.exports.parseFrontMatter = function (content) {
  return matter(content, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
      excerpt: false
    }
  })
}
