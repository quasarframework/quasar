const
  matter = require('gray-matter'),
  toml = require('toml'),
  LRU = require('lru-cache')

function getComponentsImport (comp) {
  return comp.map(c => `import ${c[0]} from 'components/page-parts/${c[1]}'\n`).join('')
}

function getComponentsDeclaration (comp) {
  return 'components: {' + comp.map(c => c[0]).join(',') + '},'
}

function getData (data) {
  return `data () { return ${JSON.stringify(data)} },`
}

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
    <template>
      <doc-page title="${data.title}">${rendered}</doc-page>
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
      ${data.data !== void 0 ? getData(data.data) : ''}
      ${data.components !== void 0 ? getComponentsDeclaration(data.components) : ''}
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

const headersCache = new LRU({ max: 1000 })

module.exports.extractHeaders = function (content, include = [], md) {
  const key = content + include.join(',')
  const hit = headersCache.get(key)

  if (hit) {
    return hit
  }

  const tokens = md.parse(content, {})

  const res = []
  tokens.forEach((t, i) => {
    if (t.type === 'heading_open' && include.includes(t.tag)) {
      const title = tokens[i + 1].content
      const slug = t.attrs.find(([name]) => name === 'id')[1]
      res.push({
        level: parseInt(t.tag.slice(1), 10),
        title: title,
        slug: slug || md.slugify(title)
      })
    }
  })

  headersCache.set(key, res)
  return res
}
