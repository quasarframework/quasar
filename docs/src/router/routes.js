import Layout from 'layouts/Layout.vue'
import menu from 'assets/menu.js'

const docsPages = [
  {
    path: '',
    component: () => import('pages/Landing.vue')
  },
  {
    path: 'docs',
    component: () => import('pages/docs.md')
  }
]

function parseMenuNode (node, __path) {
  const prefix = __path + (node.path !== void 0 ? '/' + node.path : '')

  if (node.children !== void 0) {
    node.children.forEach(node => parseMenuNode(node, prefix))
  }
  else {
    docsPages.push({
      path: prefix,
      component: () => import(`pages/${prefix.substring(1)}.md`)
    })
  }
}

menu.forEach(node => {
  parseMenuNode(node, '')
})

const routes = [
  {
    path: '/',
    component: Layout,
    children: docsPages
  },
  {
    path: '/layout-builder',
    component: () => import('layouts/LayoutBuilder.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
