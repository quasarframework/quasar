import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'

import useQuasar from './use-quasar.js'
import { createChildApp } from '../../install-quasar.js'
import { quasarKey } from '../../utils/private.symbols/symbols.js'

function mountWithQuasar() {
  return mount(
    defineComponent({
      render: () => h('div'),
      setup() {
        return { result: useQuasar(), injected: inject(quasarKey) }
      }
    })
  )
}

describe('[useQuasar API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const wrapper = mount(
          defineComponent({
            render: () => h('div'),
            setup() {
              const result = useQuasar()
              return { result }
            }
          })
        )

        expect(wrapper.vm.result).toBeTypeOf('object')

        expect(Object.keys(wrapper.vm.result)).not.toHaveLength(0)

        expect(wrapper.vm.result.version).toMatch(/^\d+\.\d+\.\d+$/)
      })

      test('returns the very object that installQuasar() registered', () => {
        const wrapper = mountWithQuasar()

        // installQuasar() registers $q as an app provide AND as a global
        // property; whichever one the implementation reads, the three must
        // stay the same object
        expect(wrapper.vm.result).toBe(wrapper.vm.injected)
        expect(wrapper.vm.result).toBe(wrapper.vm.$q)
      })

      test('resolves a separate $q for each app', () => {
        const first = mountWithQuasar()
        const second = mountWithQuasar()

        expect(first.vm.result).toBeTypeOf('object')
        expect(second.vm.result).toBeTypeOf('object')
        expect(first.vm.result).not.toBe(second.vm.result)
      })

      test('can be called through app.runWithContext()', () => {
        const wrapper = mountWithQuasar()
        const app = wrapper.vm.$.appContext.app

        // no current component instance here — the path a boot file takes,
        // and what the inject() fallback exists for
        expect(app.runWithContext(() => useQuasar())).toBe(wrapper.vm.result)
      })

      test('resolves inside a child app, as the plugins mount theirs', () => {
        const parent = mountWithQuasar()
        const el = document.createElement('div')
        document.body.append(el)

        let result

        const child = createChildApp(
          defineComponent({
            render: () => h('div'),
            setup() {
              result = useQuasar()
            }
          }),
          parent.vm.$.appContext.app
        )

        child.mount(el)

        expect(result).toBe(parent.vm.result)

        child.unmount()
        el.remove()
      })
    })
  })
})
