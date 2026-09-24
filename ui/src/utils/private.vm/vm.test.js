import { describe, expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { Fragment, getCurrentInstance, h, ref } from 'vue'

import {
  getNormalizedVNodes,
  getParentProxy,
  getTargetElement,
  vmHasRouter,
  vmIsDestroyed
} from './vm.js'

import { getRouter } from 'testing/runtime/router.js'

describe('[vm API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getParentProxy]', () => {
      test('has correct return value', () => {
        let childVm, parentVm

        const ChildComponent = {
          render: () => h('div'),
          setup() {
            childVm = getCurrentInstance()
            return {}
          }
        }

        mount({
          render: () => h('div', [h(ChildComponent)]),
          setup() {
            parentVm = getCurrentInstance()
            return {}
          }
        })

        expect(getParentProxy(childVm.proxy)).toBe(parentVm.proxy)
      })

      test('handles complex hierarchy', async () => {
        let childVm, parentVm

        const ChildComponent = {
          render: () => h('div'),
          setup() {
            childVm = getCurrentInstance()
            return {}
          }
        }

        const IntermediateComponent = {
          render: () => h('div', [h(ChildComponent)])
        }

        mount({
          render: () => h('div', [h(IntermediateComponent)]),
          setup() {
            parentVm = getCurrentInstance()
            return {}
          }
        })

        await flushPromises()

        expect(getParentProxy(getParentProxy(childVm.proxy))).toBe(
          parentVm.proxy
        )
      })
    })

    describe('[(function)getNormalizedVNodes]', () => {
      test('has correct return value', () => {
        let vnodes

        const ParentComponent = {
          setup(_, { slots }) {
            return () => {
              vnodes = getNormalizedVNodes(slots.default())
              return h('div', {}, vnodes)
            }
          }
        }

        const ChildComponent = {
          render: () =>
            h('div', [
              h('div', 'Simple'),
              h(
                Fragment,
                [1, 2].map(n => h('div', { key: n }, `Child ${n}`))
              )
            ])
        }

        mount({
          render: () =>
            h(ParentComponent, null, {
              default: () => [
                h(ChildComponent),
                h(
                  Fragment,
                  [1, 2].map(n => h(ChildComponent, { key: n }))
                )
              ]
            })
        })

        expect(vnodes).toBeDefined()
        expect(vnodes).toHaveLength(3)
      })
    })

    describe('[(function)vmHasRouter]', () => {
      test('returns correctly with no router', () => {
        let vm

        mount({
          render: () => h('div'),
          setup() {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(vmHasRouter(vm)).toBe(false)
      })

      test('returns correctly with router', async () => {
        let vm
        const router = await getRouter('/route')

        mount(
          {
            render: () => h('div'),
            setup() {
              vm = getCurrentInstance()
              return {}
            }
          },
          {
            global: {
              plugins: [router]
            }
          }
        )

        expect(vmHasRouter(vm)).toBe(true)
      })
    })

    describe('[(function)vmIsDestroyed]', () => {
      test('has correct return value', () => {
        let vm

        const wrapper = mount({
          render: () => h('div'),
          setup() {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(vmIsDestroyed(vm)).toBe(false)
        wrapper.unmount()
        expect(vmIsDestroyed(vm)).toBe(true)
      })
    })

    describe('[(function)getTargetElement]', () => {
      test('resolves an element, a ref and a getter', () => {
        const el = document.createElement('div')

        expect(getTargetElement(el, null)).toBe(el)
        expect(getTargetElement(ref(el), null)).toBe(el)
        expect(getTargetElement(() => el, null)).toBe(el)
      })

      test('resolves a component instance to its root element', () => {
        const wrapper = mount({ render: () => h('div') })

        expect(getTargetElement(wrapper.vm, null)).toBe(wrapper.element)
        expect(getTargetElement(ref(wrapper.vm), null)).toBe(wrapper.element)
      })

      test('falls back to the root element of the given instance', () => {
        let vm

        const wrapper = mount({
          render: () => h('div'),
          setup() {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(getTargetElement(void 0, vm)).toBe(wrapper.element)
        expect(getTargetElement(void 0, null)).toBeNull()
      })

      test('has no element for an empty target or a fragment root', () => {
        let vm

        mount({
          render: () => [h('div'), h('div')],
          setup() {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(getTargetElement(void 0, vm)).toBeNull()
        expect(getTargetElement(null, vm)).toBeNull()
        expect(getTargetElement(ref(null), vm)).toBeNull()
        expect(getTargetElement(document.createTextNode(''), vm)).toBeNull()
      })
    })
  })
})
