import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, test, vi } from 'vitest'

import { uploaderKey } from '../../utils/private.symbols/symbols.js'
import QUploaderAddTrigger from './QUploaderAddTrigger.js'

describe('[QUploaderAddTrigger API]', () => {
  describe('[Generic]', () => {
    test('should not throw error on render', () => {
      const renderTrigger = vi.fn(() =>
        h('button', { class: 'add-files' }, 'Add files')
      )
      const wrapper = mount(QUploaderAddTrigger, {
        global: {
          provide: {
            [uploaderKey]: renderTrigger
          }
        }
      })

      expect(renderTrigger).toHaveBeenCalledTimes(1)
      expect(wrapper.get('button.add-files').text()).toBe('Add files')
    })
  })
})
