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

export function getVueComponent (data, mdPageContent) {
  return `<template>
  <doc-page
    title="${ data.title }"
    ${ data.desc !== void 0 ? `desc="${ data.desc }"` : '' }
    ${ data.overline !== void 0 ? `overline="${ data.overline }"` : '' }
    ${ data.badge !== void 0 ? `badge="${ data.badge }"` : '' }
    ${ data.heading !== false ? 'heading' : '' }
    ${ data.editLink !== false ? `edit-link="${ data.editLink }"` : '' }
    ${ data.toc.length !== 0 ? ':toc="toc"' : '' }
    ${ data.related !== void 0 ? ':related="related"' : '' }
    ${ data.nav !== void 0 ? ':nav="nav"' : '' }>${ mdPageContent }</doc-page>
</template>
<script setup>
import { copyHeading } from 'assets/page-utils'
${
  data.examples !== void 0
    ? `
import { provide } from 'vue'
provide('_q_ex', process.env.CLIENT
  ? { name: '${data.examples}', list: import('examples:${data.examples}') }
  : { name: '${data.examples}' })
`
    : ''
}
${
  data.components.size !== 0
    ? getComponentsImport(Array.from(data.components))
    : ''
}
${
  data.related !== void 0
    ? `const related = ${JSON.stringify(data.related)}`
    : ''
}
${data.nav !== void 0 ? `const nav = ${JSON.stringify(data.nav)}` : ''}
${data.toc.length !== 0 ? `const toc = ${parseToc(data.toc)}` : ''}
${data.scope !== void 0 ? `const scope = ${JSON.stringify(data.scope)}` : ''}
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
