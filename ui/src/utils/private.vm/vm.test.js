import { describe, test, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h, getCurrentInstance } from 'vue'

import { getParentProxy, getNormalizedVNodes, vmHasRouter, vmIsDestroyed } from './vm.js'

import { getRouter } from 'testing/runtime/router.js'

describe('[vm API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getParentProxy]', () => {
      test('has correct return value', () => {
        let childVm, parentVm

        const ChildComponent = {
          template: '<div />',
          setup () {
            childVm = getCurrentInstance()
            return {}
          }
        }

        mount({
          template: '<div> <ChildComponent /> </div>',
          components: {
            ChildComponent
          },
          setup () {
            parentVm = getCurrentInstance()
            return {}
          }
        })

        expect(
          getParentProxy(childVm.proxy)
        ).toBe(parentVm.proxy)
      })

      test('handles complex hierarchy', async () => {
        let childVm, parentVm

        const ChildComponent = {
          template: '<div />',
          setup () {
            childVm = getCurrentInstance()
            return {}
          }
        }

        const IntermediateComponent = {
          template: '<div> <ChildComponent /> </div>',
          components: {
            ChildComponent
          }
        }

        mount({
          template: '<div> <IntermediateComponent /> </div>',
          components: {
            IntermediateComponent
          },
          setup () {
            parentVm = getCurrentInstance()
            return {}
          }
        })

        await flushPromises()

        expect(
          getParentProxy(
            getParentProxy(childVm.proxy)
          )
        ).toBe(parentVm.proxy)
      })
    })

    describe('[(function)getNormalizedVNodes]', () => {
      test('has correct return value', () => {
        let vnodes

        const ParentComponent = {
          setup (_, { slots }) {
            return () => {
              vnodes = getNormalizedVNodes(slots.default())
              return h('div', {}, vnodes)
            }
          }
        }

        const ChildComponent = {
          template: `
            <div>
              <div>Simple</div>
              <div v-for="n in 2" :key="n">Child {{ n }}</div>
            </div>
          `
        }

        mount({
          template: `
            <ParentComponent>
              <ChildComponent />
              <ChildComponent v-for="n in 2" :key="n" />
            </ParentComponent>
          `,
          components: {
            ParentComponent,
            ChildComponent
          }
        })

        expect(vnodes).toBeDefined()
        expect(vnodes).toHaveLength(3)
      })
    })

    describe('[(function)vmHasRouter]', () => {
      test('returns correctly with no router', () => {
        let vm

        mount({
          template: '<div />',
          setup () {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(
          vmHasRouter(vm)
        ).toBe(false)
      })

      test('returns correctly with router', async () => {
        let vm
        const router = await getRouter('/route')

        mount({
          template: '<div />',
          setup () {
            vm = getCurrentInstance()
            return {}
          }
        }, {
          global: {
            plugins: [ router ]
          }
        })

        expect(
          vmHasRouter(vm)
        ).toBe(true)
      })
    })

    describe('[(function)vmIsDestroyed]', () => {
      test('has correct return value', () => {
        let vm

        const wrapper = mount({
          template: '<div />',
          setup () {
            vm = getCurrentInstance()
            return {}
          }
        })

        expect(vmIsDestroyed(vm)).toBe(false)
        wrapper.unmount()
        expect(vmIsDestroyed(vm)).toBe(true)
      })
    })
  })
})
