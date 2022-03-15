export const footerNavs = [
  {
    path: 'contribution-guide',
    name: 'How to contribute'
  },
  {
    path: 'options',
    name: 'Options & Helpers'
  },
  {
    path: 'security',
    name: 'Security'
  },
  {
    path: 'quasar-cli',
    name: 'Quasar CLI'
  },
  {
    name: 'Quasar Modes',
    areOrphans: true,
    items: [
      {
        name: 'Developing SPA',
        path: 'quasar-cli/developing-spa/introduction'
      },
      {
        name: 'Developing SSR',
        path: 'quasar-cli/developing-ssr/introduction'
      },
      {
        name: 'Developing PWA',
        path: 'quasar-cli/developing-pwa/introduction'
      },
      {
        name: 'Developing Capacitor Apps',
        path: 'quasar-cli/developing-capacitor-apps/introduction'
      },
      {
        name: 'Developing Cordova Apps',
        path: 'quasar-cli/developing-cordova-apps/introduction'
      },
      {
        name: 'Developing Electron Apps',
        path: 'quasar-cli/developing-electron-apps/introduction'
      },
      {
        name: 'Developing Browser Extensions',
        path: 'quasar-cli/developing-browser-extensions/introduction'
      }
    ]
  },
  {
    path: 'icongenie',
    name: 'Icon Genie CLI'
  },
  {
    path: 'style',
    name: 'Style & Identity'
  },
  {
    path: 'layout',
    name: 'Layout & Grid',
    itemToUnshift: {
      name: 'Flex Grid',
      path: 'grid/introduction-to-flexbox'
    }
  },
  {
    name: 'UI Library',
    areOrphans: true,
    items: [
      {
        name: 'Vue Components',
        path: 'components'
      },
      {
        name: 'Vue Directives',
        path: 'vue-directives'
      },
      {
        name: 'Quasar Plugins',
        path: 'quasar-plugins'
      },
      {
        name: 'Vue Composables',
        path: 'vue-composables'
      },
      {
        name: 'Quasar Utils',
        path: 'quasar-utils'
      }
    ]
  },
  {
    name: 'App Extensions',
    areOrphans: true,
    items: [
      {
        name: 'Introduction',
        path: 'app-extensions/introduction'
      },
      {
        name: 'Discover App Extensions',
        path: 'app-extensions/discover'
      },
      {
        name: 'Development Guide',
        path: 'app-extensions/development-guide/introduction'
      },
      {
        name: 'Tips & Tricks',
        path: 'app-extensions/tips-and-tricks'
      }
    ]
  }
]
