import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import matter from 'gray-matter'
import toml from 'toml'

const rootFolder = fileURLToPath(new URL('../../../', import.meta.url))

const typesDir = path.resolve(rootFolder, 'node_modules/quasar/dist/types/api')
const typeFiles = fs.readdirSync(typesDir)

const extEndRE = /\.(js|vue)$/

function getComponentsImport (componentsList) {
  return componentsList
    .map((c) => {
      const parts = c.split('/')
      const file = extEndRE.test(c) === false ? `${c}.vue` : c

      return `import ${parts[ parts.length - 1 ].replace(
        extEndRE,
        ''
      )} from '${file}'\n`
    })
    .join('')
}

function parseToc (toc) {
  let wasHeader = true // Introduction is auto prepended
  let headerIndex = 1 // Introduction is auto prepended
  let subheaderIndex

  const list = toc.map((entry) => {
    if (entry.sub === true) {
      if (wasHeader === true) {
        subheaderIndex = 1
      }
      else {
        subheaderIndex++
      }

      wasHeader = false
    }
    else {
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

/** Add types if quasar/dist/types/api/ have it */
export function addTypeDeclarations (code, id) {
  const fileName = path.basename(id).replace('.md', '')

  let typeFile = typeFiles.find((typeFile) => {
    return typeFile.includes(fileName)
  })

  // some special
  if (fileName === 'color-palette') typeFile = 'color.d.ts'
  if (fileName === 'touch-swipe') typeFile = 'touchswipe.d.ts'
  if (fileName === 'field') typeFile = 'validation.d.ts'

  if (typeFile) {
    let typeCode = fs.readFileSync(path.join(typesDir, typeFile), 'utf-8')

    // clean up types
    typeCode = typeCode
      .replace(/import\(.*?\)\./g, '')
      .replace(/import[\s\S]+?from ?["'][\s\S]+?["'];/g, '')
      .replace(/export {}/g, '')
      .replace(/\/\/.*/g, '')

    typeCode = `\`\`\` typescript\n${typeCode.trim()}\n\`\`\``

    const typingSection =
      typeCode.length > 1000
        ? `
## Type Declarations

::: details Show Type Declarations

${typeCode}

:::
    `
        : `\n## Type Declarations\n\n${typeCode}`

    return code + typingSection
  }

  return code
}
