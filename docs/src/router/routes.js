import DocLayout from 'layouts/DocLayout.vue'
import getListingComponent from 'components/getListingComponent.js'
import menu from 'assets/menu.js'
import layoutGallery from 'assets/layout-gallery.js'

const docsPages = [
  {
    path: '',
    component: () => import('pages/Landing.vue')
  }
]

function parseMenuNode (node, __path) {
  const prefix = __path + (node.path !== void 0 ? '/' + node.path : '')

  if (node.children !== void 0) {
    prefix !== '/start' && docsPages.push({
      path: prefix,
      component: getListingComponent(
        node.name,
        node.children.map(node => {
          const to = node.external === true
            ? node.path
            : (
              prefix + (
                node.path !== void 0
                  ? '/' + node.path
                  : (node.listPath !== void 0 ? '/' + node.listPath : '')
              )
            )

          if (node.external !== true && node.listPath !== void 0) {
            docsPages.push({
              path: to,
              component: getListingComponent(
                node.name,
                node.children.map(node => ({
                  title: node.name,
                  to: prefix + (node.path !== void 0 ? '/' + node.path : ''),
                  page: true
                }))
              )
            })
          }

          return {
            title: node.name,
            to,
            page: node.children === void 0
          }
        })
      )
    })

    node.children.forEach(node => parseMenuNode(node, prefix))
  }
  else if (node.external !== true) {
    docsPages.push({
      path: prefix,
      component: () => import('pages/' + prefix.substring(1) + '.md')
    })
  }
}

menu.forEach(node => {
  parseMenuNode(node, '')
})

const redirects = [
  { from: '/quasar-cli/supporting-ie', to: '/quasar-cli/browser-compatibility' },
  { from: '/quasar-cli/modern-build', to: '/quasar-cli/browser-compatibility' }
]

const routes = [
  ...redirects.map(entry => ({
    path: entry.from,
    redirect: entry.to
  })),

  {
    path: '/start',
    redirect: '/start/pick-quasar-flavour'
  },
  {
    path: '/',
    component: DocLayout,
    children: docsPages
  },

  // externals
  {
    path: '/layout-builder',
    component: () => import('layouts/LayoutBuilder.vue')
  },

  ...layoutGallery.map(layout => ({
    path: layout.demoLink,
    component: () => import('layouts/gallery/' + layout.path + '.vue'),
    children: [
      {
        path: '',
        component: () => import('components/page-parts/layout/LayoutGalleryPage.vue'),
        meta: {
          title: layout.name,
          screenshot: layout.screenshot,
          sourceLink: layout.sourceLink
        }
      }
    ]
  })),

  // Always leave this as last one
  {
    path: '*',
    component: DocLayout,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }
]

export default routes
