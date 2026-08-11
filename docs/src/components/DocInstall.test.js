import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocInstall from './DocInstall.vue'

test('components need no manual step under the Quasar CLI tab', async () => {
  const html = await renderComponent(DocInstall, { components: 'QBtn' })

  expect(html).toContain('id="installation"')
  for (const tab of ['Quasar CLI', 'Vite plugin', 'UMD']) {
    expect(html).toContain(tab)
  }
  // the active (CLI) tab: components auto-install, so the snippet
  // says so instead of listing them
  expect(html).toContain('No installation step is necessary')
})

test('plugins render a quasar.config registration snippet', async () => {
  const html = await renderComponent(DocInstall, { plugins: 'Notify' })

  expect(html).toContain('Notify')
})
