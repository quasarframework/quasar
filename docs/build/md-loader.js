const
  LRU = require('lru-cache'),
  hash = require('hash-sum')

const md = require('./md')

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
