import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent } from 'vue'

import useBtn, {
  btnDesignOptions,
  btnPadding,
  defaultSizes,
  getBtnDesign,
  getBtnDesignAttr,
  nonRoundBtnProps,
  useBtnProps
} from './use-btn.js'

describe('[useBtn API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)btnPadding]', () => {
      test('is defined correctly', () => {
        expect(btnPadding).toBeTypeOf('object')
        expect(Object.keys(btnPadding)).not.toHaveLength(0)
      })
    })

    describe('[(variable)defaultSizes]', () => {
      test('is defined correctly', () => {
        expect(defaultSizes).toBeTypeOf('object')
        expect(Object.keys(defaultSizes)).not.toHaveLength(0)
      })
    })

    describe('[(variable)btnDesignOptions]', () => {
      test('is defined correctly', () => {
        expect(btnDesignOptions).toBeTypeOf('object')
        expect(Object.keys(btnDesignOptions)).not.toHaveLength(0)
      })
    })

    describe('[(variable)useBtnProps]', () => {
      test('is defined correctly', () => {
        expect(useBtnProps).$props()
      })
    })

    describe('[(variable)nonRoundBtnProps]', () => {
      test('is defined correctly', () => {
        expect(nonRoundBtnProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const wrapper = mount(
          defineComponent({
            template: '<div />',
            setup() {
              const result = useBtn({})
              return { result }
            }
          })
        )

        expect(wrapper.vm.result).toStrictEqual({
          classes: expect.$ref(expect.any(String)),
          style: expect.$ref(expect.any(Object)),
          innerClasses: expect.$ref(expect.any(String)),
          attributes: expect.$ref(expect.any(Object)),
          hasLink: expect.$ref(expect.any(Boolean)),
          linkTag: expect.$ref(expect.any(String)),
          navigateOnClick: expect.any(Function),
          isActionable: expect.$ref(expect.any(Boolean))
        })
      })
    })

    describe('[(function)getBtnDesign]', () => {
      test('returns correctly with single value', () => {
        for (const prop of btnDesignOptions) {
          expect(getBtnDesign({ [prop]: true })).toBe(prop)

          expect(getBtnDesign({ [prop]: true }, 'default')).toBe(prop)

          expect(getBtnDesign({ [prop]: false })).toBeUndefined()

          expect(getBtnDesign({ [prop]: false }, 'default')).toBe('default')
        }
      })

      test('returns correctly with multiple values', () => {
        for (const prop of btnDesignOptions) {
          const propMap = btnDesignOptions.reduce((acc, val) => {
            if (val !== prop) {
              acc[val] = true
            }

            return acc
          }, {})

          expect(getBtnDesign(propMap)).not.toBe(prop)

          expect(getBtnDesign(propMap, 'default')).not.toBe('default')
        }
      })
    })

    describe('[(function)getBtnDesignAttr]', () => {
      test('has correct return value', () => {
        expect(getBtnDesignAttr({})).toStrictEqual({})

        expect(getBtnDesignAttr({ something: true })).toStrictEqual({})

        for (const prop of btnDesignOptions) {
          expect(getBtnDesignAttr({ [prop]: true })).toStrictEqual({
            [prop]: true
          })

          expect(getBtnDesignAttr({ [prop]: false })).toStrictEqual({})
        }
      })
    })
  })
})
