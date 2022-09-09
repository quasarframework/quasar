const
  md = require('./md'),
  { convertToRelated, flatMenu } = require('./flat-menu')

const {
  getVueComponent,
  parseFrontMatter
} = require('./md-parse-utils')

module.exports = function (code, id) {
  const { data, content } = parseFrontMatter(code)

  data.title = data.title || 'Generic Page'

  if (data.related !== void 0) {
    data.related = data.related.map(entry => convertToRelated(entry, id))
  }

  if (data.components === void 0) {
    data.components = []
  }

  if (code.indexOf('<doc-example') !== -1) {
    data.components.push('../DocExample')
  }
  if (code.indexOf('<doc-api') !== -1) {
    data.components.push('../DocApi')
  }
  if (code.indexOf('<doc-installation') !== -1) {
    data.components.push('../DocInstallation')
  }

  if (data.overline === void 0) {
    if (id.indexOf('quasar-cli-webpack') !== -1) {
      data.overline = 'Quasar CLI with Webpack - @quasar/app-webpack'
    }
    else if (id.indexOf('quasar-cli-vite') !== -1) {
      data.overline = 'Quasar CLI with Vite - @quasar/app-vite'
    }
  }

  const menu = flatMenu[ id ]

  if (menu !== void 0) {
    const { prev, next } = menu

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
