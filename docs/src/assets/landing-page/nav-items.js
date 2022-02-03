import {
  mdiPuzzle,
  mdiFlare, mdiThemeLightDark,
  mdiPaletteSwatch,
  mdiShoppingMusic,
  mdiStarCircle,
  mdiViewDashboard,
  mdiFlask, mdiJsfiddle, mdiCodepen
} from '@quasar/extras/mdi-v6'
import { fasCubes } from '@quasar/extras/fontawesome-v5'

const gettingStartedNavItem = {
  label: 'Getting Started',
  subMenu: [
    {
      label: 'Installation',
      subMenu: [
        {
          label: 'Pick Quasar Flavour',
          path: 'start/pick-quasar-flavour'
        },
        {
          label: 'Quasar CLI',
          path: 'quasar-cli'
        },
        {
          label: 'UMD / Standalone',
          path: 'start/umd'
        },
        {
          label: 'Vue CLI Plugin',
          path: 'start/vue-cli-plugin'
        },
        {
          label: 'Vite Plugin',
          path: 'start/vite-plugin'
        }
      ]
    },
    {
      label: 'How to use Vue',
      path: 'start/how-to-use-vue'
    },
    {
      label: 'Playground',
      path: 'start/playground'
    },
    {
      label: 'Upgrade Guide',
      path: 'start/upgrade-guide'
    },
    {
      label: 'VS Code Configuration',
      path: 'start/vs-code-configuration'
    }
  ]
}

const toolsNavItem = {
  label: 'Tools',
  subMenu: [
    {
      label: 'Awesome List',
      icon: mdiFlare,
      href: 'https://awesome.quasar.dev'
    },
    {
      label: 'App Extensions',
      icon: mdiPuzzle,
      path: 'app-extensions/discover'
    },
    {
      label: 'Helpers',
      isHeader: true
    },
    {
      label: 'Icon Genie CLI',
      icon: mdiStarCircle,
      path: 'icongenie'
    },
    {
      label: 'Theme Builder',
      icon: mdiPaletteSwatch,
      path: 'style/theme-builder'
    },
    {
      label: 'Dark Mode',
      icon: mdiThemeLightDark,
      path: 'style/dark-mode'
    },
    {
      label: 'Layout Build',
      icon: mdiViewDashboard,
      href: 'layout-builder'
    },
    {
      label: 'Layout Gallery',
      icon: mdiShoppingMusic,
      path: 'layout/gallery'
    },
    {
      label: 'Flex Playground',
      icon: mdiFlask,
      path: 'layout/grid/flex-playground'
    },
    {
      label: 'Playground',
      isHeader: true
    },
    {
      label: 'Codepen',
      icon: mdiCodepen,
      href: 'https://codepen.quasar.dev'
    },
    {
      label: 'jsFiddle',
      icon: mdiJsfiddle,
      href: 'https://jsfiddle.quasar.dev'
    },
    {
      label: 'Codesandbox',
      icon: fasCubes,
      href: 'https://codesandbox.quasar.dev'
    }
  ]
}

export const navItems = {
  mainNavItems: [
    {
      label: 'Docs',
      path: 'docs'
    },
    {
      label: 'Components',
      path: 'components'
    },
    {
      label: 'Become sponsor',
      path: 'sponsors-and-backers'
    },
    {
      label: 'Meet the Team',
      path: 'meet-the-team'
    },
    {
      label: 'Blog',
      href: 'https://dev.to/quasar'
    }
  ],
  subNavItems: [
    {
      label: 'Why Quasar?',
      path: 'introduction-to-quasar'
    },
    { ...gettingStartedNavItem },
    { ...toolsNavItem },
    {
      label: 'Announcements',
      href: 'https://forum.quasar-framework.org/category/1/announcements'
    },
    {
      label: 'Roadmap',
      path: 'start/roadmap'
    },
    {
      label: 'Video Tutorials',
      path: 'video-tutorials'
    },
    {
      label: 'Quasar Brand resources',
      href: 'https://github.com/quasarframework/quasar-art'
    }
  ]
}
export const secondaryHeaderNavItems = [
  {
    label: 'Docs',
    path: 'docs'
  },
  {
    label: 'Components',
    path: 'components'
  },
  { ...gettingStartedNavItem },
  { ...toolsNavItem }
]

export function computeRouteNav (navItem, navType = 'to') {
  if (navType === 'href') {
    return navItem.href || undefined
  }
  return !navItem.subMenu ? `/${navItem.path}` : undefined
}
