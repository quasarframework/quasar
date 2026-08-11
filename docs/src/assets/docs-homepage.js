import {
  mdiAnimation,
  mdiApplicationExport,
  mdiCalendar,
  mdiCardMultiple,
  mdiFormDropdown,
  mdiFormTextbox,
  mdiHumanMaleBoard,
  mdiImageSizeSelectSmall,
  mdiTable
} from '@quasar/extras/mdi-v7'

export const mostUsedPages = [
  {
    name: 'QTable',
    icon: mdiTable,
    path: '/vue-components/table'
  },
  {
    name: 'QInput',
    icon: mdiFormTextbox,
    path: '/vue-components/input'
  },
  {
    name: 'QSelect',
    icon: mdiFormDropdown,
    path: '/vue-components/select'
  },
  {
    name: 'QBtn',
    icon: 'img:/svg/button-click.svg',
    path: '/vue-components/button'
  },
  {
    name: 'QCard',
    icon: mdiCardMultiple,
    path: '/vue-components/card'
  },
  {
    name: 'Flavour',
    icon: 'img:/logo/logo-mono-cyan.svg',
    path: '/start/pick-quasar-flavour'
  }
]

export const pagesToDiscover = [
  {
    name: 'quasar.config',
    icon: mdiHumanMaleBoard,
    path: '/quasar-cli-vite/quasar-config-file'
  },
  {
    name: 'Boot Files',
    icon: mdiApplicationExport,
    path: '/quasar-cli-vite/boot-files'
  },
  {
    name: 'Date Utils',
    icon: mdiCalendar,
    path: '/quasar-utils/date-utils'
  },
  {
    name: 'Other Utils',
    icon: 'healing',
    path: '/quasar-utils/other-utils'
  },
  {
    name: 'Flexbox',
    icon: mdiImageSizeSelectSmall,
    path: '/layout/grid/introduction-to-flexbox'
  },
  {
    name: 'Animations',
    icon: mdiAnimation,
    path: '/options/animations'
  }
]
