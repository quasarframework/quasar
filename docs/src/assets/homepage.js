import {
  mdiAnimation,
  mdiApplicationExport,
  mdiCalendar,
  mdiCardMultiple,
  mdiFormDropdown,
  mdiFormTextbox,
  mdiImageSizeSelectSmall,
  mdiTable,
  mdiHumanMaleBoard
} from '@quasar/extras/mdi-v6'

export const mostUsedPages = [
  {
    label: 'QTable',
    icon: mdiTable,
    path: '/vue-components/table'
  },
  {
    label: 'QInput',
    icon: mdiFormTextbox,
    path: '/vue-components/input'
  },
  {
    label: 'QSelect',
    icon: mdiFormDropdown,
    path: '/vue-components/select'
  },
  {
    label: 'QBtn',
    img: '/custom-svg-icons/button-click.svg',
    path: '/vue-components/button'
  },
  {
    label: 'QCard',
    icon: mdiCardMultiple,
    path: '/vue-components/card'
  },
  {
    label: 'Flavour',
    img: 'https://cdn.quasar.dev/logo-v2/svg/logo-mono-cyan.svg',
    path: '/start/pick-quasar-flavour'
  }
]
export const pagesToDiscover = [
  {
    label: 'quasar.config',
    icon: mdiHumanMaleBoard,
    path: '/quasar-cli-webpack/quasar-config-js'
  },
  {
    label: 'Boot Files',
    icon: mdiApplicationExport,
    path: '/quasar-cli-vite/boot-files'
  },
  {
    label: 'Date Utils',
    icon: mdiCalendar,
    path: '/quasar-utils/date-utils'
  },
  {
    label: 'Other Utils',
    icon: 'healing',
    path: '/quasar-utils/other-utils'
  },
  {
    label: 'Flexbox',
    icon: mdiImageSizeSelectSmall,
    path: '/layout/grid/introduction-to-flexbox'
  },
  {
    label: 'Animations',
    icon: mdiAnimation,
    path: '/options/animations'
  }
]
