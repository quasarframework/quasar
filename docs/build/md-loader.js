const
  md = require('./md'),
  { convertToRelated, flatMenu } = require('./flat-menu')

const {
  getVueComponent,
  parseFrontMatter
} = require('./md-loader-utils')

module.exports = function (source) {
  const { data, content } = parseFrontMatter(source)

  data.title = data.title || 'Generic Page'

  if (data.related !== void 0) {
    data.related = data.related.map(entry => convertToRelated(entry))
  }

  if (data.overline === void 0) {
    if (this.resourcePath.indexOf('quasar-cli-webpack') !== -1) {
      data.overline = 'Quasar CLI with Webpack - @quasar/app-webpack'
    }
    else if (this.resourcePath.indexOf('quasar-cli-vite') !== -1) {
      data.overline = 'Quasar CLI with Vite - @quasar/app-vite'
    }
  }

  if (flatMenu[ this.resourcePath ]) {
    const { prev, next } = flatMenu[ this.resourcePath ]

    if (prev !== void 0 || next !== void 0) {
      data.nav = []
    }

    if (prev !== void 0) {
      data.nav.push({ ...prev, dir: 'left' })
    }
    if (next !== void 0) {
      data.nav.push({ ...next, dir: 'right' })
    }
  }

  md.$data = {
    toc: []
  }

  const rendered = md.render(content)
  const toc = data.toc !== false
    ? md.$data.toc
    : []

  md.$data = {}

  return getVueComponent(
    rendered,
    data,
    '[' + toc.join(',') + ']'
  )
}
