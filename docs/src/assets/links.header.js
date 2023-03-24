import { Quasar } from 'quasar'

import { fasCubes, fasBolt } from '@quasar/extras/fontawesome-v5'

import {
  mdiBug, mdiClipboardText, mdiCodepen, mdiFlare, mdiFlask, mdiGithub, mdiJsfiddle, mdiPaletteSwatch, mdiPuzzle, mdiShoppingMusic,
  mdiStarCircle, mdiThemeLightDark, mdiViewDashboard, mdiSecurity, mdiMathIntegralBox
} from '@quasar/extras/mdi-v6'

import { socialLinks } from './links.social'

export const versionLinks = [{
  name: `v${Quasar.version}`,
  children: [
    {
      header: `Latest (v${Quasar.version})`
    },
    { name: 'Release notes', icon: mdiClipboardText, path: '/start/release-notes' },
    { name: 'Report a bug', icon: mdiBug, path: 'https://github.com/quasarframework/quasar/issues', external: true },
    { name: 'Report a vulnerability', icon: mdiSecurity, path: '/security/report-a-vulnerability', external: true },
    { name: 'Repository', icon: mdiGithub, path: 'https://github.com/quasarframework', external: true },
    {
      header: 'Older Releases'
    },
    { name: 'v1', path: 'https://v1.quasar.dev/', external: true },
    { name: 'v0.17', path: 'https://v0-17.quasar-framework.org/', external: true },
    { name: 'v0.16', path: 'https://v0-16.quasar-framework.org/', external: true },
    { name: 'v0.15', path: 'https://v0-15.quasar-framework.org/', external: true },
    { name: 'v0.14', path: 'https://v0-14.quasar-framework.org/', external: true },
    { name: 'v0.13', path: 'https://v0-13.quasar-framework.org/', external: true }
  ]
}]

const gettingStarted = {
  name: 'Getting Started',
  mq: 510,
  children: [
    { name: 'Quick Start', path: '/start/quick-start' },
    {
      name: 'Installation',
      children: [
        { name: 'Pick Quasar Flavour', path: '/start/pick-quasar-flavour' },
        {
          separator: true
        },
        { name: 'Quasar CLI', path: '/start/quasar-cli' },
        { name: 'UMD / Standalone', path: '/start/umd' },
        { name: 'Vue CLI Plugin', path: '/start/vue-cli-plugin' },
        { name: 'Vite Plugin', path: '/start/vite-plugin' }
      ]
    },
    { name: 'How to use Vue', path: '/start/how-to-use-vue' },
    { name: 'Playground', path: '/start/playground' },
    { name: 'Upgrade Guide', path: '/start/upgrade-guide' },
    { name: 'VS Code Configuration', path: '/start/vs-code-configuration' }
  ]
}

const tools = {
  name: 'Tools',
  mq: 600,
  children: [
    { name: 'Awesome List', icon: mdiFlare, path: 'https://awesome.quasar.dev', external: true },
    { name: 'Integrations', icon: mdiMathIntegralBox, path: '/integrations' },
    { name: 'App Extensions', icon: mdiPuzzle, path: '/app-extensions/discover' },
    {
      header: 'Helpers'
    },
    { name: 'Icon Genie CLI', icon: mdiStarCircle, path: '/icongenie/introduction' },
    { name: 'Theme Builder', icon: mdiPaletteSwatch, path: '/style/theme-builder' },
    { name: 'Dark Mode', icon: mdiThemeLightDark, path: '/style/dark-mode' },
    { name: 'Layout Builder', icon: mdiViewDashboard, path: '/layout-builder', external: true },
    { name: 'Layout Gallery', icon: mdiShoppingMusic, path: '/layout/gallery' },
    { name: 'Flex Playground', icon: mdiFlask, path: '/layout/grid/flex-playground' },
    {
      header: 'Playground'
    },
    { name: 'Codepen', icon: mdiCodepen, path: 'https://codepen.quasar.dev', external: true },
    { name: 'jsFiddle', icon: mdiJsfiddle, path: 'https://jsfiddle.quasar.dev', external: true },
    { name: 'Stackblitz (Vite)', icon: fasBolt, path: 'https://stackblitz.quasar.dev', external: true },
    { name: 'Stackblitz (Webpack)', icon: fasBolt, path: 'https://stackblitz-webpack.quasar.dev', external: true },
    { name: 'Codesandbox', icon: fasCubes, path: 'https://codesandbox.quasar.dev', external: true }
  ]
}

export const primaryToolbarLinks = [
  { name: 'Docs', mq: 750, path: '/docs' },
  { name: 'Components', mq: 860, path: '/components' },
  { name: 'Sponsors', mq: 1190, path: '/sponsors-and-backers' },
  { name: 'Team', mq: 1310, path: '/meet-the-team' },
  { name: 'Blog', mq: 1400, path: 'https://blog.quasar.dev', external: true }
]

export const secondaryToolbarLinks = [
  { name: 'Why Quasar?', mq: 750, path: '/introduction-to-quasar' },
  gettingStarted,
  tools,
  { name: 'Announcements', mq: 910, path: 'https://github.com/quasarframework/quasar/discussions/categories/announcements', external: true },
  { name: 'Roadmap', mq: 1000, path: 'https://roadmap.quasar.dev', external: true },
  { name: 'Video Tutorials', mq: 1130, path: '/video-tutorials' },
  { name: 'Brand resources', mq: 1400, path: 'https://github.com/quasarframework/quasar-art', external: true }
]

export const moreLinks = [{
  name: 'More',
  children: [
    ...primaryToolbarLinks,
    {
      separator: true
    },
    ...secondaryToolbarLinks,
    socialLinks
  ]
}]
