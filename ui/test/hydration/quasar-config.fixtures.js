import { h } from 'vue'

import { QCard, QCardSection, QPagination } from 'quasar'
import langHe from 'quasar/lang/he.js'

// Cross-cutting Quasar-config axis: dark mode plus an RTL language,
// applied identically to the server and client passes through the
// `quasarOptions` module export. Component-specific state stays in the
// colocated src fixtures; this module only covers config-driven render
// divergence.

export const quasarOptions = {
  config: { dark: true },
  lang: langHe
}

export const darkCard = {
  render: () => h(QCard, {}, () => [h(QCardSection, {}, () => 'Dark card')])
}

export const rtlPagination = {
  render: () =>
    h(QPagination, { modelValue: 1, max: 5, 'onUpdate:modelValue': () => {} })
}
