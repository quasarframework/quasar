import { describe, test, expect } from 'vitest'

import useTransition, { useTransitionProps } from './use-transition.js'

describe('[useTransition API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useTransitionProps]', () => {
      test('is defined correctly', () => {
        expect(useTransitionProps).toBeTypeOf('object')
        expect(Object.keys(useTransitionProps)).not.toHaveLength(0)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        expect(
          useTransition({})
        ).toStrictEqual({
          transitionStyle: expect.$ref(
            expect.any(String)
          ),

          transitionProps: expect.$ref({
            appear: expect.any(Boolean),

            enterFromClass: expect.any(String),
            enterActiveClass: expect.any(String),
            enterToClass: expect.any(String),

            leaveFromClass: expect.any(String),
            leaveActiveClass: expect.any(String),
            leaveToClass: expect.any(String)
          })
        })
      })

      test('props.transitionDuration is handled correctly', () => {
        const { transitionStyle } = useTransition({
          transitionDuration: 555
        })

        expect(
          transitionStyle.value
        ).toMatch(/555ms/)
      })

      test('props.transitionShow is handled correctly', () => {
        const { transitionProps } = useTransition({
          transitionShow: 'some-transition'
        })

        expect(
          transitionProps.value
        ).toMatchObject({
          enterFromClass: 'q-transition--some-transition-enter-from',
          enterActiveClass: 'q-transition--some-transition-enter-active',
          enterToClass: 'q-transition--some-transition-enter-to'
        })
      })

      test('props.transitionHide is handled correctly', () => {
        const { transitionProps } = useTransition({
          transitionHide: 'some-transition'
        })

        expect(
          transitionProps.value
        ).toMatchObject({
          leaveFromClass: 'q-transition--some-transition-leave-from',
          leaveActiveClass: 'q-transition--some-transition-leave-active',
          leaveToClass: 'q-transition--some-transition-leave-to'
        })
      })

      test('defaultShowFn + defaultHideFn is handled correctly', () => {
        const { transitionProps } = useTransition(
          {},
          () => 'show',
          () => 'hide'
        )

        expect(
          transitionProps.value
        ).toMatchObject({
          enterFromClass: 'q-transition--show-enter-from',
          enterActiveClass: 'q-transition--show-enter-active',
          enterToClass: 'q-transition--show-enter-to',

          leaveFromClass: 'q-transition--hide-leave-from',
          leaveActiveClass: 'q-transition--hide-leave-active',
          leaveToClass: 'q-transition--hide-leave-to'
        })
      })

      test('props.transitionShow & props.transitionHide are handled correctly with defaultShowFn + defaultHideFn too', () => {
        const { transitionProps } = useTransition(
          { transitionShow: 'show', transitionHide: 'hide' },
          () => 'X',
          () => 'Y'
        )

        expect(
          transitionProps.value
        ).toMatchObject({
          enterFromClass: 'q-transition--show-enter-from',
          enterActiveClass: 'q-transition--show-enter-active',
          enterToClass: 'q-transition--show-enter-to',

          leaveFromClass: 'q-transition--hide-leave-from',
          leaveActiveClass: 'q-transition--hide-leave-active',
          leaveToClass: 'q-transition--hide-leave-to'
        })
      })
    })
  })
})
