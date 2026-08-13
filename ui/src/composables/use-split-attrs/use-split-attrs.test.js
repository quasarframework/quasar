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
        const fn = () => {}
        const fnList = {}
        listeners.forEach(key => {
          fnList['on' + key.toUpperCase()] = fn
        })

        const ChildComponent = {
          name: 'ChildComponent',
          setup() {
            const result = useSplitAttrs()
            return { result }
          },
          render: () => h('div')
        }

        const wrapper = mount(
          defineComponent({
            setup() {
              return () => h(ChildComponent, { ...attrs, ...fnList })
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

      test('keeps the same objects across a re-render with unchanged attrs', async () => {
        // reference stability is the contract that lets consumers'
        // computeds (which spread these maps) skip recomputation on
        // re-renders where the attrs did not actually change
        const Child = defineComponent({
          name: 'Child',
          setup() {
            return { result: useSplitAttrs() }
          },
          render() {
            return h('div')
          }
        })
        const tick = ref(0)
        const onFoo = () => {}
        const wrapper = mount(
          defineComponent({
            setup() {
              return () =>
                h('div', { 'data-tick': tick.value }, [
                  h(Child, { 'data-x': '1', onFoo })
                ])
            }
          })
        )
        const child = wrapper.findComponent({ name: 'Child' })

        const attributes = child.vm.result.attributes.value
        const listeners = child.vm.result.listeners.value
        expect(attributes).toStrictEqual({ 'data-x': '1' })
        expect(listeners).toStrictEqual({ onFoo })

        tick.value++
        await nextTick()
        await nextTick()

        expect(child.vm.result.attributes.value).toBe(attributes)
        expect(child.vm.result.listeners.value).toBe(listeners)
      })
    })
  })
})
