const
  matter = require('gray-matter'),
  toml = require('toml')

function getComponentsImport (comp) {
  return comp.map(c => {
    const parts = c.split('/')
    return `import ${parts[parts.length - 1]} from 'components/page-parts/${c}.vue'\n`
  }).join('')
}

function getComponentsDeclaration (comp) {
  const list = comp.map(c => {
    const parts = c.split('/')
    return parts[parts.length - 1]
  }).join(',')

  return `components: { ${list} },`
}

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
    <template>
      <doc-page title="${data.title}"${data.related.length > 0 ? ` :related="related"` : ''}>${rendered}</doc-page>
    </template>
    <script>
    import { copyHeading } from 'assets/page-utils'
    ${data.components !== void 0 ? getComponentsImport(data.components) : ''}
    export default {
      meta: {
        title: \`${data.title}\`
      },
      preFetch ({ store }) {
        store.commit('updateToc', ${toc})
      },
      ${data.components !== void 0 ? getComponentsDeclaration(data.components) : ''}
      ${data.related !== void 0 ? `
      created () {
        this.related = ${JSON.stringify(data.related)}
      },` : ''}
      methods: {
        copyHeading
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
