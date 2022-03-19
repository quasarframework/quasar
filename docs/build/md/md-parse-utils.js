const matter = require('gray-matter')
const toml = require('toml')

function getComponentsImport (componentList) {
  return componentList.map(c => {
    const parts = c.split('/')
    return `import ${parts[ parts.length - 1 ]} from 'components/page-parts/${c}.vue'\n`
  }).join('')
}

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
<template>
  <doc-page
    meta-title="${data.title}"
    title="${data.heading !== false ? data.title : ''}"
    ${data.overline !== void 0 ? `overline="${data.overline}"` : ''}
    ${data.badge !== void 0 ? `badge="${data.badge}"` : ''}
    ${data.related !== void 0 ? ':related="related"' : ''}
    ${data.nav !== void 0 ? ':nav="nav"' : ''}
    ${data.related !== void 0 || data.nav !== void 0 ? ':toc="toc"' : ''}
    ${data.desc !== void 0 ? `meta-desc="${data.desc}"` : ''}>${rendered}</doc-page>
</template>
<script setup>
import { copyHeading } from 'assets/page-utils'
${data.components.length !== 0 ? getComponentsImport(data.components) : ''}
${data.related !== void 0 ? `const related = ${JSON.stringify(data.related)}` : ''}
${data.nav !== void 0 ? `const nav = ${JSON.stringify(data.nav)}` : ''}
${data.related !== void 0 || data.nav !== void 0 ? `const toc = ${toc}` : ''}
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
