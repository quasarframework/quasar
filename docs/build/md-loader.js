const
  LRU = require('lru-cache'),
  hash = require('hash-sum')

const
  md = require('./md'),
  { convertToRelated, flatMenu } = require('./flat-menu')

const {
  getVueComponent,
  parseFrontMatter
} = require('./md-loader-utils')

const cache = new LRU({ max: 1000 })

module.exports = function (source) {
  const key = hash(source)
  const hit = cache.get(key)

  if (hit) {
    return hit
  }

  const { data, content } = parseFrontMatter(source)

  data.title = data.title || 'Generic Page'
  data.related = data.related !== void 0
    ? data.related.map(entry => convertToRelated(entry))
    : []

  if (flatMenu[this.resourcePath]) {
    const { prev, next } = flatMenu[this.resourcePath]

    if (prev !== void 0) {
      const index = data.related.findIndex(entry => entry.path === prev.path)
      if (index > -1) {
        data.related.splice(index, 1)
      }
      data.related.unshift({ ...prev, dir: 'left' })
    }
    if (next !== void 0) {
      const index = data.related.findIndex(entry => entry.path === next.path)
      if (index > -1) {
        data.related.splice(index, 1)
      }
      data.related.push({ ...next, dir: 'right' })
    }
  }

  md.$data = {
    toc: []
  }

  const rendered = md.render(content)
  const toc = md.$data.toc

  md.$data = {}

  const res = getVueComponent(
    rendered,
    data,
    '[' + toc.join(',') + ']'
  )

  cache.set(key, res)

  return res
}
