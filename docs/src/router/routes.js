import mdPageList from '@/pages/listing.js'

import layoutGallery from '@/assets/layout-gallery.js'
import vueGalleryPageList from '@/layouts/gallery/listing.js'

import DocLayout from '@/layouts/doc-layout/DocLayout.vue'

const routeMap = {
  // './docs/docs.md': { path: 'docs' },
  // './integrations/integrations.md': { path: 'integrations' },
  './components/components.md': {
    path: 'components',
    meta: { fullwidth: true, dark: true }
  }
}

const routes = [
  // legacy redirects
  {
    path: '/quasar-cli-vite/quasar-config-js',
    redirect: '/quasar-cli-vite/quasar-config-file'
  },
  {
    path: '/quasar-cli-vite/handling-process-env',
    redirect: '/quasar-cli-vite/handling-import-meta-env'
  },
  {
    path: '/quasar-cli-vite/developing-electron-apps/electron-packages',
    redirect:
      '/quasar-cli-vite/developing-electron-apps/installing-electron-dependencies'
  },
  {
    path: '/quasar-cli-vite/linter',
    redirect: '/quasar-cli-vite/lint-and-format-code'
  },
  {
    path: '/quasar-cli-vite/convert-to-quasar-cli-with-vite',
    redirect: '/quasar-cli-vite/convert-app-webpack-to-app-vite'
  },
  {
    path: '/quasar-cli-vite/routing',
    redirect: '/quasar-cli-vite/page-routing-with-vue-router'
  },

  // shortcuts
  { path: '/start', redirect: '/start/quick-start' },
  { path: '/vue-components', redirect: '/components?initial=vue-components' },
  { path: '/vue-directives', redirect: '/components?initial=vue-directives' },
  { path: '/directives', redirect: '/components?initial=vue-directives' },
  { path: '/quasar-plugins', redirect: '/components?initial=quasar-plugins' },
  { path: '/plugins', redirect: '/components?initial=quasar-plugins' },
  { path: '/vue-composables', redirect: '/components?initial=vue-composables' },
  { path: '/composables', redirect: '/components?initial=vue-composables' },
  { path: '/quasar-utils', redirect: '/components?initial=quasar-utils' },
  { path: '/utils', redirect: '/components?initial=quasar-utils' },

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
        const acc = { component: mdPageList[key] }

        const route = routeMap[key]
        if (route !== void 0) Object.assign(acc, route)

        if (acc.path === void 0) {
          const parts = key.slice(1, -3).split('/')
          const len = parts.length
          const path =
            parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts

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
    component: vueGalleryPageList[`./${layout.path}.vue`],
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
    children: [
      {
        path: '',
        component: () => import('../pages/Page404.vue'),
        meta: { fullscreen: true }
      }
    ]
  }
]

export default routes
