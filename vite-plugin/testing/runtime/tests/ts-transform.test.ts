import { describe, expect, test, vi } from 'vitest'

import { QBtn, ClosePopup, AddressbarColor, colors } from 'quasar'

vi.mock('../../../../ui/src/components/btn/QBtn.js', () => {
  return {
    default: { component: true }
  }
})

vi.mock('../../../../ui/src/directives/close-popup/ClosePopup.js', () => {
  return {
    default: { directive: true }
  }
})

vi.mock('../../../../ui/src/plugins/addressbar/AddressbarColor.js', () => {
  return {
    default: { plugin: true }
  }
})

vi.mock('../../../../ui/src/utils/colors/colors.js', () => {
  return {
    default: { utility: true }
  }
})

describe('JS Transformations', () => {
  test('a component', async () => {
    expect(QBtn).toStrictEqual({ component: true })
  })

  test('a directive', async () => {
    expect(ClosePopup).toStrictEqual({ directive: true })
  })

  test('a plugin', async () => {
    expect(AddressbarColor).toStrictEqual({ plugin: true })
  })

  test('a utility', async () => {
    expect(colors).toStrictEqual({ utility: true })
  })
})
