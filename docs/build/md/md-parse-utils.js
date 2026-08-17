import matter from 'gray-matter'
import toml from 'toml'

function parseToc(toc) {
  let wasHeader = true // Introduction is auto prepended
  let headerIndex = 1 // Introduction is auto prepended
  let subheaderIndex

  const list = toc.map(entry => {
    if (entry.sub === true) {
      if (wasHeader) {
        subheaderIndex = 1
      } else {
        subheaderIndex++
      }

      wasHeader = false
    } else {
      wasHeader = true
      headerIndex++
    }

    return {
      ...entry,
      title:
        entry.sub === true
          ? `${headerIndex}.${subheaderIndex}. ${entry.title}`
          : `${headerIndex}. ${entry.title}`
    }
  })

  return JSON.stringify(list)
}

/**
 * A page's id collisions travel with the page in dev, so the author reading
 * it is told by the thing they are looking at rather than by the terminal
 * the dev server writes to. Never in a production build: the prop is not
 * emitted, so neither the banner nor the strings reach the bundle.
 */
export function getVueComponent({
  isProd,
  frontMatter,
  idIssues = [],
  mdContent,
  pageScripts
}) {
  const showIdIssues = isProd !== true && idIssues.length !== 0

  return `<template>
  <DocPage
    title="${frontMatter.title}"
    ${frontMatter.desc !== void 0 ? `desc="${frontMatter.desc}"` : ''}
    ${frontMatter.overline !== void 0 ? `overline="${frontMatter.overline}"` : ''}
    ${frontMatter.badge !== void 0 ? `badge="${frontMatter.badge}"` : ''}
    ${frontMatter.heading !== false ? 'heading' : ''}
    ${frontMatter.editLink !== false ? `edit-link="${frontMatter.editLink}"` : ''}
    ${frontMatter.toc.length !== 0 ? ':toc="toc"' : ''}
    ${frontMatter.related !== void 0 ? ':related="related"' : ''}
    ${frontMatter.nav !== void 0 ? ':nav="nav"' : ''}
    ${showIdIssues ? ':id-issues="idIssues"' : ''}>${mdContent}</DocPage>
</template>
<script setup>
import { copyHeading } from '@/assets/page-utils'
${
  frontMatter.examples !== void 0
    ? `
import { provide } from 'vue'
provide('_q_ex', import.meta.env.QUASAR_CLIENT
  ? { name: '${frontMatter.examples}'${
    /**
     * Can't use import.meta.env.QUASAR_PROD since on
     * dev, Vite tries to import the prod only modules
     * regardless of the condition.
     */
    isProd
      ? `, runtime: import('examples:runtime:${frontMatter.examples}'), source: () => import('examples:source:${frontMatter.examples}')`
      : ''
  } }
  : { name: '${frontMatter.examples}' })
`
    : ''
}
${frontMatter.related !== void 0 ? `const related = ${JSON.stringify(frontMatter.related)}` : ''}
${frontMatter.nav !== void 0 ? `const nav = ${JSON.stringify(frontMatter.nav)}` : ''}
${frontMatter.toc.length !== 0 ? `const toc = ${parseToc(frontMatter.toc)}` : ''}
${frontMatter.scope !== void 0 ? `const scope = ${JSON.stringify(frontMatter.scope)}` : ''}
${showIdIssues ? `const idIssues = ${JSON.stringify(idIssues)}` : ''}
${pageScripts}
</script>`
}

export function parseFrontMatter(content) {
  return matter(content, {
    excerpt_separator: '<!-- more -->',
    engines: {
      toml: toml.parse.bind(toml),
      excerpt: false
    }
  })
}

/**
 * Encode a value for use in a Vue `:prop="..."` binding.
 * Escape the characters that would break out of
 * the attribute or the JS expression.
 */
export function encodeForAttr(value) {
  return (
    JSON.stringify(value)
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      /**
       * Avoid @quasar/vite-plugin's transformation.
       */
      .replaceAll("from 'quasar'", String.raw`from \'quasar'`)
  )
}
