import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

// the fixture image at vite-plugin/playground/src/assets/logo.png,
// as the transformed asset URL
const logoAsset = '/playground/src/assets/logo.png'

describe('Asset Transform', () => {
  test.each([
    ['NativeImage'],
    ['ImgWithSrc'],
    ['ImgWithPlaceholderSrc'],
    ['ChatMessageWithAvatar']
  ])('transforms %s', async filename => {
    const { default: TestComponent } = await import(
      `@/components/asset-transform/${filename}.vue`
    )
    const wrapper = mount(TestComponent)

    expect(wrapper.get('img').attributes('src')).toBe(logoAsset)
  })
})
