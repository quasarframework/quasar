import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QSlider from './QSlider.js'

function mountSlider(props, slots) {
  props ||= {}

  return mount(QSlider, {
    props: {
      modelValue: 50,
      ...props
    },
    slots
  })
}

function getTrackContainer(wrapper) {
  return wrapper.get('.q-slider__track-container')
}

function getTrack(wrapper) {
  return wrapper.get('.q-slider__track')
}

function getThumb(wrapper) {
  return wrapper.get('.q-slider__thumb')
}

function getSelection(wrapper) {
  return wrapper.get('.q-slider__selection')
}

function getInnerTrack(wrapper) {
  return wrapper.get('.q-slider__inner')
}

function getMarkerLabels(wrapper) {
  return wrapper.findAll('.q-slider__marker-labels')
}

function getMarkerLabelsContainer(wrapper) {
  return wrapper.get('.q-slider__marker-labels-container')
}

/**
 * The slider is given an explicit 100x10 track so that converting a pointer
 * position into a model value stays simple, deterministic math instead of
 * depending on the real rendered width.
 */
function giveSliderSize(wrapper) {
  wrapper.element.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    width: 100,
    height: 10
  })
}

async function pressAt(wrapper, { clientX = 0, clientY = 0 } = {}) {
  giveSliderSize(wrapper)

  await getTrackContainer(wrapper).trigger('mousedown', { clientX, clientY })
}

async function clickAt(wrapper, position) {
  await pressAt(wrapper, position)

  document.dispatchEvent(new MouseEvent('mouseup'))
  await nextTick()
}

function getPanHandler(wrapper) {
  return getTrackContainer(wrapper).element.__qtouchpan.handler
}

describe('[QSlider API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountSlider()

        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.setProps({ name: propVal })

        const input = wrapper.get('input[type="hidden"]')
        expect(input.attributes('name')).toBe(propVal)
        expect(input.attributes('value')).toBe('50')
      })
    })

    describe('[(prop)min]', () => {
      test('type Number has effect', async () => {
        const propVal = 0
        const wrapper = mountSlider({ min: propVal })

        expect(getTrackContainer(wrapper).attributes('aria-valuemin')).toBe(
          String(propVal)
        )
        expect(getThumb(wrapper).$style('left')).toBe('50%')

        // half of the [-50, 100] range sits at two thirds of the track
        await wrapper.setProps({ min: -50 })

        expect(getTrackContainer(wrapper).attributes('aria-valuemin')).toBe(
          '-50'
        )
        // the browser's CSSOM serializes the percentage rounded
        // to a few decimals, so allow for that loss of precision
        expect(Number.parseFloat(getThumb(wrapper).$style('left'))).toBeCloseTo(
          (100 * 100) / 150,
          3
        )
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountSlider({ max: propVal })

        expect(getTrackContainer(wrapper).attributes('aria-valuemax')).toBe(
          String(propVal)
        )
        expect(getThumb(wrapper).$style('left')).toBe('50%')

        await wrapper.setProps({ max: 200 })

        expect(getTrackContainer(wrapper).attributes('aria-valuemax')).toBe(
          '200'
        )
        expect(getThumb(wrapper).$style('left')).toBe('25%')
      })
    })

    describe('[(prop)inner-min]', () => {
      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountSlider({ modelValue: 0 })

        expect(getThumb(wrapper).$style('left')).toBe('0%')

        await wrapper.setProps({ innerMin: propVal })

        // the model gets pushed inside of the allowed range
        expect(getTrackContainer(wrapper).attributes('aria-valuemin')).toBe(
          String(propVal)
        )
        expect(getThumb(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('width')).toBe('90%')
      })
    })

    describe('[(prop)inner-max]', () => {
      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountSlider({ modelValue: 100 })

        expect(getThumb(wrapper).$style('left')).toBe('100%')

        await wrapper.setProps({ innerMax: propVal })

        expect(getTrackContainer(wrapper).attributes('aria-valuemax')).toBe(
          String(propVal)
        )
        expect(getThumb(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('width')).toBe(`${propVal}%`)
      })
    })

    describe('[(prop)step]', () => {
      test('type Number has effect', async () => {
        const propVal = 1
        const wrapper = mountSlider({ step: propVal })

        expect(getTrackContainer(wrapper).attributes('data-step')).toBe(
          String(propVal)
        )

        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[51]])

        const stepWrapper = mountSlider({ step: 10 })
        await getTrackContainer(stepWrapper).trigger('keydown', { keyCode: 39 })

        expect(stepWrapper.emitted('update:modelValue')).toStrictEqual([[60]])
      })

      test('only accepts a positive value', () => {
        const { validator, default: defaultValue } = QSlider.props.step

        expect(validator(defaultValue)).toBe(true)
        expect(validator(0)).toBe(true)
        expect(validator(-1)).toBe(false)
      })
    })

    describe('[(prop)snap]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ step: 10, modelValue: 0 })

        // while dragging, the thumb follows the pointer even though
        // the value itself always snaps to the step
        await pressAt(wrapper, { clientX: 53 })

        expect(wrapper.emitted('update:modelValue')[0]).toStrictEqual([50])
        expect(getThumb(wrapper).$style('left')).toBe('53%')

        const snapWrapper = mountSlider({
          step: 10,
          modelValue: 0,
          snap: true
        })

        await pressAt(snapWrapper, { clientX: 53 })

        expect(snapWrapper.emitted('update:modelValue')[0]).toStrictEqual([50])
        // with it, the thumb snaps along
        expect(getThumb(snapWrapper).$style('left')).toBe('50%')
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(getThumb(wrapper).$style('left')).toBe('50%')

        await wrapper.setProps({ reverse: true })

        // everything gets measured from the other end
        expect(getThumb(wrapper).$style('left')).toBe('')
        expect(getThumb(wrapper).$style('right')).toBe('50%')
        expect(getSelection(wrapper).$style('right')).toBe('0%')
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--h', 'column'])
        )
        expect(getTrackContainer(wrapper).attributes('aria-orientation')).toBe(
          'horizontal'
        )

        await wrapper.setProps({ vertical: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--v', 'row'])
        )
        expect(getTrackContainer(wrapper).attributes('aria-orientation')).toBe(
          'vertical'
        )
        expect(getThumb(wrapper).$style('top')).toBe('50%')
        expect(getSelection(wrapper).$style('height')).toBe('50%')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider()

        expect(getSelection(wrapper).classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ color: propVal })

        expect(getSelection(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getThumb(wrapper).classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)track-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider()

        expect(getTrack(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ trackColor: propVal })

        expect(getTrack(wrapper).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)track-img]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-pattern.png'
        const wrapper = mountSlider()

        expect(getTrack(wrapper).$style('backgroundImage')).toBe('')

        await wrapper.setProps({ trackImg: propVal })

        expect(getTrack(wrapper).$style('backgroundImage')).toBe(
          `url("${propVal}")`
        )
      })
    })

    describe('[(prop)inner-track-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider()

        expect(getInnerTrack(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ innerTrackColor: propVal })

        expect(getInnerTrack(wrapper).classes()).toContain(`bg-${propVal}`)

        // a transparent inner track is not rendered at all
        await wrapper.setProps({ innerTrackColor: 'transparent' })

        expect(wrapper.find('.q-slider__inner').exists()).toBe(false)
      })
    })

    describe('[(prop)inner-track-img]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-pattern.png'
        const wrapper = mountSlider()

        expect(getInnerTrack(wrapper).$style('backgroundImage')).toBe('')

        await wrapper.setProps({ innerTrackImg: propVal })

        expect(getInnerTrack(wrapper).$style('backgroundImage')).toBe(
          `url("${propVal}")`
        )
      })
    })

    describe('[(prop)selection-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider({ color: 'accent' })

        expect(getSelection(wrapper).classes()).toContain('text-accent')

        await wrapper.setProps({ selectionColor: propVal })

        // it takes precedence over the general color
        expect(getSelection(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getSelection(wrapper).classes()).not.toContain('text-accent')

        await wrapper.setProps({ selectionColor: 'transparent' })

        expect(wrapper.find('.q-slider__selection').exists()).toBe(false)
      })
    })

    describe('[(prop)selection-img]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-pattern.png'
        const wrapper = mountSlider()

        expect(getSelection(wrapper).$style('backgroundImage')).toBe('')

        await wrapper.setProps({ selectionImg: propVal })

        expect(getSelection(wrapper).$style('backgroundImage')).toBe(
          `url("${propVal}")`
        )
      })
    })

    describe('[(prop)label]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(wrapper.classes()).not.toContain('q-slider--label')
        expect(wrapper.find('.q-slider__pin').exists()).toBe(false)

        await wrapper.setProps({ label: true })

        expect(wrapper.classes()).toContain('q-slider--label')
        expect(wrapper.get('.q-slider__text').text()).toBe('50')
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider({ label: true })

        expect(wrapper.get('.q-slider__pin').classes()).not.toContain(
          `text-${propVal}`
        )

        await wrapper.setProps({ labelColor: propVal })

        expect(wrapper.get('.q-slider__pin').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)label-text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider({ label: true })

        expect(wrapper.get('.q-slider__text').classes()).not.toContain(
          `text-${propVal}`
        )

        await wrapper.setProps({ labelTextColor: propVal })

        expect(wrapper.get('.q-slider__text').classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)switch-label-side]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ label: true })

        expect(wrapper.get('.q-slider__pin').classes()).toContain(
          'q-slider__pin--h-standard'
        )

        await wrapper.setProps({ switchLabelSide: true })

        expect(wrapper.get('.q-slider__pin').classes()).toContain(
          'q-slider__pin--h-switched'
        )
        expect(wrapper.get('.q-slider__label').classes()).toContain(
          'q-slider__label--h-switched'
        )
      })
    })

    describe('[(prop)label-always]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(wrapper.classes()).not.toContain('q-slider--label-always')

        await wrapper.setProps({ labelAlways: true })

        // the label shows up even without the "label" prop
        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--label', 'q-slider--label-always'])
        )
        expect(wrapper.find('.q-slider__pin').exists()).toBe(true)
      })
    })

    describe('[(prop)markers]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ step: 25 })

        expect(wrapper.find('.q-slider__markers').exists()).toBe(false)

        await wrapper.setProps({ markers: true })

        // one marker for every step
        expect(wrapper.get('.q-slider__markers').$style('backgroundSize')).toBe(
          '25% 2px'
        )
      })

      test('type Number has effect', () => {
        const propVal = 5
        const wrapper = mountSlider({ markers: propVal })

        expect(wrapper.get('.q-slider__markers').$style('backgroundSize')).toBe(
          `${propVal}% 2px`
        )
      })
    })

    describe('[(prop)marker-labels]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ step: 25 })

        expect(
          wrapper.find('.q-slider__marker-labels-container').exists()
        ).toBe(false)

        await wrapper.setProps({ markerLabels: true })

        const labels = getMarkerLabels(wrapper)
        expect(labels.map(label => label.text())).toStrictEqual([
          '0',
          '25',
          '50',
          '75',
          '100'
        ])
        expect(labels[1].$style('left')).toBe('25%')
      })

      test('type Array has effect', () => {
        const propVal = [
          { value: 0, label: '0%' },
          { value: 5, classes: 'my-class', style: { width: '24px' } }
        ]
        const wrapper = mountSlider({ markerLabels: propVal })

        const labels = getMarkerLabels(wrapper)
        expect(labels).toHaveLength(2)
        expect(labels[0].text()).toBe('0%')

        // without a label, the value itself is displayed
        expect(labels[1].text()).toBe('5')
        expect(labels[1].classes()).toContain('my-class')
        expect(labels[1].$style('width')).toBe('24px')
      })

      test('type Object has effect', () => {
        const propVal = {
          0: '0%',
          5: { label: '5%', classes: 'my-class', style: { width: '24px' } }
        }
        const wrapper = mountSlider({ markerLabels: propVal })

        const labels = getMarkerLabels(wrapper)
        expect(labels.map(label => label.text())).toStrictEqual(['0%', '5%'])
        expect(labels[1].classes()).toContain('my-class')
        expect(labels[1].$style('left')).toBe('5%')
      })

      test('type Function has effect', () => {
        const propVal = val => 10 * val + '%'
        const wrapper = mountSlider({ step: 25, markerLabels: propVal })

        expect(
          getMarkerLabels(wrapper).map(label => label.text())
        ).toStrictEqual(['0%', '250%', '500%', '750%', '1000%'])
      })
    })

    describe('[(prop)marker-labels-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'text-orange'
        const wrapper = mountSlider({ step: 25, markerLabels: true })

        expect(getMarkerLabelsContainer(wrapper).classes()).not.toContain(
          propVal
        )

        await wrapper.setProps({ markerLabelsClass: propVal })

        expect(getMarkerLabelsContainer(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)switch-marker-labels-side]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ step: 25, markerLabels: true })

        expect(getMarkerLabels(wrapper)[0].classes()).toContain(
          'q-slider__marker-labels--h-standard'
        )
        expect(wrapper.element.firstElementChild.classList).toContain(
          'q-slider__track-container'
        )

        await wrapper.setProps({ switchMarkerLabelsSide: true })

        expect(getMarkerLabels(wrapper)[0].classes()).toContain(
          'q-slider__marker-labels--h-switched'
        )
        // the labels are rendered before the track now
        expect(wrapper.element.firstElementChild.classList).toContain(
          'q-slider__marker-labels-container'
        )
      })
    })

    describe('[(prop)track-size]', () => {
      test('type String has effect', async () => {
        const propVal = '8px'
        const wrapper = mountSlider()

        expect(getTrack(wrapper).$style('height')).toBe('4px')

        await wrapper.setProps({ trackSize: propVal })

        expect(getTrack(wrapper).$style('height')).toBe(propVal)
      })
    })

    describe('[(prop)thumb-size]', () => {
      test('type String has effect', async () => {
        const propVal = '32px'
        const wrapper = mountSlider()

        expect(getThumb(wrapper).$style('width')).toBe('20px')

        await wrapper.setProps({ thumbSize: propVal })

        expect(getThumb(wrapper).$style('width')).toBe(propVal)
        expect(getThumb(wrapper).$style('height')).toBe(propVal)
      })
    })

    describe('[(prop)thumb-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountSlider({ color: 'accent' })

        expect(getThumb(wrapper).classes()).toContain('text-accent')

        await wrapper.setProps({ thumbColor: propVal })

        // it takes precedence over the general color
        expect(getThumb(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getThumb(wrapper).classes()).not.toContain('text-accent')
        // ...but only for the thumb
        expect(getSelection(wrapper).classes()).toContain('text-accent')
      })
    })

    describe('[(prop)thumb-path]', () => {
      test('type String has effect', async () => {
        const propVal = 'M5 5 h10 v10 h-10 v-10 z'
        const wrapper = mountSlider()

        expect(wrapper.get('.q-slider__thumb-shape path').attributes('d')).toBe(
          QSlider.props.thumbPath.default
        )

        await wrapper.setProps({ thumbPath: propVal })

        expect(wrapper.get('.q-slider__thumb-shape path').attributes('d')).toBe(
          propVal
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(wrapper.classes()).not.toContain('q-slider--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-slider--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountSlider({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-slider--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-slider--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider()

        expect(wrapper.classes()).not.toContain('q-slider--dense')

        await wrapper.setProps({ dense: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--dense', 'q-slider--dense--h'])
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ name: 'car_id' })

        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-slider--editable')
        expect(getTrackContainer(wrapper).attributes('aria-disabled')).toBe(
          'true'
        )
        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('-1')
        expect(getTrackContainer(wrapper).element.__qtouchpan).toBeUndefined()
        // nothing gets submitted while disabled
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSlider({ name: 'car_id' })

        await wrapper.setProps({ readonly: true })

        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-slider--editable')
        expect(getTrackContainer(wrapper).attributes('aria-readonly')).toBe(
          'true'
        )
        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('-1')
        // unlike "disable", the value still gets submitted
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(true)

        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountSlider()

        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ tabindex: propVal })

        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe(
          String(propVal)
        )
      })

      test('type String has effect', () => {
        const wrapper = mountSlider({ tabindex: '3' })

        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('3')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Number has effect', () => {
        const propVal = 10
        const wrapper = mountSlider({ modelValue: propVal })

        expect(getTrackContainer(wrapper).attributes('aria-valuenow')).toBe(
          String(propVal)
        )
        expect(wrapper.classes()).not.toContain('q-slider--no-value')
        expect(getThumb(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getSelection(wrapper).$style('width')).toBe(`${propVal}%`)
      })

      test('type null has effect', () => {
        const wrapper = mountSlider({ modelValue: null })

        expect(wrapper.classes()).toContain('q-slider--no-value')
        // it falls back to the minimum
        expect(getThumb(wrapper).$style('left')).toBe('0%')
      })

      test('type undefined has effect', () => {
        // it defaults to a null model
        const wrapper = mountSlider({ modelValue: void 0 })

        expect(wrapper.classes()).toContain('q-slider--no-value')
        expect(getThumb(wrapper).$style('left')).toBe('0%')
      })
    })

    describe('[(prop)label-value]', () => {
      test('type String has effect', async () => {
        const propVal = 'fifty'
        const wrapper = mountSlider({ label: true })

        expect(wrapper.get('.q-slider__text').text()).toBe('50')

        await wrapper.setProps({ labelValue: propVal })

        expect(wrapper.get('.q-slider__text').text()).toBe(propVal)
      })

      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountSlider({ label: true })

        await wrapper.setProps({ labelValue: propVal })

        expect(wrapper.get('.q-slider__text').text()).toBe(String(propVal))
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)marker-label]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountSlider(
          { step: 25, markerLabels: true },
          {
            'marker-label': scope => {
              slotScope = scope
              return slotContent
            }
          }
        )

        expect(wrapper.html()).toContain(slotContent)
        // it gets called once for every marker
        expect(getMarkerLabelsContainer(wrapper).text()).toBe(
          slotContent.repeat(5)
        )

        expect(slotScope).toStrictEqual({
          marker: {
            index: expect.any(Number),
            value: expect.any(Number),
            label: expect.$any([expect.any(Number), expect.any(String)]),
            classes: expect.any(String),
            style: expect.any(Object)
          },
          markerList: expect.$arrayValues({
            index: expect.any(Number),
            value: expect.any(Number),
            label: expect.$any([expect.any(Number), expect.any(String)]),
            classes: expect.any(String),
            style: expect.any(Object)
          }),
          markerMap: expect.$objectValues({
            index: expect.any(Number),
            value: expect.any(Number),
            label: expect.$any([expect.any(Number), expect.any(String)]),
            classes: expect.any(String),
            style: expect.any(Object)
          }),
          classes: expect.any(String),
          getStyle: expect.any(Function)
        })
      })
    })

    describe('[(slot)marker-label-group]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountSlider(
          { step: 25, markerLabels: true },
          {
            'marker-label-group': scope => {
              slotScope = scope
              return slotContent
            }
          }
        )

        // it takes over the whole list, so it only renders once
        expect(getMarkerLabelsContainer(wrapper).text()).toBe(slotContent)

        expect(slotScope).toStrictEqual({
          markerList: expect.$arrayValues({
            index: expect.any(Number),
            value: expect.any(Number),
            label: expect.$any([expect.any(Number), expect.any(String)]),
            classes: expect.any(String),
            style: expect.any(Object)
          }),
          markerMap: expect.$objectValues({
            index: expect.any(Number),
            value: expect.any(Number),
            label: expect.$any([expect.any(Number), expect.any(String)]),
            classes: expect.any(String),
            style: expect.any(Object)
          }),
          classes: expect.any(String),
          getStyle: expect.any(Function)
        })

        expect(slotScope.getStyle(50)).toStrictEqual({ left: '50%' })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)change]', () => {
      test('is emitting', async () => {
        const wrapper = mountSlider({ modelValue: 0 })

        await clickAt(wrapper, { clientX: 30 })

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('change')
        expect(eventList.change).toHaveLength(1)

        const [value] = eventList.change[0]
        expect(value).toBe(30)
      })

      test('is emitting on keyboard navigation', async () => {
        const wrapper = mountSlider({ modelValue: 0 })

        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })
        expect(wrapper.emitted('change')).toBeUndefined()

        await getTrackContainer(wrapper).trigger('keyup', { keyCode: 39 })

        expect(wrapper.emitted('change')).toStrictEqual([[1]])
      })
    })

    describe('[(event)pan]', () => {
      test('is emitting', async () => {
        const wrapper = mountSlider({ modelValue: 0 })
        giveSliderSize(wrapper)

        const handler = getPanHandler(wrapper)

        handler({ isFirst: true, evt: { clientX: 30, clientY: 0 } })
        await nextTick()

        let eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('pan')
        expect(eventList.pan).toHaveLength(1)

        const [phase] = eventList.pan[0]
        expect(['start', 'end']).toContain(phase)
        expect(phase).toBe('start')

        handler({
          isFinal: true,
          touch: true,
          evt: { clientX: 60, clientY: 0 }
        })
        await nextTick()

        eventList = wrapper.emitted()
        expect(eventList.pan).toHaveLength(2)
        expect(eventList.pan[1]).toStrictEqual(['end'])
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountSlider({ modelValue: 0 })

        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).$any([expect.any(Number), null])
        expect(value).toBe(1)
      })
    })
  })

  describe('[Accessibility]', () => {
    test('the focusable track container carries the slider semantics', () => {
      // default mount: modelValue 50, limits 0-100
      const wrapper = mountSlider()
      const attrs = getTrackContainer(wrapper).attributes()

      expect(attrs.role).toBe('slider')
      expect(attrs.tabindex).toBe('0')
      expect(attrs['aria-orientation']).toBe('horizontal')
      expect(attrs['aria-valuemin']).toBe('0')
      expect(attrs['aria-valuemax']).toBe('100')
      expect(attrs['aria-valuenow']).toBe('50')

      // the root is a plain wrapper
      expect(wrapper.attributes('role')).toBeUndefined()
      expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    })

    test('fall-through attributes reach the slider element, class stays on the root', () => {
      const wrapper = mount(QSlider, {
        props: { modelValue: 50 },
        attrs: {
          'aria-label': 'Volume',
          class: 'my-slider'
        }
      })

      expect(getTrackContainer(wrapper).attributes('aria-label')).toBe('Volume')
      expect(wrapper.classes()).toContain('my-slider')
      expect(getTrackContainer(wrapper).classes()).not.toContain('my-slider')
    })

    test('label-value feeds aria-valuetext', () => {
      const wrapper = mountSlider({ labelValue: '50%' })

      expect(getTrackContainer(wrapper).attributes('aria-valuetext')).toBe(
        '50%'
      )
    })

    test.each([
      ['Home', 36, 0],
      ['End', 35, 100]
    ])('%s jumps to the limit', async (_, keyCode, expected) => {
      const wrapper = mountSlider()

      await getTrackContainer(wrapper).trigger('keydown', { keyCode })

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[expected]])
    })
  })
})
