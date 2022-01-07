export const footerNavs = [
  {
    path: 'start',
    name: 'Getting Started'
  },
  {
    path: 'contribution-guide',
    name: 'Contribution Guide'
  },
  {
    path: 'options',
    name: 'Quasar Options & Helpers'
  },
  {
    path: 'security',
    name: 'Security'
  },
  {
    path: 'quasar-cli',
    name: 'Quasar CLI',
    // because of the structure of menu, we need a condition to know what to ignore
    menuExitCondition: (item) => item.path === 'testing-and-auditing'
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
    name: 'Layout & Grid'
  },
  {
    path: 'vue-directives',
    name: 'Vue Directives'
  },
  {
    path: 'quasar-plugins',
    name: 'Quasar Plugins'
  },
  {
    path: 'app-extensions',
    name: 'App Extensions'
  },
  {
    path: 'quasar-utils',
    name: 'Quasar Utils'
  }
]

export const footerToolbar = [
  { label: 'Why quasar?', to: '#' },
  { label: 'Team', to: '#' },
  { label: 'Video tutorials', to: '#' },
  { label: 'Quasar brand resources', to: '#' },
  { label: 'Privacy policy', to: '#' }
]
