import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'

import QPageContainer from './QPageContainer.js'

describe('[QPageContainer API]', () => {
  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Page container content'
        const layout = {
          header: { space: true, size: 64 },
          right: { space: true, size: 240 },
          footer: { space: true, size: 48 },
          left: { space: true, size: 200 }
        }
        const wrapper = mount(QPageContainer, {
          slots: {
            default: () => slotContent
          },
          global: {
            provide: {
              [layoutKey]: layout
            }
          }
        })

        expect(wrapper.text()).toBe(slotContent)
        expect(wrapper.attributes('style')).toContain(
          'padding: 64px 240px 48px 200px'
        )
      })
    })
  })
})
