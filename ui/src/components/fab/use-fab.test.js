import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import useFab, { useFabProps } from './use-fab.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
})

function mountFab(props = {}, showing = ref(false)) {
  let api

  wrapper = mount(
    defineComponent({
      props: useFabProps,
      setup(componentProps) {
        api = useFab(componentProps, showing)
        return () => h('div')
      }
    }),
    { props }
  )

  return { ...api, showing }
}

function getLabelClass(labelProps) {
  // the class entry is [ props.labelClass, '<generated classes>' ]
  return labelProps.data.class.at(-1)
}

describe('[useFab API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useFabProps]', () => {
      test('is defined correctly', () => {
        expect(useFabProps).$props()
      })

      test('only accepts the four label positions', () => {
        const { validator, default: defaultValue } = useFabProps.labelPosition

        expect(validator('top')).toBe(true)
        expect(validator('right')).toBe(true)
        expect(validator('bottom')).toBe(true)
        expect(validator('left')).toBe(true)
        expect(validator('center')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns the FAB rendering helpers', () => {
        expect(mountFab()).toMatchObject({
          formClass: expect.$ref(expect.any(String)),
          stacked: expect.$ref(expect.any(Boolean)),
          labelProps: expect.$ref(expect.any(Object))
        })
      })

      test.each([
        [false, 'q-fab--form-rounded'],
        [true, 'q-fab--form-square']
      ])('reflects the square prop being %s', (square, expected) => {
        const { formClass } = mountFab({ square })

        expect(formClass.value).toBe(expected)
      })

      test.each([
        ['top', true],
        ['bottom', true],
        ['left', false],
        ['right', false]
      ])('stacks an internal "%s" label: %s', (labelPosition, expected) => {
        const { stacked } = mountFab({ labelPosition })

        expect(stacked.value).toBe(expected)
      })

      test('never stacks an external label', () => {
        const { stacked } = mountFab({
          labelPosition: 'top',
          externalLabel: true
        })

        expect(stacked.value).toBe(false)
      })

      test.each([
        ['left', 'unshift'],
        ['top', 'unshift'],
        ['right', 'push'],
        ['bottom', 'push']
      ])(
        'inserts an internal "%s" label with "%s"',
        (labelPosition, action) => {
          const { labelProps } = mountFab({ labelPosition })

          expect(labelProps.value.action).toBe(action)
        }
      )

      test('always appends an external label', () => {
        const { labelProps } = mountFab({
          labelPosition: 'left',
          externalLabel: true
        })

        expect(labelProps.value.action).toBe('push')
      })

      test('marks an internal label with its position', () => {
        const { labelProps } = mountFab({ labelPosition: 'bottom' })
        const cls = getLabelClass(labelProps.value)

        expect(cls).toContain('q-fab__label--internal')
        expect(cls).toContain('q-fab__label--internal-bottom')
        expect(cls).not.toContain('q-fab__label--internal-hidden')
      })

      test('marks an external label with its position', () => {
        const { labelProps } = mountFab({
          labelPosition: 'bottom',
          externalLabel: true
        })
        const cls = getLabelClass(labelProps.value)

        expect(cls).toContain('q-fab__label--external')
        expect(cls).toContain('q-fab__label--external-bottom')
      })

      test('hides an internal label on demand', () => {
        const { labelProps } = mountFab({ hideLabel: true })

        expect(getLabelClass(labelProps.value)).toContain(
          'q-fab__label--internal-hidden'
        )
      })

      test('hides an external label on demand', () => {
        const { labelProps } = mountFab({
          externalLabel: true,
          hideLabel: true
        })

        expect(getLabelClass(labelProps.value)).toContain(
          'q-fab__label--external-hidden'
        )
      })

      test('ties a null hideLabel to the showing state of an external label', () => {
        const showing = ref(false)
        const { labelProps } = mountFab(
          { externalLabel: true, hideLabel: null },
          showing
        )

        expect(getLabelClass(labelProps.value)).toContain(
          'q-fab__label--external-hidden'
        )

        showing.value = true
        expect(getLabelClass(labelProps.value)).not.toContain(
          'q-fab__label--external-hidden'
        )
      })

      test('forwards the custom label class and style', () => {
        const labelStyle = { color: 'red' }
        const { labelProps } = mountFab({
          labelClass: 'my-label',
          labelStyle
        })

        expect(labelProps.value.data.class).toContain('my-label')
        expect(labelProps.value.data.style).toStrictEqual(labelStyle)
      })

      test('reacts to the props being changed', async () => {
        const { labelProps, stacked } = mountFab({ labelPosition: 'right' })

        expect(stacked.value).toBe(false)

        await wrapper.setProps({ labelPosition: 'top' })

        expect(stacked.value).toBe(true)
        expect(labelProps.value.action).toBe('unshift')
      })
    })
  })
})
