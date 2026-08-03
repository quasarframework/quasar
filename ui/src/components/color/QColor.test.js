import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QColor from './QColor.js'

function mountColor(props = {}) {
  return mount(QColor, {
    props: {
      modelValue: '#ff0000',
      ...props
    }
  })
}

function getHeaderInput(wrapper) {
  return wrapper.get('.q-color-picker__header-banner input')
}

function getPaletteCubes(wrapper) {
  return wrapper.findAll('.q-color-picker__cube')
}

function getHeaderTabLabels(wrapper) {
  return wrapper
    .findAll('.q-color-picker__header-tabs .q-tab__label')
    .map(tab => tab.text())
}

/**
 * Picking a palette color is the shortest path to a model update
 * that does not depend on any DOM measurement.
 */
async function pickFirstPaletteColor(wrapper) {
  await getPaletteCubes(wrapper)[0].trigger('click')
}

describe('[QColor API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountColor()

        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.setProps({ name: propVal })

        const input = wrapper.get('input[type="hidden"]')
        expect(input.attributes('name')).toBe(propVal)
        expect(input.attributes('value')).toBe('#ff0000')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type String has effect', async () => {
        const wrapper = mountColor({ modelValue: '#00ff00' })

        expect(getHeaderInput(wrapper).element.value).toBe('#00ff00')
        expect(
          wrapper.get('.q-color-picker__header-content').$style()
        ).toContain('background-color: rgb(0, 255, 0)')

        await wrapper.setProps({ modelValue: '#0000ff' })

        expect(getHeaderInput(wrapper).element.value).toBe('#0000ff')
      })

      test('type null has effect', () => {
        const wrapper = mountColor({ modelValue: null })

        expect(getHeaderInput(wrapper).element.value).toBe('')
        // there is no color to point at in the spectrum
        expect(wrapper.find('.q-color-picker__spectrum-circle').exists()).toBe(
          false
        )
      })

      test('type undefined has effect', () => {
        const wrapper = mountColor({ modelValue: void 0 })

        expect(getHeaderInput(wrapper).element.value).toBe('')
        expect(wrapper.find('.q-color-picker__spectrum-circle').exists()).toBe(
          false
        )
      })
    })

    describe('[(prop)default-value]', () => {
      test('type String has effect', async () => {
        const propVal = '#c0c0c0'
        const wrapper = mountColor({ modelValue: null })

        expect(getHeaderInput(wrapper).element.value).toBe('')

        await wrapper.setProps({ defaultValue: propVal })

        expect(getHeaderInput(wrapper).element.value).toBe(propVal)

        // an actual model always wins over the default value
        await wrapper.setProps({ modelValue: '#00ff00' })

        expect(getHeaderInput(wrapper).element.value).toBe('#00ff00')
      })
    })

    describe('[(prop)default-view]', () => {
      function testDefaultView(propVal) {
        const wrapper = mountColor({ defaultView: propVal })

        expect(wrapper.find(`.q-color-picker__${propVal}-tab`).exists()).toBe(
          true
        )

        // the footer tabs follow the view
        expect(
          wrapper.findAll('.q-color-picker__footer .q-tab--active')
        ).toHaveLength(1)
      }

      test('value "spectrum" has effect', () => {
        testDefaultView('spectrum')
      })

      test('value "tune" has effect', () => {
        testDefaultView('tune')
      })

      test('value "palette" has effect', () => {
        testDefaultView('palette')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QColor.props.defaultView

        expect(validator(defaultValue)).toBe(true)
        expect(validator('palette')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)format-model]', () => {
      test('value "auto" has effect', async () => {
        const propVal = 'auto'
        const hexWrapper = mountColor({
          formatModel: propVal,
          defaultView: 'palette',
          modelValue: '#ff0000'
        })

        await pickFirstPaletteColor(hexWrapper)

        // the format of the model decides the format of the output
        expect(hexWrapper.emitted('update:modelValue')).toStrictEqual([
          ['#ffcccc']
        ])

        const rgbWrapper = mountColor({
          formatModel: propVal,
          defaultView: 'palette',
          modelValue: 'rgb(255,0,0)'
        })

        await pickFirstPaletteColor(rgbWrapper)

        expect(rgbWrapper.emitted('update:modelValue')).toStrictEqual([
          ['rgb(255,204,204)']
        ])
        expect(getHeaderTabLabels(rgbWrapper)).toStrictEqual(['HEX', 'RGB'])
      })

      test('value "hex" has effect', async () => {
        const wrapper = mountColor({
          formatModel: 'hex',
          defaultView: 'palette',
          modelValue: 'rgb(255,0,0)'
        })

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['#ffcccc']
        ])
        expect(getHeaderTabLabels(wrapper)).toStrictEqual(['HEX', 'RGB'])
      })

      test('value "rgb" has effect', async () => {
        const wrapper = mountColor({
          formatModel: 'rgb',
          defaultView: 'palette',
          modelValue: '#ff0000'
        })

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['rgb(255,204,204)']
        ])
      })

      test('value "hexa" has effect', async () => {
        const wrapper = mountColor({
          formatModel: 'hexa',
          defaultView: 'palette',
          modelValue: '#ff0000'
        })

        await pickFirstPaletteColor(wrapper)

        // the alpha channel is now part of the output
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['#ffccccff']
        ])
        expect(getHeaderTabLabels(wrapper)).toStrictEqual(['HEXA', 'RGBA'])
      })

      test('value "rgba" has effect', async () => {
        const wrapper = mountColor({
          formatModel: 'rgba',
          defaultView: 'palette',
          modelValue: '#ff0000'
        })

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['rgba(255,204,204,1)']
        ])
        expect(getHeaderTabLabels(wrapper)).toStrictEqual(['HEXA', 'RGBA'])
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QColor.props.formatModel

        expect(validator(defaultValue)).toBe(true)
        expect(validator('rgba')).toBe(true)
        expect(validator('nowhere')).toBe(false)
      })
    })

    describe('[(prop)palette]', () => {
      test('type Array has effect', async () => {
        const propVal = ['#019A9D', '#D9B801', 'rgb(23,120,0)', '#B2028A']
        const wrapper = mountColor({ defaultView: 'palette' })

        // it falls back to the embedded palette
        expect(getPaletteCubes(wrapper).length).toBeGreaterThan(propVal.length)

        await wrapper.setProps({ palette: propVal })

        const cubes = getPaletteCubes(wrapper)
        expect(cubes).toHaveLength(propVal.length)
        expect(cubes[0].$style('backgroundColor')).toBe('rgb(1, 154, 157)')

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['#019a9d']
        ])
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.classes()).not.toContain('q-color-picker--square')

        await wrapper.setProps({ square: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-color-picker--square', 'no-border-radius'])
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.classes()).not.toContain('q-color-picker--flat')

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-color-picker--flat', 'no-shadow'])
        )
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.classes()).not.toContain('q-color-picker--bordered')

        await wrapper.setProps({ bordered: true })

        expect(wrapper.classes()).toContain('q-color-picker--bordered')
      })
    })

    describe('[(prop)no-header]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.find('.q-color-picker__header').exists()).toBe(true)

        await wrapper.setProps({ noHeader: true })

        expect(wrapper.find('.q-color-picker__header').exists()).toBe(false)
        // the footer is not affected
        expect(wrapper.find('.q-color-picker__footer').exists()).toBe(true)
      })
    })

    describe('[(prop)no-header-tabs]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.find('.q-color-picker__header-tabs').exists()).toBe(true)

        await wrapper.setProps({ noHeaderTabs: true })

        expect(wrapper.find('.q-color-picker__header-tabs').exists()).toBe(
          false
        )
        // the header itself stays
        expect(wrapper.find('.q-color-picker__header').exists()).toBe(true)
      })
    })

    describe('[(prop)no-footer]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.find('.q-color-picker__footer').exists()).toBe(true)

        await wrapper.setProps({ noFooter: true })

        expect(wrapper.find('.q-color-picker__footer').exists()).toBe(false)
        expect(wrapper.find('.q-color-picker__header').exists()).toBe(true)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor({
          defaultView: 'palette',
          name: 'car_id',
          disable: true
        })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(getHeaderInput(wrapper).attributes('readonly')).toBe('')
        // no form input gets submitted while disabled
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor({
          defaultView: 'palette',
          name: 'car_id',
          readonly: true
        })

        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.attributes('aria-disabled')).toBeUndefined()
        expect(getHeaderInput(wrapper).attributes('readonly')).toBe('')
        // unlike "disable", the value still gets submitted
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(true)

        await pickFirstPaletteColor(wrapper)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountColor()

        expect(wrapper.classes()).not.toContain('q-color-picker--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-color-picker--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountColor({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-color-picker--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-color-picker--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountColor({ defaultView: 'palette' })

        await pickFirstPaletteColor(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('#ffcccc')
      })
    })

    describe('[(event)change]', () => {
      test('is emitting', async () => {
        const wrapper = mountColor({ defaultView: 'palette' })

        await pickFirstPaletteColor(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('change')
        expect(eventList.change).toHaveLength(1)

        const [value] = eventList.change[0]
        expect(value).toBe('#ffcccc')
      })
    })
  })
})
