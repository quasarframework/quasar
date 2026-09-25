import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, toValue } from 'vue'

import useMutation from './use-mutation.js'

enableAutoUnmount(afterEach)

// mounts a component observing a child element through a template ref;
// `options` (object, ref or getter) is merged in through a getter
function mountTarget(options) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        const target = ref(null)
        result = useMutation(() => ({ target, ...toValue(options) }))
        return () => h('div', [h('div', { ref: target }, 'target')])
      }
    })
  )

  return { wrapper, el: wrapper.element.firstElementChild, ...result }
}

// mutation records are delivered as a microtask
function deliver() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

describe('[useMutation API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        let result
        mount(
          defineComponent({
            setup() {
              result = useMutation()
              return () => h('div')
            }
          })
        )

        expect(result).toStrictEqual({
          mutationRecords: expect.$ref([]),
          stopMutation: expect.any(Function)
        })
      })

      test('observes the component root without a target', async () => {
        const onMutation = vi.fn()
        const wrapper = mount(
          defineComponent({
            setup() {
              useMutation({ onMutation })
              return () => h('div')
            }
          })
        )

        wrapper.element.dataset.x = '1'
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
        const [records] = onMutation.mock.calls[0]
        expect(records).toHaveLength(1)
        expect(records[0]).toBeInstanceOf(MutationRecord)
        expect(records[0].type).toBe('attributes')
        expect(records[0].target).toBe(wrapper.element)
      })

      test('does not observe a fragment root', async () => {
        const onMutation = vi.fn()
        let first
        mount(
          defineComponent({
            setup() {
              first = ref(null)
              useMutation({ onMutation })
              return () => [h('div', { ref: first }), h('div')]
            }
          })
        )

        first.value.dataset.x = '1'
        await deliver()

        expect(onMutation).not.toHaveBeenCalled()
      })

      test('observes every kind of change by default', async () => {
        const onMutation = vi.fn()
        const { el } = mountTarget({ onMutation })

        el.dataset.x = '1'
        el.firstChild.data = 'changed'
        el.append(document.createElement('span'))
        el.firstElementChild.dataset.y = '2'
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
        const types = onMutation.mock.calls[0][0].map(r => r.type)
        expect(types).toStrictEqual([
          'attributes',
          'characterData',
          'childList',
          'attributes'
        ])

        const [attr, text] = onMutation.mock.calls[0][0]
        expect(attr.oldValue).toBeNull()
        expect(text.oldValue).toBe('target')
      })

      test('observes only the given kinds of change', async () => {
        const onMutation = vi.fn()
        const { el } = mountTarget({ onMutation, childList: true })

        el.dataset.x = '1'
        el.append(document.createElement('span'))
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
        const [records] = onMutation.mock.calls[0]
        expect(records).toHaveLength(1)
        expect(records[0].type).toBe('childList')

        // subtree is off
        el.firstElementChild.append(document.createElement('i'))
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('passes an attributeFilter', async () => {
        const onMutation = vi.fn()
        const { el } = mountTarget({
          onMutation,
          attributes: true,
          attributeFilter: ['data-y']
        })

        el.dataset.x = '1'
        el.dataset.y = '2'
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
        const [records] = onMutation.mock.calls[0]
        expect(records).toHaveLength(1)
        expect(records[0].attributeName).toBe('data-y')
      })

      test('accepts a plain options object', async () => {
        const el = document.createElement('div')
        document.body.append(el)

        const onMutation = vi.fn()
        let result
        mount(
          defineComponent({
            setup() {
              result = useMutation({ target: el, onMutation })
              return () => h('div')
            }
          })
        )

        el.dataset.x = '1'
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()

        result.stopMutation()
        el.remove()
      })

      test('works outside of a component instance', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const el = document.createElement('div')
        document.body.append(el)

        const onMutation = vi.fn()
        const { stopMutation } = useMutation({ target: el, onMutation })

        el.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        stopMutation()
        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
        expect(warn).not.toHaveBeenCalled()

        el.remove()
        warn.mockRestore()
      })

      test('stops after the first delivery with once', async () => {
        const onMutation = vi.fn()
        const { el } = mountTarget({ onMutation, once: true })

        el.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('observes again when once goes away', async () => {
        const onMutation = vi.fn()
        const once = ref(true)
        const { el } = mountTarget(() => ({ onMutation, once: once.value }))

        el.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        once.value = false

        el.dataset.x = '3'
        await deliver()
        expect(onMutation).toHaveBeenCalledTimes(2)
      })

      test('stops for good when the handler returns false', async () => {
        const onMutation = vi.fn(() => false)
        const disabled = ref(false)
        const { el } = mountTarget(() => ({
          onMutation,
          disabled: disabled.value
        }))

        el.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        // a disabled round trip does not revive it
        disabled.value = true
        disabled.value = false

        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('pauses while disabled and resumes', async () => {
        const onMutation = vi.fn()
        const disabled = ref(false)
        const { el } = mountTarget(() => ({
          onMutation,
          disabled: disabled.value
        }))

        disabled.value = true
        el.dataset.x = '1'
        await deliver()
        expect(onMutation).not.toHaveBeenCalled()

        disabled.value = false
        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('a fired once stays off while disabled toggles', async () => {
        const onMutation = vi.fn()
        const disabled = ref(false)
        const { el } = mountTarget(() => ({
          onMutation,
          once: true,
          disabled: disabled.value
        }))

        el.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()

        disabled.value = true
        disabled.value = false

        el.dataset.x = '2'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('follows a target ref pointing to another element', async () => {
        const onMutation = vi.fn()
        let target
        const wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              useMutation({ target, onMutation })
              return () => h('div', [h('div', { ref: target }), h('div')])
            }
          })
        )
        const [first, second] = wrapper.element.children

        target.value = second

        first.dataset.x = '1'
        await deliver()
        expect(onMutation).not.toHaveBeenCalled()

        second.dataset.x = '1'
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
        expect(onMutation.mock.calls[0][0][0].target).toBe(second)
      })

      test('picks up a target that appears later', async () => {
        const show = ref(false)
        const onMutation = vi.fn()
        let target
        const wrapper = mount(
          defineComponent({
            setup() {
              target = ref(null)
              useMutation({ target, onMutation })
              return () =>
                h('div', [show.value ? h('div', { ref: target }) : null])
            }
          })
        )

        show.value = true
        await nextTick()

        wrapper.element.firstElementChild.dataset.x = '1'
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('swaps the onMutation handler while running', async () => {
        const first = vi.fn()
        const second = vi.fn()
        const onMutation = ref(first)
        const { el } = mountTarget(() => ({ onMutation: onMutation.value }))

        onMutation.value = second

        el.dataset.x = '1'
        await deliver()

        expect(first).not.toHaveBeenCalled()
        expect(second).toHaveBeenCalledOnce()
      })

      test('changing the observed kinds keeps the pending records', async () => {
        const onMutation = vi.fn()
        const childList = ref(true)
        const { el } = mountTarget(() => ({
          onMutation,
          childList: childList.value,
          attributes: true
        }))

        el.append(document.createElement('span'))
        childList.value = false
        await deliver()

        expect(onMutation).toHaveBeenCalledOnce()
        expect(onMutation.mock.calls[0][0][0].type).toBe('childList')

        el.append(document.createElement('span'))
        await deliver()
        expect(onMutation).toHaveBeenCalledOnce()
      })

      test('mutationRecords holds the last delivered batch', async () => {
        const { el, mutationRecords } = mountTarget()

        expect(mutationRecords.value).toStrictEqual([])

        el.dataset.x = '1'
        await deliver()

        expect(mutationRecords.value).toHaveLength(1)
        expect(mutationRecords.value[0].type).toBe('attributes')

        el.append(document.createElement('span'))
        await deliver()

        // the previous batch is replaced, not accumulated
        expect(mutationRecords.value).toHaveLength(1)
        expect(mutationRecords.value[0].type).toBe('childList')
      })

      test('mutationRecords is set before the handler runs', async () => {
        let seen
        const { el, mutationRecords } = mountTarget({
          onMutation(records) {
            seen = mutationRecords.value === records
          }
        })

        el.dataset.x = '1'
        await deliver()

        expect(seen).toBe(true)
      })

      test('stopMutation() ends the observation for good', async () => {
        const onMutation = vi.fn()
        const disabled = ref(false)
        const { el, stopMutation } = mountTarget(() => ({
          onMutation,
          disabled: disabled.value
        }))

        stopMutation()

        disabled.value = true
        disabled.value = false
        el.dataset.x = '1'
        await deliver()

        expect(onMutation).not.toHaveBeenCalled()
      })

      test('stops observing on unmount', async () => {
        // an element outliving the component
        const el = document.createElement('div')
        document.body.append(el)

        const onMutation = vi.fn()
        const wrapper = mount(
          defineComponent({
            setup() {
              useMutation({ target: el, onMutation })
              return () => h('div')
            }
          })
        )

        wrapper.unmount()

        el.dataset.x = '1'
        await deliver()

        expect(onMutation).not.toHaveBeenCalled()

        el.remove()
      })
    })
  })
})
