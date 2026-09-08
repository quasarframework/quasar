import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QColor from './QColor.js'
import langEn from '../../../lang/en-US.js'
import {
  hsvToRgb,
  rgbToHex,
  rgbToHsv,
  textToRgb
} from '../../utils/colors/colors.js'

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

function getSpectrum(wrapper) {
  return wrapper.get('.q-color-picker__spectrum')
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

      test('toggling it disarms the spectrum pan in place', async () => {
        const wrapper = mountColor({ disable: true })
        const spectrum = wrapper.get('.q-color-picker__spectrum')

        await spectrum.trigger('mousedown', { button: 0 })

        expect(spectrum.element.__qtouchpan.event).toBeUndefined()

        await wrapper.setProps({ disable: false })

        expect(wrapper.get('.q-color-picker__spectrum').element).toBe(
          spectrum.element
        )

        await spectrum.trigger('mousedown', { button: 0 })

        expect(spectrum.element.__qtouchpan.event).toBeDefined()

        wrapper.unmount()
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

  describe('[Accessibility]', () => {
    test('names the internals the consumer cannot reach', () => {
      const wrapper = mountColor({
        modelValue: '#ff00ffcc',
        formatModel: 'rgba'
      })
      const { colorPicker } = langEn

      // view tabs are icon-only
      const tabs = wrapper
        .findAll('.q-color-picker__footer [role="tab"]')
        .map(t => t.attributes('aria-label'))
      expect(tabs).toStrictEqual([
        colorPicker.spectrum,
        colorPicker.tune,
        colorPicker.palette
      ])

      // the header value field has no label element of its own
      expect(
        wrapper
          .get('.q-color-picker__header-banner input')
          .attributes('aria-label')
      ).toBe(colorPicker.value)

      // both sliders carry the slider role, so they need names
      expect(
        wrapper
          .get('.q-color-picker__hue [role="slider"]')
          .attributes('aria-label')
      ).toBe(colorPicker.hue)
      expect(
        wrapper
          .get('.q-color-picker__alpha [role="slider"]')
          .attributes('aria-label')
      ).toBe(colorPicker.alpha)
    })

    test('the view panels add no Tab stop of their own', async () => {
      const wrapper = mountColor()

      const tabs = wrapper.findAll('.q-color-picker__footer [role="tab"]')

      for (const [index, view] of ['spectrum', 'tune', 'palette'].entries()) {
        await tabs[index].trigger('click')

        const panel = wrapper.get('[role="tabpanel"]')
        expect(panel.classes()).toContain(`q-color-picker__${view}-tab`)
        expect(panel.attributes('tabindex')).toBe('-1')
      }
    })

    describe('palette swatches', () => {
      // 12 swatches: the default 10-per-row layout leaves 2 on the second row
      const swatches = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
        '#000000',
        '#ffffff',
        '#808080',
        '#800000',
        '#008000',
        '#000080'
      ]

      function mountPalette(props = {}) {
        return mount(QColor, {
          attachTo: document.body,
          props: {
            modelValue: '#0000ff',
            defaultView: 'palette',
            palette: swatches,
            ...props
          }
        })
      }

      function getTabStops(wrapper) {
        return getPaletteCubes(wrapper)
          .map((cube, index) =>
            cube.attributes('tabindex') === '0' ? index : -1
          )
          .filter(index => index !== -1)
      }

      test('swatches are named buttons in a named group', () => {
        const wrapper = mountPalette()

        const group = wrapper.get('.q-color-picker__palette-rows')
        expect(group.attributes('role')).toBe('group')
        expect(group.attributes('aria-label')).toBe(langEn.colorPicker.palette)

        const cubes = getPaletteCubes(wrapper)
        expect(cubes).toHaveLength(swatches.length)
        cubes.forEach((cube, index) => {
          expect(cube.element.tagName).toBe('BUTTON')
          expect(cube.attributes('type')).toBe('button')
          expect(cube.attributes('aria-label')).toBe(swatches[index])
        })

        wrapper.unmount()
      })

      test('the swatch matching the model is pressed and owns the Tab stop', async () => {
        // a duplicate of the model color: every copy is pressed, the
        // first one owns the Tab stop
        const wrapper = mountPalette({ palette: [...swatches, '#0000ff'] })

        expect(getTabStops(wrapper)).toStrictEqual([2])
        expect(
          getPaletteCubes(wrapper).map(cube => cube.attributes('aria-pressed'))
        ).toStrictEqual(
          [...swatches, '#0000ff'].map(color =>
            color === '#0000ff' ? 'true' : 'false'
          )
        )

        // a model outside the palette falls back to the first swatch
        await wrapper.setProps({ modelValue: '#123456' })
        expect(getTabStops(wrapper)).toStrictEqual([0])
        expect(
          getPaletteCubes(wrapper).every(
            cube => cube.attributes('aria-pressed') === 'false'
          )
        ).toBe(true)

        wrapper.unmount()
      })

      test('arrow keys move focus without selecting; Home/End jump to the edges', async () => {
        const wrapper = mountPalette()
        const cubes = getPaletteCubes(wrapper)

        cubes[2].element.focus()

        await cubes[2].trigger('keydown', { keyCode: 39 })
        expect(document.activeElement).toBe(cubes[3].element)
        expect(getTabStops(wrapper)).toStrictEqual([3])

        await cubes[3].trigger('keydown', { keyCode: 37 })
        expect(document.activeElement).toBe(cubes[2].element)

        await cubes[2].trigger('keydown', { keyCode: 35 })
        expect(document.activeElement).toBe(cubes[11].element)

        await cubes[11].trigger('keydown', { keyCode: 36 })
        expect(document.activeElement).toBe(cubes[0].element)

        // the edges are not wrapped
        await cubes[0].trigger('keydown', { keyCode: 37 })
        expect(document.activeElement).toBe(cubes[0].element)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        wrapper.unmount()
      })

      test('Up/Down move by one visual row', async () => {
        const wrapper = mountPalette()
        const cubes = getPaletteCubes(wrapper)

        cubes[1].element.focus()

        await cubes[1].trigger('keydown', { keyCode: 40 })
        expect(document.activeElement).toBe(cubes[11].element)

        await cubes[11].trigger('keydown', { keyCode: 38 })
        expect(document.activeElement).toBe(cubes[1].element)

        // no swatch below the first row's tail
        await cubes[5].trigger('keydown', { keyCode: 40 })
        expect(document.activeElement).toBe(cubes[1].element)

        wrapper.unmount()
      })

      test('Left/Right follow the visual direction in RTL', async () => {
        const wrapper = mountPalette()
        const cubes = getPaletteCubes(wrapper)

        wrapper.vm.$q.lang.rtl = true

        try {
          cubes[2].element.focus()

          await cubes[2].trigger('keydown', { keyCode: 37 })
          expect(document.activeElement).toBe(cubes[3].element)
        } finally {
          wrapper.vm.$q.lang.rtl = false
          wrapper.unmount()
        }
      })

      test('a disabled or readonly palette has no Tab stop', async () => {
        const wrapper = mountPalette({ readonly: true })

        expect(getTabStops(wrapper)).toStrictEqual([])

        await wrapper.setProps({ readonly: false, disable: true })
        expect(getTabStops(wrapper)).toStrictEqual([])

        await wrapper.setProps({ disable: false })
        expect(getTabStops(wrapper)).toStrictEqual([2])

        wrapper.unmount()
      })
    })

    describe('spectrum panel', () => {
      const { colorPicker } = langEn

      // the hue stays put while the keyboard walks the spectrum, so
      // every expected model derives from the start color's hue
      function hexAt(startColor, s, v) {
        const { h } = rgbToHsv(textToRgb(startColor))
        return rgbToHex(hsvToRgb({ h, s, v }))
      }

      function valueText(s, v) {
        return `${colorPicker.saturation} ${s}%, ${colorPicker.brightness} ${v}%`
      }

      function mountSpectrum(props = {}) {
        return mount(QColor, {
          attachTo: document.body,
          props: { modelValue: '#ff0000', ...props }
        })
      }

      function lastModel(wrapper) {
        return wrapper.emitted('update:modelValue').at(-1)[0]
      }

      test('the panel is a named slider spelling out saturation and brightness', async () => {
        const wrapper = mountSpectrum({ modelValue: '#808080' })
        const spectrum = getSpectrum(wrapper)
        const { s, v } = rgbToHsv(textToRgb('#808080'))

        expect(spectrum.attributes('role')).toBe('slider')
        expect(spectrum.attributes('tabindex')).toBe('0')
        expect(spectrum.attributes('aria-label')).toBe(colorPicker.spectrum)
        expect(spectrum.attributes('aria-valuemin')).toBe('0')
        expect(spectrum.attributes('aria-valuemax')).toBe('100')
        expect(spectrum.attributes('aria-valuenow')).toBe(String(s))
        expect(spectrum.attributes('aria-valuetext')).toBe(valueText(s, v))

        // no color yet: the numbers would mislead
        await wrapper.setProps({ modelValue: '' })
        expect(spectrum.attributes('aria-valuetext')).toBe(langEn.label.noValue)

        wrapper.unmount()
      })

      test('arrows step saturation and brightness by one, ten with Shift', async () => {
        const wrapper = mountSpectrum()
        const spectrum = getSpectrum(wrapper)

        spectrum.element.focus()

        await spectrum.trigger('keydown', { keyCode: 37 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 99, 100))

        await spectrum.trigger('keydown', { keyCode: 40 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 99, 99))

        await spectrum.trigger('keydown', { keyCode: 37, shiftKey: true })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 89, 99))

        await spectrum.trigger('keydown', { keyCode: 40, shiftKey: true })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 89, 89))

        await spectrum.trigger('keydown', { keyCode: 39 })
        await spectrum.trigger('keydown', { keyCode: 38 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 90, 90))

        expect(spectrum.attributes('aria-valuenow')).toBe('90')
        expect(spectrum.attributes('aria-valuetext')).toBe(valueText(90, 90))

        wrapper.unmount()
      })

      test('Home/End set the saturation, PageUp/PageDown step the brightness by ten', async () => {
        const wrapper = mountSpectrum()
        const spectrum = getSpectrum(wrapper)

        spectrum.element.focus()

        await spectrum.trigger('keydown', { keyCode: 36 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 0, 100))

        await spectrum.trigger('keydown', { keyCode: 35 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 100, 100))

        await spectrum.trigger('keydown', { keyCode: 34 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 100, 90))

        await spectrum.trigger('keydown', { keyCode: 33 })
        expect(lastModel(wrapper)).toBe(hexAt('#ff0000', 100, 100))

        wrapper.unmount()
      })

      test('the edges are clamped and change fires once, on keyup', async () => {
        const wrapper = mountSpectrum()
        const spectrum = getSpectrum(wrapper)

        spectrum.element.focus()

        // already at full saturation and brightness
        await spectrum.trigger('keydown', { keyCode: 39 })
        await spectrum.trigger('keydown', { keyCode: 38 })
        await spectrum.trigger('keyup', { keyCode: 38 })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('change')).toBeUndefined()

        // key repeat: two steps, one change
        await spectrum.trigger('keydown', { keyCode: 40 })
        await spectrum.trigger('keydown', { keyCode: 40 })
        expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
        expect(wrapper.emitted('change')).toBeUndefined()

        await spectrum.trigger('keyup', { keyCode: 40 })
        expect(wrapper.emitted('change')).toStrictEqual([
          [hexAt('#ff0000', 100, 98)]
        ])

        wrapper.unmount()
      })

      test('Left/Right follow the visual direction in RTL', async () => {
        const wrapper = mountSpectrum({ modelValue: '#808080' })
        const spectrum = getSpectrum(wrapper)
        const { v } = rgbToHsv(textToRgb('#808080'))

        wrapper.vm.$q.lang.rtl = true

        try {
          spectrum.element.focus()

          await spectrum.trigger('keydown', { keyCode: 37 })
          expect(lastModel(wrapper)).toBe(hexAt('#808080', 1, v))
        } finally {
          wrapper.vm.$q.lang.rtl = false
          wrapper.unmount()
        }
      })

      test('a disabled or readonly spectrum has no Tab stop and ignores keys', async () => {
        const wrapper = mountSpectrum({ readonly: true })
        const spectrum = getSpectrum(wrapper)

        expect(spectrum.attributes('tabindex')).toBe('-1')
        expect(spectrum.attributes('aria-readonly')).toBe('true')
        expect(spectrum.attributes('aria-disabled')).toBeUndefined()

        await spectrum.trigger('keydown', { keyCode: 40 })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await wrapper.setProps({ readonly: false, disable: true })
        expect(spectrum.attributes('tabindex')).toBe('-1')
        expect(spectrum.attributes('aria-disabled')).toBe('true')
        expect(spectrum.attributes('aria-readonly')).toBeUndefined()

        await spectrum.trigger('keydown', { keyCode: 40 })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await wrapper.setProps({ disable: false })
        expect(spectrum.attributes('tabindex')).toBe('0')

        wrapper.unmount()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)palette]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mount(QColor, {
          props: {
            modelValue: 'some-string',
            defaultView: 'palette'
          },
          slots: {
            palette: scope => {
              slotScope = scope
              return slotContent
            }
          }
        })

        expect(wrapper.html()).toContain(slotContent)

        expect(slotScope).toStrictEqual({
          palette: expect.any(Array),
          select: expect.any(Function),
          editable: expect.any(Boolean)
        })
      })

      test('replaces the default swatches and exposes the colors', () => {
        const propVal = ['#019A9D', '#D9B801', 'rgb(23,120,0)']
        let slotScope
        const wrapper = mount(QColor, {
          props: {
            modelValue: '#ff0000',
            defaultView: 'palette',
            palette: propVal
          },
          slots: {
            palette: scope => {
              slotScope = scope
              return 'swatches'
            }
          }
        })

        expect(getPaletteCubes(wrapper)).toHaveLength(0)
        expect(slotScope.palette).toStrictEqual(propVal)
        expect(slotScope.editable).toBe(true)
      })

      test('select() updates the model, unless disabled or readonly', async () => {
        let slotScope
        const wrapper = mount(QColor, {
          props: {
            modelValue: '#ff0000',
            defaultView: 'palette'
          },
          slots: {
            palette: scope => {
              slotScope = scope
              return 'swatches'
            }
          }
        })

        slotScope.select('#019A9D')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['#019a9d']
        ])

        await wrapper.setProps({ readonly: true })
        expect(slotScope.editable).toBe(false)

        slotScope.select('#D9B801')
        expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      })
    })
  })
})
