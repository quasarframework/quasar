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
      <doc-page title="${data.title}"${data.related !== void 0 ? ` :related="related"` : ''}${data.nav !== void 0 ? ` :nav="nav"` : ''}>${rendered}</doc-page>
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
      ${data.related !== void 0 || data.nav !== void 0 ? `
      created () {
        ${data.related !== void 0 ? `this.related = ${JSON.stringify(data.related)}` : ''}
        ${data.nav !== void 0 ? `this.nav = ${JSON.stringify(data.nav)}` : ''}
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
