import { socialLinks } from './links.social'

export const footerLinks = [
  {
    name: 'How to contribute',
    extract: 'how-to-contribute',
    children: [
      { name: 'Quasar Team', path: '/meet-the-team' }
    ]
  },
  {
    name: socialLinks.name,
    children: socialLinks.children.concat([
      { name: 'Blog', path: 'https://blog.quasar.dev', external: true },
      { name: 'Announcements', path: 'https://github.com/quasarframework/quasar/discussions/categories/announcements', external: true }
    ])
  },
  {
    name: 'Options & Helpers',
    extract: 'options'
  },
  {
    name: 'Style & Identity',
    extract: 'style'
  },
  {
    name: 'Quasar CLI with Vite',
    children: [
      { name: 'Developing SPA', path: '/quasar-cli-vite/developing-spa/introduction' },
      { name: 'Developing SSR', path: '/quasar-cli-vite/developing-ssr/introduction' },
      { name: 'Developing PWA', path: '/quasar-cli-vite/developing-pwa/introduction' },
      { name: 'Developing Capacitor Apps', path: '/quasar-cli-vite/developing-capacitor-apps/introduction' },
      { name: 'Developing Cordova Apps', path: '/quasar-cli-vite/developing-cordova-apps/introduction' },
      { name: 'Developing Electron Apps', path: '/quasar-cli-vite/developing-electron-apps/introduction' },
      { name: 'Developing Browser Extensions', path: '/quasar-cli-vite/developing-browser-extensions/introduction' }
    ]
  },
  {
    name: 'Quasar CLI with Webpack',
    children: [
      { name: 'Developing SPA', path: '/quasar-cli-webpack/developing-spa/introduction' },
      { name: 'Developing SSR', path: '/quasar-cli-webpack/developing-ssr/introduction' },
      { name: 'Developing PWA', path: '/quasar-cli-webpack/developing-pwa/introduction' },
      { name: 'Developing Capacitor Apps', path: '/quasar-cli-webpack/developing-capacitor-apps/introduction' },
      { name: 'Developing Cordova Apps', path: '/quasar-cli-webpack/developing-cordova-apps/introduction' },
      { name: 'Developing Electron Apps', path: '/quasar-cli-webpack/developing-electron-apps/introduction' },
      { name: 'Developing Browser Extensions', path: '/quasar-cli-webpack/developing-browser-extensions/introduction' }
    ]
  },
  {
    name: 'Icon Genie CLI',
    extract: 'icongenie'
  },
  {
    name: 'Layout & Grid',
    extract: 'layout',
    children: [
      { name: 'Flex Grid', path: '/layout/grid/introduction-to-flexbox' }
    ]
  },
  {
    name: 'App Extensions',
    children: [
      { name: 'Introduction', path: '/app-extensions/introduction' },
      { name: 'Discover App Extensions', path: '/app-extensions/discover' },
      { name: 'Development Guide', path: '/app-extensions/development-guide/introduction' },
      { name: 'Tips & Tricks', path: '/app-extensions/tips-and-tricks' }
    ]
  }
]
