import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

import useSplitAttrs from './use-split-attrs.js'

describe('[useSplitAttrs API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test.each([
        ['no attrs', {}, []],
        ['attrs', { a: '1' }, []],
        ['listeners', {}, ['b']],
        ['attrs and listeners', { a: '1' }, ['b']],
        ['multiple attrs and listeners', { a: '1', b: '2' }, ['f1', 'f2']]
      ])('correctly splits: %s', (_, attrs, listeners) => {
        const attrHtml = Object.keys(attrs)
          .map(key => `${key}="${attrs[key]}"`)
          .join(' ')

        const fn = () => {}
        const fnList = {}
        const listenerHtml = listeners
          .map(key => {
            fnList['on' + key.toUpperCase()] = fn
            return `@${key}="fn"`
          })
          .join(' ')

        const ChildComponent = {
          name: 'ChildComponent',
          template: '<div />',
          setup() {
            const result = useSplitAttrs()
            return { result }
          }
        }

        const wrapper = mount(
          defineComponent({
            template: `<ChildComponent ${attrHtml} ${listenerHtml} />`,
            components: { ChildComponent },
            setup() {
              return { fn }
            }
          })
        )

        const target = wrapper.findComponent({ name: 'ChildComponent' })
        expect(target.vm.result).toStrictEqual({
          attributes: expect.$ref(attrs),
          listeners: expect.$ref(fnList)
        })
      })

      test('reflects an updated event handler after re-render (not the stale setup-time one)', async () => {
        const Child = defineComponent({
          name: 'Child',
          setup() {
            return { result: useSplitAttrs() }
          },
          render() {
            return h('div')
          }
        })
        const handler = ref(() => 'A')
        const wrapper = mount(
          defineComponent({
            setup() {
              return () => h(Child, { onFoo: handler.value })
            }
          })
        )
        const child = wrapper.findComponent({ name: 'Child' })

        expect(child.vm.result.listeners.value.onFoo()).toBe('A')

        handler.value = () => 'B'
        await nextTick()
        await nextTick()

        expect(child.vm.result.listeners.value.onFoo()).toBe('B')
      })
    })
  })
})
