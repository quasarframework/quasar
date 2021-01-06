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

// Make sure to keep in sync with /src/assets/get-meta.js

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
    <template>
      <doc-page title="${data.heading !== false ? data.title : ''}"${data.related !== void 0 ? ` :related="related"` : ''}${data.nav !== void 0 ? ` :nav="nav"` : ''}${data.badge !== void 0 ? ` :badge="badge"` : ''}>${rendered}</doc-page>
    </template>
    <script>
    import { copyHeading } from 'assets/page-utils'
    ${data.components !== void 0 ? getComponentsImport(data.components) : ''}
    ${data.desc !== void 0 ? `const title = \`${data.title} | Quasar Framework\`, desc = \`${data.desc}\`` : ''}
    export default {
      meta: {
        title: \`${data.title}\`${data.desc !== void 0 ? `,
        meta: {
          title: {
            name: 'title',
            content: title
          },
          ogTitle: {
            name: 'og:title',
            content: title
          },
          twitterTitle: {
            name: 'twitter:title',
            content: title
          },

          description: {
            name: 'description',
            content: desc
          },
          ogDesc: {
            name: 'og:description',
            content: desc
          },
          twitterDesc: {
            name: 'twitter:description',
            content: desc
          }
        }` : ''}
      },
      ${data.components !== void 0 ? getComponentsDeclaration(data.components) : ''}
      ${data.related !== void 0 || data.nav !== void 0 ? `
      created () {
        this.$root.store.toc = ${toc}
        ${data.related !== void 0 ? `this.related = ${JSON.stringify(data.related)}` : ''}
        ${data.nav !== void 0 ? `this.nav = ${JSON.stringify(data.nav)}` : ''}
        ${data.badge !== void 0 ? `this.badge = ${JSON.stringify(data.badge)}` : ''}
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
