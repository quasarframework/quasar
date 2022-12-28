import menu from './menu.js'

function normalizeComps (list) {
  let acc = [
    {
      name: 'Layout',
      path: '/layout/layout'
    },
    {
      name: 'Layout Header',
      path: '/layout/header-and-footer'
    },
    {
      name: 'Layout Footer',
      path: '/layout/header-and-footer'
    },
    {
      name: 'Layout Drawer',
      path: '/layout/drawer'
    },
    {
      name: 'Layout Page',
      path: '/layout/page'
    },
    {
      name: 'Page Sticky',
      path: '/layout/page-sticky'
    },
    {
      name: 'Page Scroller',
      path: '/layout/page-scroller'
    }
  ]

  list.forEach(entry => {
    if (entry.children) {
      entry.children = entry.children.map(function (comp) {
        comp.path = '/vue-components/' + comp.path
        return comp
      })
      acc = acc.concat(entry.children)
    }
    else {
      entry.path = '/vue-components/' + entry.path
      acc.push(entry)
    }
  })

  return acc.sort((a, b) => a.name.localeCompare(b.name))
}

export default {
  comps: normalizeComps(menu.find(entry => entry.name === 'Vue Components').children),
  dirs: menu.find(entry => entry.name === 'Vue Directives').children,
  plugins: menu.find(entry => entry.name === 'Quasar Plugins').children
}
