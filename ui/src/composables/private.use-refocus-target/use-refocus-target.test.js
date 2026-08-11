import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'

import useRefocusTarget from './use-refocus-target.js'

describe('[useRefocusTarget API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('renders and focuses the appropriate refocus target', async () => {
        const props = reactive({ disable: false })
        const rootRef = ref(null)
        const mountTarget = document.createElement('div')
        let result

        document.body.append(mountTarget)

        const wrapper = mount(
          defineComponent({
            setup() {
              result = useRefocusTarget(props, rootRef)

              return () =>
                h(
                  'div',
                  {
                    ref: rootRef,
                    tabindex: -1
                  },
                  [result.refocusTargetEl.value]
                )
            }
          }),
          { attachTo: mountTarget }
        )

        const root = wrapper.element
        const target = wrapper.get('span').element
        const rootFocus = vi.spyOn(root, 'focus')
        const targetFocus = vi.spyOn(target, 'focus')

        target.focus()
        rootFocus.mockClear()
        targetFocus.mockClear()

        result.refocusTarget({ type: 'keydown' })

        expect(rootFocus).toHaveBeenCalledOnce()
        expect(targetFocus).not.toHaveBeenCalled()

        result.refocusTarget({
          type: 'click',
          target: root
        })

        expect(targetFocus).toHaveBeenCalledOnce()

        targetFocus.mockClear()

        result.refocusTarget({
          type: 'click',
          target: mountTarget
        })

        expect(targetFocus).not.toHaveBeenCalled()

        rootFocus.mockClear()
        targetFocus.mockClear()

        result.refocusTarget({
          type: 'keydown',
          qAvoidFocus: true
        })

        expect(rootFocus).not.toHaveBeenCalled()
        expect(targetFocus).not.toHaveBeenCalled()

        props.disable = true
        await nextTick()

        expect(result.refocusTargetEl.value).toBeNull()
        expect(wrapper.find('span').exists()).toBe(false)

        wrapper.unmount()
        mountTarget.remove()
      })
    })
  })
})
