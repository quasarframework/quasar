import {
  mdiApplicationOutline,
  mdiCalendar,
  mdiDevices,
  mdiFileDownload,
  mdiGraphql,
  mdiLanguageMarkdown,
  mdiPuzzle,
  mdiServer,
  mdiSvg,
  mdiTestTube
} from '@quasar/extras/mdi-v6'

export const ecosystemParts = [
  {
    about: 'App Extensions that help you design your UI',
    options: [
      {
        label: 'QCalendar',
        icon: mdiCalendar,
        path: 'https://github.com/quasarframework/quasar-ui-qcalendar'
      },
      {
        label: 'QMarkdown',
        icon: mdiLanguageMarkdown,
        path: 'https://github.com/quasarframework/app-extension-qmarkdown'
      },
      {
        label: 'QMediaPlayer',
        icon: 'ondemand_video',
        path: 'https://github.com/quasarframework/app-extension-qmediaplayer'
      },
      {
        label: 'All AEs',
        icon: 'extension',
        path: 'app-extensions/discover',
        iconColor: 'brand-accent'
      }
    ]
  },
  {
    about: 'App Extensions for your app low tech integrations',
    options: [
      {
        label: 'Testing',
        icon: mdiTestTube,
        path: 'https://github.com/quasarframework/quasar-testing'
      },
      {
        label: 'Apollo GraphQL',
        icon: mdiGraphql,
        path: 'https://github.com/quasarframework/app-extension-apollo/tree/v2'
      },
      {
        label: 'SSG Mode',
        icon: mdiFileDownload,
        path: 'https://github.com/freddy38510/quasar-app-extension-ssg'
      },
      {
        label: 'All AEs',
        icon: 'extension',
        path: 'https://quasar.dev/app-extensions/discover',
        iconColor: 'brand-accent'
      }
    ]
  },
  {
    about: 'Our tools and resources that help you manage icons in your projects',
    options: [
      {
        label: 'Icon Genie',
        icon: 'stars',
        path: '/icongenie/installation',
        isInternal: true
      },
      {
        label: 'Icon Explorer',
        icon: 'search',
        path: 'https://iconexplorer.app'
      },
      {
        label: 'Extra SVG Icons',
        icon: mdiSvg,
        path: 'https://www.npmjs.com/package/quasar-extras-svg-icons'
      }
    ]
  }
]

export const integrationOptions = [
  {
    label: 'SPA',
    name: 'Single Page Application',
    icon: mdiApplicationOutline,
    path: 'quasar-cli/developing-spa/introduction'
  },
  {
    label: 'SSR',
    name: 'Server Side Rendering',
    icon: mdiServer,
    path: 'quasar-cli/developing-ssr/introduction'
  },
  {
    label: 'PWA',
    name: 'Progressive Web App',
    icon: 'web',
    path: 'quasar-cli/developing-pwa/introduction'
  },
  {
    label: 'HMA',
    name: 'Hybrid Mobile App',
    icon: 'phone_iphone',
    path: 'quasar-cli/developing-mobile-apps'
  },
  {
    label: 'BEX',
    name: 'Browser Extension',
    icon: mdiPuzzle,
    path: 'quasar-cli/developing-browser-extensions/introduction'
  },
  {
    label: 'MPDA',
    name: 'Multi Platform Desktop App',
    icon: mdiDevices,
    path: 'quasar-cli/developing-electron-apps/introduction'
  }
]
