import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { KeepAlive, defineComponent, h, nextTick, ref } from 'vue'

import { clientList } from '../../plugins/meta/Meta.js'
import createMetaMixin from './create-meta-mixin.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  clientList.length = 0
})

function mountWithMeta(metaOptions, componentOptions = {}) {
  wrapper = mount(
    defineComponent({
      mixins: [createMetaMixin(metaOptions)],
      ...componentOptions,
      render: componentOptions.render || (() => h('div'))
    })
  )

  return wrapper
}

describe('[createMetaMixin API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns a mixin with the lifecycle hooks it needs', () => {
        expect(createMetaMixin({ title: 'Home' })).toMatchObject({
          created: expect.any(Function),
          activated: expect.any(Function),
          deactivated: expect.any(Function),
          unmounted: expect.any(Function)
        })
      })

      test('registers a static meta entry while the component is mounted', () => {
        const meta = { title: 'Home' }

        mountWithMeta(meta)

        expect(clientList).toStrictEqual([{ active: true, val: meta }])
      })

      test('unregisters the entry when the component is destroyed', () => {
        mountWithMeta({ title: 'Home' })

        wrapper.unmount()
        wrapper = void 0

        expect(clientList).toHaveLength(0)
      })

      test('only removes its own entry', () => {
        const foreign = { active: true, val: { title: 'Other' } }
        clientList.push(foreign)

        mountWithMeta({ title: 'Home' })
        expect(clientList).toHaveLength(2)

        wrapper.unmount()
        wrapper = void 0

        expect(clientList).toStrictEqual([foreign])
      })

      test('adds a computed meta entry when given a function', () => {
        mountWithMeta(
          function metaFn() {
            return { title: `Title for ${this.name}` }
          },
          {
            data: () => ({ name: 'Home' })
          }
        )

        expect(clientList).toStrictEqual([
          { active: true, val: { title: 'Title for Home' } }
        ])
      })

      test('falls back to an empty entry when the function returns nothing', () => {
        mountWithMeta(() => void 0)

        expect(clientList).toStrictEqual([{ active: true, val: {} }])
      })

      test('keeps a computed meta entry in sync with its dependencies', async () => {
        mountWithMeta(
          function metaFn() {
            return { title: this.title }
          },
          { data: () => ({ title: 'Home' }) }
        )

        wrapper.vm.title = 'About'
        await nextTick()

        expect(clientList[0].val).toStrictEqual({ title: 'About' })
      })

      test('deactivates and reactivates along with a kept-alive component', async () => {
        const show = ref(true)
        const Child = defineComponent({
          mixins: [createMetaMixin({ title: 'Home' })],
          render: () => h('div')
        })

        wrapper = mount(
          defineComponent({
            render: () => h(KeepAlive, null, [show.value ? h(Child) : null])
          })
        )

        expect(clientList[0].active).toBe(true)

        show.value = false
        await nextTick()
        expect(clientList[0].active).toBe(false)

        show.value = true
        await nextTick()
        expect(clientList[0].active).toBe(true)
      })
    })
  })
})
