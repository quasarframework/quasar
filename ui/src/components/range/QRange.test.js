import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'

import QRange from './QRange.js'

function mountRange(props, slots) {
  props ||= {}

  return mount(QRange, {
    props: {
      modelValue: { min: 20, max: 60 },
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

function getThumbs(wrapper) {
  return wrapper.findAll('.q-slider__thumb')
}

function getMinThumb(wrapper) {
  return getThumbs(wrapper)[0]
}

function getMaxThumb(wrapper) {
  return getThumbs(wrapper)[1]
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

function getLabelTexts(wrapper) {
  return wrapper.findAll('.q-slider__text')
}

/**
 * The range is given an explicit 100x10 track so that converting a pointer
 * position into a model value stays simple, deterministic math instead of
 * depending on the real rendered width.
 */
function giveRangeSize(wrapper) {
  wrapper.element.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    width: 100,
    height: 10
  })
}

async function pressAt(wrapper, { clientX = 0, clientY = 0 } = {}) {
  giveRangeSize(wrapper)

  await getTrackContainer(wrapper).trigger('mousedown', { clientX, clientY })
}

async function clickAt(wrapper, position) {
  await pressAt(wrapper, position)

  document.dispatchEvent(new MouseEvent('mouseup'))
  await nextTick()
}

/**
 * Simulates a drag on the track through the TouchPan directive handler.
 */
async function panFrom(wrapper, fromX, toX) {
  giveRangeSize(wrapper)

  const handler = getTrackContainer(wrapper).element.__qtouchpan.handler

  handler({ isFirst: true, evt: { clientX: fromX, clientY: 0 } })
  handler({ evt: { clientX: toX, clientY: 0 } })
  await nextTick()
}

async function focusAndPress(thumb, keyCode = 39) {
  await thumb.trigger('focus')
  await thumb.trigger('keydown', { keyCode })
}

describe('[QRange API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', async () => {
        const propVal = 'car_id'
        const wrapper = mountRange()

        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.setProps({ name: propVal })

        const input = wrapper.get('input[type="hidden"]')
        expect(input.attributes('name')).toBe(propVal)
        // both ends of the range are submitted through a single input
        expect(input.attributes('value')).toBe('20|60')
      })
    })

    describe('[(prop)min]', () => {
      test('type Number has effect', async () => {
        const propVal = 0
        const wrapper = mountRange({ min: propVal })

        expect(wrapper.attributes('aria-valuemin')).toBe(String(propVal))
        expect(getMinThumb(wrapper).$style('left')).toBe('20%')

        await wrapper.setProps({ min: -100 })

        expect(wrapper.attributes('aria-valuemin')).toBe('-100')
        expect(getMinThumb(wrapper).$style('left')).toBe('60%')
        expect(getMaxThumb(wrapper).$style('left')).toBe('80%')
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountRange({ max: propVal })

        expect(wrapper.attributes('aria-valuemax')).toBe(String(propVal))
        expect(getMaxThumb(wrapper).$style('left')).toBe('60%')

        await wrapper.setProps({ max: 200 })

        expect(wrapper.attributes('aria-valuemax')).toBe('200')
        expect(getMaxThumb(wrapper).$style('left')).toBe('30%')
      })
    })

    describe('[(prop)inner-min]', () => {
      test('type Number has effect', async () => {
        const propVal = 30
        const wrapper = mountRange()

        expect(getMinThumb(wrapper).$style('left')).toBe('20%')

        await wrapper.setProps({ innerMin: propVal })

        // the model gets pushed inside of the allowed range
        expect(wrapper.attributes('aria-valuemin')).toBe(String(propVal))
        expect(getMinThumb(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('width')).toBe('70%')
      })
    })

    describe('[(prop)inner-max]', () => {
      test('type Number has effect', async () => {
        const propVal = 50
        const wrapper = mountRange()

        expect(getMaxThumb(wrapper).$style('left')).toBe('60%')

        await wrapper.setProps({ innerMax: propVal })

        expect(wrapper.attributes('aria-valuemax')).toBe(String(propVal))
        expect(getMaxThumb(wrapper).$style('left')).toBe(`${propVal}%`)
        expect(getInnerTrack(wrapper).$style('width')).toBe(`${propVal}%`)
      })
    })

    describe('[(prop)step]', () => {
      test('type Number has effect', async () => {
        const propVal = 1
        const wrapper = mountRange({ step: propVal })

        expect(wrapper.attributes('data-step')).toBe(String(propVal))

        await focusAndPress(getMinThumb(wrapper))

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          [{ min: 21, max: 60 }]
        ])

        const stepWrapper = mountRange({ step: 10 })
        await focusAndPress(getMinThumb(stepWrapper))

        expect(stepWrapper.emitted('update:modelValue')).toStrictEqual([
          [{ min: 30, max: 60 }]
        ])
      })

      test('only accepts a positive value', () => {
        const { validator, default: defaultValue } = QRange.props.step

        expect(validator(defaultValue)).toBe(true)
        expect(validator(0)).toBe(true)
        expect(validator(-1)).toBe(false)
      })
    })

    describe('[(prop)snap]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({
          step: 10,
          modelValue: { min: 0, max: 90 }
        })

        // while dragging, the thumb follows the pointer even though
        // the value itself always snaps to the step
        await pressAt(wrapper, { clientX: 13 })

        expect(wrapper.emitted('update:modelValue')[0]).toStrictEqual([
          { min: 10, max: 90 }
        ])
        expect(getMinThumb(wrapper).$style('left')).toBe('13%')

        const snapWrapper = mountRange({
          step: 10,
          modelValue: { min: 0, max: 90 },
          snap: true
        })

        await pressAt(snapWrapper, { clientX: 13 })

        expect(snapWrapper.emitted('update:modelValue')[0]).toStrictEqual([
          { min: 10, max: 90 }
        ])
        // with it, the thumb snaps along
        expect(getMinThumb(snapWrapper).$style('left')).toBe('10%')
      })
    })

    describe('[(prop)reverse]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange()

        expect(getMinThumb(wrapper).$style('left')).toBe('20%')

        await wrapper.setProps({ reverse: true })

        // everything gets measured from the other end
        expect(getMinThumb(wrapper).$style('left')).toBe('')
        expect(getMinThumb(wrapper).$style('right')).toBe('20%')
        expect(getSelection(wrapper).$style('right')).toBe('20%')
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange()

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--h', 'column'])
        )
        expect(wrapper.attributes('aria-orientation')).toBe('horizontal')

        await wrapper.setProps({ vertical: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--v', 'row'])
        )
        expect(wrapper.attributes('aria-orientation')).toBe('vertical')
        expect(getMinThumb(wrapper).$style('top')).toBe('20%')
        expect(getSelection(wrapper).$style('height')).toBe('40%')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange()

        expect(getSelection(wrapper).classes()).not.toContain(`text-${propVal}`)

        await wrapper.setProps({ color: propVal })

        expect(getSelection(wrapper).classes()).toContain(`text-${propVal}`)
        expect(
          getThumbs(wrapper).every(thumb =>
            thumb.classes().includes(`text-${propVal}`)
          )
        ).toBe(true)
      })
    })

    describe('[(prop)track-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange()

        expect(getTrack(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ trackColor: propVal })

        expect(getTrack(wrapper).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)track-img]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-pattern.png'
        const wrapper = mountRange()

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
        const wrapper = mountRange()

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
        const wrapper = mountRange()

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
        const wrapper = mountRange({ color: 'accent' })

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
        const wrapper = mountRange()

        expect(getSelection(wrapper).$style('backgroundImage')).toBe('')

        await wrapper.setProps({ selectionImg: propVal })

        expect(getSelection(wrapper).$style('backgroundImage')).toBe(
          `url("${propVal}")`
        )
      })
    })

    describe('[(prop)label]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange()

        expect(wrapper.classes()).not.toContain('q-slider--label')
        expect(wrapper.find('.q-slider__pin').exists()).toBe(false)

        await wrapper.setProps({ label: true })

        expect(wrapper.classes()).toContain('q-slider--label')
        // one label for each end of the range
        expect(getLabelTexts(wrapper).map(text => text.text())).toStrictEqual([
          '20',
          '60'
        ])
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true })

        await wrapper.setProps({ labelColor: propVal })

        expect(
          wrapper
            .findAll('.q-slider__pin')
            .every(pin => pin.classes().includes(`text-${propVal}`))
        ).toBe(true)
      })
    })

    describe('[(prop)label-text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true })

        await wrapper.setProps({ labelTextColor: propVal })

        expect(
          getLabelTexts(wrapper).every(text =>
            text.classes().includes(`text-${propVal}`)
          )
        ).toBe(true)
      })
    })

    describe('[(prop)switch-label-side]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ label: true })

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
        const wrapper = mountRange()

        expect(wrapper.classes()).not.toContain('q-slider--label-always')

        await wrapper.setProps({ labelAlways: true })

        // the labels show up even without the "label" prop
        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--label', 'q-slider--label-always'])
        )
        expect(wrapper.findAll('.q-slider__pin')).toHaveLength(2)
      })
    })

    describe('[(prop)markers]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ step: 25 })

        expect(wrapper.find('.q-slider__markers').exists()).toBe(false)

        await wrapper.setProps({ markers: true })

        // one marker for every step
        expect(wrapper.get('.q-slider__markers').$style('backgroundSize')).toBe(
          '25% 2px'
        )
      })

      test('type Number has effect', () => {
        const propVal = 5
        const wrapper = mountRange({ markers: propVal })

        expect(wrapper.get('.q-slider__markers').$style('backgroundSize')).toBe(
          `${propVal}% 2px`
        )
      })
    })

    describe('[(prop)marker-labels]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ step: 25 })

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
        const wrapper = mountRange({ markerLabels: propVal })

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
        const wrapper = mountRange({ markerLabels: propVal })

        const labels = getMarkerLabels(wrapper)
        expect(labels.map(label => label.text())).toStrictEqual(['0%', '5%'])
        expect(labels[1].classes()).toContain('my-class')
        expect(labels[1].$style('left')).toBe('5%')
      })

      test('type Function has effect', () => {
        const propVal = val => 10 * val + '%'
        const wrapper = mountRange({ step: 25, markerLabels: propVal })

        expect(
          getMarkerLabels(wrapper).map(label => label.text())
        ).toStrictEqual(['0%', '250%', '500%', '750%', '1000%'])
      })
    })

    describe('[(prop)marker-labels-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'text-orange'
        const wrapper = mountRange({ step: 25, markerLabels: true })

        expect(getMarkerLabelsContainer(wrapper).classes()).not.toContain(
          propVal
        )

        await wrapper.setProps({ markerLabelsClass: propVal })

        expect(getMarkerLabelsContainer(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)switch-marker-labels-side]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ step: 25, markerLabels: true })

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
        const wrapper = mountRange()

        expect(getTrack(wrapper).$style('height')).toBe('4px')

        await wrapper.setProps({ trackSize: propVal })

        expect(getTrack(wrapper).$style('height')).toBe(propVal)
      })
    })

    describe('[(prop)thumb-size]', () => {
      test('type String has effect', async () => {
        const propVal = '32px'
        const wrapper = mountRange()

        expect(getMinThumb(wrapper).$style('width')).toBe('20px')

        await wrapper.setProps({ thumbSize: propVal })

        expect(getMinThumb(wrapper).$style('width')).toBe(propVal)
        expect(getMaxThumb(wrapper).$style('height')).toBe(propVal)
      })
    })

    describe('[(prop)thumb-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ color: 'accent' })

        expect(getMinThumb(wrapper).classes()).toContain('text-accent')

        await wrapper.setProps({ thumbColor: propVal })

        // it takes precedence over the general color, for both thumbs
        expect(
          getThumbs(wrapper).every(thumb =>
            thumb.classes().includes(`text-${propVal}`)
          )
        ).toBe(true)
        expect(getSelection(wrapper).classes()).toContain('text-accent')
      })
    })

    describe('[(prop)thumb-path]', () => {
      test('type String has effect', async () => {
        const propVal = 'M5 5 h10 v10 h-10 v-10 z'
        const wrapper = mountRange()

        expect(wrapper.get('.q-slider__thumb-shape path').attributes('d')).toBe(
          QRange.props.thumbPath.default
        )

        await wrapper.setProps({ thumbPath: propVal })

        expect(
          wrapper
            .findAll('.q-slider__thumb-shape path')
            .every(path => path.attributes('d') === propVal)
        ).toBe(true)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange()

        expect(wrapper.classes()).not.toContain('q-slider--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-slider--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountRange({ dark: null })

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
        const wrapper = mountRange()

        expect(wrapper.classes()).not.toContain('q-slider--dense')

        await wrapper.setProps({ dense: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-slider--dense', 'q-slider--dense--h'])
        )
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ name: 'car_id' })

        expect(getMinThumb(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-slider--editable')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(getMinThumb(wrapper).attributes('tabindex')).toBe('-1')
        expect(getTrackContainer(wrapper).element.__qtouchpan).toBeUndefined()
        // nothing gets submitted while disabled
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await focusAndPress(getMinThumb(wrapper))

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ name: 'car_id' })

        await wrapper.setProps({ readonly: true })

        expect(wrapper.classes()).not.toContain('disabled')
        expect(wrapper.classes()).not.toContain('q-slider--editable')
        expect(wrapper.attributes('aria-readonly')).toBe('true')
        expect(getMinThumb(wrapper).attributes('tabindex')).toBe('-1')
        // unlike "disable", the value still gets submitted
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(true)

        await focusAndPress(getMinThumb(wrapper))

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', async () => {
        const propVal = 100
        const wrapper = mountRange()

        expect(getMinThumb(wrapper).attributes('tabindex')).toBe('0')

        await wrapper.setProps({ tabindex: propVal })

        expect(
          getThumbs(wrapper).every(
            thumb => thumb.attributes('tabindex') === String(propVal)
          )
        ).toBe(true)
      })

      test('type String has effect', () => {
        const wrapper = mountRange({ tabindex: '3' })

        expect(getMinThumb(wrapper).attributes('tabindex')).toBe('3')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Object has effect', () => {
        const propVal = { min: 10, max: 40 }
        const wrapper = mountRange({ modelValue: propVal })

        expect(wrapper.attributes('aria-valuenow')).toBe('10|40')
        expect(wrapper.classes()).not.toContain('q-slider--no-value')
        expect(getMinThumb(wrapper).$style('left')).toBe('10%')
        expect(getMaxThumb(wrapper).$style('left')).toBe('40%')
        expect(getSelection(wrapper).$style('left')).toBe('10%')
        expect(
          Number.parseFloat(getSelection(wrapper).$style('width'))
        ).toBeCloseTo(30, 5)
      })

      test('type null has effect', () => {
        // it is treated the same as an empty range
        const wrapper = mountRange({ modelValue: null })

        expect(wrapper.attributes('aria-valuenow')).toBe('null|null')
        expect(wrapper.classes()).toContain('q-slider--no-value')
        expect(getMinThumb(wrapper).$style('left')).toBe('0%')
        expect(getMaxThumb(wrapper).$style('left')).toBe('100%')
      })

      test('type undefined has effect', () => {
        // it falls back to an empty range
        const wrapper = mountRange({ modelValue: void 0 })

        expect(wrapper.attributes('aria-valuenow')).toBe('null|null')
        expect(wrapper.classes()).toContain('q-slider--no-value')
        // the thumbs sit at both ends of the track
        expect(getMinThumb(wrapper).$style('left')).toBe('0%')
        expect(getMaxThumb(wrapper).$style('left')).toBe('100%')
      })

      test('only accepts a min/max object', () => {
        const { validator, default: getDefault } = QRange.props.modelValue

        expect(validator(getDefault())).toBe(true)
        expect(validator({ min: 1, max: 2 })).toBe(true)
        expect(validator({ min: 1 })).toBe(false)
      })
    })

    describe('[(prop)drag-range]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange()

        expect(
          getTrackContainer(wrapper).attributes('tabindex')
        ).toBeUndefined()

        await wrapper.setProps({ dragRange: true })

        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('0')

        // the whole range moves as one
        await getTrackContainer(wrapper).trigger('focus')
        await getTrackContainer(wrapper).trigger('keydown', { keyCode: 39 })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          [{ min: 21, max: 61 }]
        ])
      })

      test('drags the range as a whole', async () => {
        const wrapper = mountRange({ dragRange: true })

        // grabbing the middle of the range and moving it to the right
        await panFrom(wrapper, 40, 50)

        expect(wrapper.emitted('update:modelValue').at(-1)).toStrictEqual([
          { min: 30, max: 70 }
        ])
      })
    })

    describe('[(prop)drag-only-range]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRange({ dragOnlyRange: true })

        // the thumbs are not individually reachable anymore
        expect(
          getThumbs(wrapper).every(
            thumb => thumb.attributes('tabindex') === void 0
          )
        ).toBe(true)
        expect(getTrackContainer(wrapper).attributes('tabindex')).toBe('0')

        // dragging always moves the whole range, never a single end
        await panFrom(wrapper, 30, 40)

        expect(wrapper.emitted('update:modelValue').at(-1)).toStrictEqual([
          { min: 30, max: 70 }
        ])

        // without it, the same drag only moves the closest thumb
        const plainWrapper = mountRange()
        await panFrom(plainWrapper, 30, 40)

        expect(plainWrapper.emitted('update:modelValue').at(-1)).toStrictEqual([
          { min: 40, max: 60 }
        ])
      })
    })

    describe('[(prop)left-label-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true, labelColor: 'accent' })

        await wrapper.setProps({ leftLabelColor: propVal })

        const pins = wrapper.findAll('.q-slider__pin')
        expect(pins[0].classes()).toContain(`text-${propVal}`)
        expect(pins[1].classes()).toContain('text-accent')
      })
    })

    describe('[(prop)left-label-text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true, labelTextColor: 'accent' })

        await wrapper.setProps({ leftLabelTextColor: propVal })

        const texts = getLabelTexts(wrapper)
        expect(texts[0].classes()).toContain(`text-${propVal}`)
        expect(texts[1].classes()).toContain('text-accent')
      })
    })

    describe('[(prop)right-label-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true, labelColor: 'accent' })

        await wrapper.setProps({ rightLabelColor: propVal })

        const pins = wrapper.findAll('.q-slider__pin')
        expect(pins[0].classes()).toContain('text-accent')
        expect(pins[1].classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)right-label-text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ label: true, labelTextColor: 'accent' })

        await wrapper.setProps({ rightLabelTextColor: propVal })

        const texts = getLabelTexts(wrapper)
        expect(texts[0].classes()).toContain('text-accent')
        expect(texts[1].classes()).toContain(`text-${propVal}`)
      })
    })

    describe('[(prop)left-label-value]', () => {
      test('type String has effect', async () => {
        const propVal = 'twenty'
        const wrapper = mountRange({ label: true })

        expect(getLabelTexts(wrapper)[0].text()).toBe('20')

        await wrapper.setProps({ leftLabelValue: propVal })

        expect(getLabelTexts(wrapper)[0].text()).toBe(propVal)
        expect(getLabelTexts(wrapper)[1].text()).toBe('60')
      })

      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountRange({ label: true })

        await wrapper.setProps({ leftLabelValue: propVal })

        expect(getLabelTexts(wrapper)[0].text()).toBe(String(propVal))
      })
    })

    describe('[(prop)right-label-value]', () => {
      test('type String has effect', async () => {
        const propVal = 'sixty'
        const wrapper = mountRange({ label: true })

        expect(getLabelTexts(wrapper)[1].text()).toBe('60')

        await wrapper.setProps({ rightLabelValue: propVal })

        expect(getLabelTexts(wrapper)[1].text()).toBe(propVal)
        expect(getLabelTexts(wrapper)[0].text()).toBe('20')
      })

      test('type Number has effect', async () => {
        const propVal = 10
        const wrapper = mountRange({ label: true })

        await wrapper.setProps({ rightLabelValue: propVal })

        expect(getLabelTexts(wrapper)[1].text()).toBe(String(propVal))
      })
    })

    describe('[(prop)left-thumb-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ thumbColor: 'accent' })

        await wrapper.setProps({ leftThumbColor: propVal })

        expect(getMinThumb(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getMaxThumb(wrapper).classes()).toContain('text-accent')
      })
    })

    describe('[(prop)right-thumb-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountRange({ thumbColor: 'accent' })

        await wrapper.setProps({ rightThumbColor: propVal })

        expect(getMaxThumb(wrapper).classes()).toContain(`text-${propVal}`)
        expect(getMinThumb(wrapper).classes()).toContain('text-accent')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)marker-label]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'some-slot-content'
        const wrapper = mountRange(
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
        const wrapper = mountRange(
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
        const wrapper = mountRange()

        await clickAt(wrapper, { clientX: 10 })

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('change')
        expect(eventList.change).toHaveLength(1)

        const [value] = eventList.change[0]
        expect(value).toStrictEqual({ min: 10, max: 60 })
      })

      test('is emitting on keyboard navigation', async () => {
        const wrapper = mountRange()
        const thumb = getMinThumb(wrapper)

        await focusAndPress(thumb)
        expect(wrapper.emitted('change')).toBeUndefined()

        await thumb.trigger('keyup', { keyCode: 39 })

        expect(wrapper.emitted('change')).toStrictEqual([
          [{ min: 21, max: 60 }]
        ])
      })
    })

    describe('[(event)pan]', () => {
      test('is emitting', async () => {
        const wrapper = mountRange()
        giveRangeSize(wrapper)

        const handler = getTrackContainer(wrapper).element.__qtouchpan.handler

        handler({ isFirst: true, evt: { clientX: 10, clientY: 0 } })
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
          evt: { clientX: 30, clientY: 0 }
        })
        await nextTick()

        eventList = wrapper.emitted()
        expect(eventList.pan).toHaveLength(2)
        expect(eventList.pan[1]).toStrictEqual(['end'])
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountRange()

        await focusAndPress(getMinThumb(wrapper))

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toStrictEqual({ min: 21, max: 60 })
      })
    })
  })
})
