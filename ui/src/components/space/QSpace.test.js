import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QSpace from './QSpace.js'

describe('[QSpace API]', () => {
  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const wrapper = mount(QSpace)

      expect(
        wrapper.get('div.q-space')
          .exists()
      ).toBe(true)
    })
  })
})
