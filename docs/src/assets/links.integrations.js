import {
  mdiAndroid,
  mdiApple,
  mdiAppleSafari, mdiApplicationOutline,
  mdiCalendar,
  mdiDevices,
  mdiFileDownload, mdiFirefox, mdiGraphql,
  mdiLanguageMarkdown, mdiLinux, mdiMagnify, mdiMicrosoftEdge,
  mdiMicrosoftWindows, mdiPuzzle,
  mdiServer, mdiStarCircle, mdiSvg,
  mdiTelevisionPlay,
  mdiTestTube
} from '@quasar/extras/mdi-v6'

export const platformIcons = [
  'img:https://cdn.quasar.dev/img/custom-svg-icons/chrome.svg',
  mdiAppleSafari,
  mdiFirefox,
  mdiMicrosoftEdge,
  mdiLinux,
  mdiMicrosoftWindows,
  mdiApple,
  mdiAndroid
]

export const buildTargets = [
  {
    label: 'SPA',
    name: 'Single Page Application',
    icon: mdiApplicationOutline,
    path: '/quasar-cli-vite/developing-spa/introduction'
  },
  {
    label: 'SSR',
    name: 'Server Side Rendering',
    icon: mdiServer,
    path: '/quasar-cli-vite/developing-ssr/introduction'
  },
  {
    label: 'PWA',
    name: 'Progressive Web App',
    icon: 'web',
    path: '/quasar-cli-vite/developing-pwa/introduction'
  },
  {
    label: 'HMA',
    name: 'Hybrid Mobile App',
    icon: 'phone_iphone',
    path: '/quasar-cli-vite/developing-mobile-apps'
  },
  {
    label: 'BEX',
    name: 'Browser Extension',
    icon: mdiPuzzle,
    path: '/quasar-cli-vite/developing-browser-extensions/introduction'
  },
  {
    label: 'MPDA',
    name: 'Multi Platform Desktop App',
    icon: mdiDevices,
    path: '/quasar-cli-vite/developing-electron-apps/introduction'
  }
]

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
        icon: mdiTelevisionPlay,
        path: 'https://github.com/quasarframework/app-extension-qmediaplayer'
      },
      {
        label: 'All AEs',
        icon: mdiPuzzle,
        path: '/app-extensions/discover',
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
        icon: mdiPuzzle,
        path: 'https://www.npmjs.com/search?q=quasar-app-extension',
        iconColor: 'brand-accent'
      }
    ]
  },
  {
    about: 'Our tools and resources that help you manage icons in your projects',
    options: [
      {
        label: 'Icon Genie',
        icon: mdiStarCircle,
        path: '/icongenie/installation',
        isInternal: true
      },
      {
        label: 'Icon Explorer',
        icon: mdiMagnify,
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
