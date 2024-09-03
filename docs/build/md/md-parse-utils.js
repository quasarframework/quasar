import matter from 'gray-matter'
import toml from 'toml'

function parseToc (toc) {
  let wasHeader = true // Introduction is auto prepended
  let headerIndex = 1 // Introduction is auto prepended
  let subheaderIndex

  const list = toc.map(entry => {
    if (entry.sub === true) {
      if (wasHeader === true) { subheaderIndex = 1 }
      else { subheaderIndex++ }

      wasHeader = false
    }
    else {
      wasHeader = true
      headerIndex++
    }

    return {
      ...entry,
      title: entry.sub === true
        ? `${ headerIndex }.${ subheaderIndex }. ${ entry.title }`
        : `${ headerIndex }. ${ entry.title }`
    }
  })

  return JSON.stringify(list)
}

export function getVueComponent ({ frontMatter, mdContent, pageScripts }) {
  return `<template>
  <doc-page
    title="${ frontMatter.title }"
    ${ frontMatter.desc !== void 0 ? `desc="${ frontMatter.desc }"` : '' }
    ${ frontMatter.overline !== void 0 ? `overline="${ frontMatter.overline }"` : '' }
    ${ frontMatter.badge !== void 0 ? `badge="${ frontMatter.badge }"` : '' }
    ${ frontMatter.heading !== false ? 'heading' : '' }
    ${ frontMatter.editLink !== false ? `edit-link="${ frontMatter.editLink }"` : '' }
    ${ frontMatter.toc.length !== 0 ? ':toc="toc"' : '' }
    ${ frontMatter.related !== void 0 ? ':related="related"' : '' }
    ${ frontMatter.nav !== void 0 ? ':nav="nav"' : '' }>${ mdContent }</doc-page>
</template>
<script setup>
import { copyHeading } from 'assets/page-utils'
${ frontMatter.examples !== void 0 ? `
import { provide } from 'vue'
provide('_q_ex', process.env.CLIENT
  ? { name: '${ frontMatter.examples }', list: import('examples:${ frontMatter.examples }') }
  : { name: '${ frontMatter.examples }' })
` : '' }
${ frontMatter.related !== void 0 ? `const related = ${ JSON.stringify(frontMatter.related) }` : '' }
${ frontMatter.nav !== void 0 ? `const nav = ${ JSON.stringify(frontMatter.nav) }` : '' }
${ frontMatter.toc.length !== 0 ? `const toc = ${ parseToc(frontMatter.toc) }` : '' }
${ frontMatter.scope !== void 0 ? `const scope = ${ JSON.stringify(frontMatter.scope) }` : '' }
${ pageScripts }
</script>`
}

export function parseFrontMatter (content) {
  return matter(content, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
      excerpt: false
    }
  })
}
