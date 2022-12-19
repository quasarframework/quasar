const md = require('./md')
const { convertToRelated, flatMenu } = require('./flat-menu')
const { getVueComponent, parseFrontMatter } = require('./md-parse-utils')

module.exports = function (code, id) {
  const { data, content } = parseFrontMatter(code)

  data.id = id
  data.title = data.title || 'Generic Page'

  if (data.related !== void 0) {
    data.related = data.related.map(entry => convertToRelated(entry, id))
  }

  if (data.components === void 0) {
    data.components = ['src/layouts/doc-layout/DocPage']
  }
  else {
    data.components.push('src/layouts/doc-layout/DocPage')
  }

  if (data.examples !== void 0) {
    data.components.push('src/components/DocExample')
  }
  if (code.indexOf('<doc-api') !== -1) {
    data.components.push('src/components/DocApi')
  }
  if (code.indexOf('<doc-installation') !== -1) {
    data.components.push('src/components/DocInstallation')
  }
  if (code.indexOf('<doc-tree') !== -1) {
    data.components.push('src/components/DocTree')
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

  md.$data = { toc: [], components: new Set() }

  const mdPageContent = md.render(content)

  data.toc = md.$data.toc
  data.components.push(...Array.from(md.$data.components))

  if (data.editLink !== false) {
    data.editLink = id.substring(id.indexOf('src/pages/') + 10, id.length - 3)
  }

  md.$data = null // free up memory

  return getVueComponent(data, mdPageContent)
}
