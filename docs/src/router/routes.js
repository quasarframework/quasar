
import mdPageList from 'src/pages/listing'

import layoutGallery from 'assets/layout-gallery.js'
import vueGalleryPageList from 'src/layouts/gallery/listing'

import DocLayout from 'src/layouts/doc-layout/DocLayout.vue'

const routeMap = {
  // './docs/docs.md': { path: 'docs' },
  // './integrations/integrations.md': { path: 'integrations' },
  './components/components.md': { path: 'components', meta: { fullwidth: true, dark: true } }
}

const routes = [
  // legacy redirecting
  { path: '/quasar-cli/supporting-ie', redirect: '/quasar-cli-webpack/browser-compatibility' },
  { path: '/quasar-cli/modern-build', redirect: '/quasar-cli-webpack/browser-compatibility' },
  { path: '/quasar-cli/quasar-conf-js', redirect: '/quasar-cli-webpack/quasar-config-js' },
  { path: '/contribution-guide', redirect: '/how-to-contribute/contribution-guide' },

  // shortcuts
  { path: '/start', redirect: '/start/quick-start' },
  { path: '/vue-components', redirect: '/components' },
  { path: '/vue-directives', redirect: '/components' },
  { path: '/plugins', redirect: '/components' },
  { path: '/utils', redirect: '/components' },

  // docs
  {
    path: '/',
    component: DocLayout,
    children: [
      {
        path: '',
        component: () => import('../pages/landing/PageLanding.vue'),
        meta: { fullscreen: true, dark: true }
      },
      ...Object.keys(mdPageList).map(key => {
        const acc = { component: mdPageList[ key ] }

        const route = routeMap[ key ]
        route !== void 0 && Object.assign(acc, route)

        if (acc.path === void 0) {
          const parts = key.substring(1, key.length - 3).split('/')
          const len = parts.length
          const path = parts[ len - 2 ] === parts[ len - 1 ]
            ? parts.slice(0, len - 1)
            : parts

          acc.path = path.join('/')
        }

        return acc
      })
    ]
  },

  // externals
  {
    path: '/layout-builder',
    component: () => import('../layouts/builder/LayoutBuilder.vue')
  },

  // gallery
  ...layoutGallery.map(layout => ({
    path: layout.demoLink,
    component: vueGalleryPageList[ `./${ layout.path }.vue` ],
    children: [
      {
        path: '',
        component: () => import('../layouts/gallery/LayoutGalleryPage.vue'),
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
    path: '/:catchAll(.*)*',
    component: DocLayout,
    children: [{
      path: '',
      component: () => import('../pages/Page404.vue'),
      meta: { fullscreen: true }
    }]
  }
]

export default routes
