const
  matter = require('gray-matter'),
  toml = require('toml'),
  LRU = require('lru-cache')

module.exports.getVueComponent = function (rendered, data, toc) {
  return `
    <template>
      <doc-page title="${data.title}">${rendered}</doc-page>
    </template>
    <script>
    import { copyHeading } from 'assets/page-utils'
    export default {
      meta: {
        title: \`${data.title}\`
      },
      methods: {
        copyHeading
      },
      preFetch ({ store }) {
        store.commit('updateToc', ${toc})
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
