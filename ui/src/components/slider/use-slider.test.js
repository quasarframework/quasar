import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, h } from 'vue'

import { useFormAttrs } from '../../composables/use-form/private.use-form.js'
import useSlider, {
  keyCodes,
  useSliderEmits,
  useSliderProps
} from './use-slider.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

/**
 * Mounts the smallest possible slider: the composable drives everything,
 * while the four collaborators it asks for are spied on.
 */
function mountSlider({ slots, ...props } = {}) {
  const updateValue = vi.fn()
  const updatePosition = vi.fn()
  const getDragging = vi.fn(() => ({
    top: 0,
    left: 0,
    width: 200,
    height: 100
  }))
  let slider

  wrapper = mount(
    defineComponent({
      props: {
        ...useSliderProps,
        modelValue: { type: Number, default: 0 }
      },

      emits: useSliderEmits,

      setup(componentProps) {
        slider = useSlider({
          updateValue,
          updatePosition,
          getDragging,
          formAttrs: useFormAttrs(componentProps)
        })

        const ratio = computed(() =>
          slider.methods.convertModelToRatio(componentProps.modelValue)
        )

        const renderThumb = slider.methods.getThumbRenderFn({
          focusValue: true,
          ratio,
          label: computed(() => String(componentProps.modelValue)),
          thumbColor: computed(() => componentProps.thumbColor),
          labelColor: computed(() => componentProps.labelColor),
          labelTextColor: computed(() => componentProps.labelTextColor),
          getNodeData: () => ({ 'data-thumb': 'main' })
        })

        return () =>
          h(
            'div',
            {
              class: slider.state.classes.value
            },
            slider.methods.getContent(
              computed(() => ({ width: '50%' })),
              slider.state.tabindex,
              computed(() => ({ onFocus: () => {} })),
              content => content.push(renderThumb())
            )
          )
      }
    }),
    { props, slots }
  )

  return { slider, updateValue, updatePosition, getDragging }
}

describe('[useSlider API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)keyCodes]', () => {
      test('is defined correctly', () => {
        // PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP, END, HOME
        expect(keyCodes).toStrictEqual([34, 37, 40, 33, 39, 38, 35, 36])
      })
    })

    describe('[(variable)useSliderProps]', () => {
      test('is defined correctly', () => {
        expect(useSliderProps).$props()
      })

      test.each([
        [0, true],
        [0.5, true],
        [10, true],
        [-1, false]
      ])('validates a step of %s as %s', (step, expected) => {
        expect(useSliderProps.step.validator(step)).toBe(expected)
      })
    })

    describe('[(variable)useSliderEmits]', () => {
      test('is defined correctly', () => {
        expect(useSliderEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('can be used in a Vue Component', () => {
        const { slider } = mountSlider()

        expect(slider).toStrictEqual({
          state: {
            active: expect.$ref(false),
            focus: expect.$ref(false),
            preventFocus: expect.$ref(false),
            dragging: expect.$ref(false),

            editable: expect.$ref(true),
            classes: expect.$ref(expect.any(String)),
            tabindex: expect.$ref(0),
            orientation: expect.$ref('horizontal'),

            roundValueFn: expect.$ref(expect.any(Function)),
            keyStep: expect.$ref(1),
            trackLen: expect.$ref(100),
            innerMin: expect.$ref(0),
            innerMinRatio: expect.$ref(0),
            innerMax: expect.$ref(100),
            innerMaxRatio: expect.$ref(1),
            positionProp: expect.$ref('left'),
            sizeProp: expect.$ref('width'),
            isReversed: expect.$ref(false)
          },

          methods: {
            onActivate: expect.any(Function),
            onMobileClick: expect.any(Function),
            onBlur: expect.any(Function),
            onKeyup: expect.any(Function),
            getContent: expect.any(Function),
            getThumbRenderFn: expect.any(Function),
            convertRatioToModel: expect.any(Function),
            convertModelToRatio: expect.any(Function),
            getDraggingRatio: expect.any(Function)
          }
        })
      })

      test.each([
        ['is enabled', {}, true],
        ['is disabled', { disable: true }, false],
        ['is readonly', { readonly: true }, false],
        ['has an empty inner range', { innerMin: 50, innerMax: 50 }, false]
      ])('is editable when it %s: %s', (_, props, expected) => {
        const { slider } = mountSlider(props)

        expect(slider.state.editable.value).toBe(expected)
        expect(slider.state.tabindex.value).toBe(expected ? 0 : -1)
      })

      test('honors an explicit tabindex while editable', () => {
        const { slider } = mountSlider({ tabindex: 3 })

        expect(slider.state.tabindex.value).toBe(3)
      })

      test.each([
        ['within the range', { innerMin: 10, innerMax: 90 }, 10, 90],
        ['clamped to the outer range', { innerMin: -5, innerMax: 200 }, 0, 100],
        ['ignored when not finite', { innerMin: Number.NaN }, 0, 100]
      ])('keeps the inner range %s', (_, props, min, max) => {
        const { slider } = mountSlider(props)

        expect(slider.state.innerMin.value).toBe(min)
        expect(slider.state.innerMax.value).toBe(max)
        expect(slider.state.innerMinRatio.value).toBe(min / 100)
        expect(slider.state.innerMaxRatio.value).toBe(max / 100)
      })

      test.each([
        ['horizontally', {}, 'left', 'width', false],
        ['reversed', { reverse: true }, 'right', 'width', true],
        ['vertically', { vertical: true }, 'top', 'height', false],
        [
          'vertically reversed',
          { vertical: true, reverse: true },
          'bottom',
          'height',
          true
        ]
      ])('lays out %s', (_, props, positionProp, sizeProp, reversed) => {
        const { slider } = mountSlider(props)

        expect(slider.state.positionProp.value).toBe(positionProp)
        expect(slider.state.sizeProp.value).toBe(sizeProp)
        expect(slider.state.isReversed.value).toBe(reversed)
      })

      test.each([
        ['a whole step', 1, 1],
        ['a fractional step', 0.25, 0.25],
        ['a free step', 0, 1]
      ])('derives the keyboard step out of %s', (_, step, expected) => {
        const { slider } = mountSlider({ step })

        expect(slider.state.keyStep.value).toBe(expected)
      })

      test.each([
        ['keeps the value untouched', 0, 12.3456, 12.3456],
        ['rounds to whole numbers', 1, 12.3456, 12],
        ['rounds to the step decimals', 0.01, 12.3456, 12.35]
      ])('%s', (_, step, value, expected) => {
        const { slider } = mountSlider({ step })

        expect(slider.state.roundValueFn.value(value)).toBe(expected)
      })

      test.each([
        ['the minimum', 0, 0],
        ['the middle', 0.5, 50],
        ['the maximum', 1, 100]
      ])('converts %s ratio into a model value', (_, ratio, expected) => {
        const { slider } = mountSlider()

        expect(slider.methods.convertRatioToModel(ratio)).toBe(expected)
      })

      test('snaps a converted value onto the step', () => {
        const { slider } = mountSlider({ step: 25 })

        expect(slider.methods.convertRatioToModel(0.44)).toBe(50)
        expect(slider.methods.convertRatioToModel(0.36)).toBe(25)
      })

      test('never converts outside of the inner range', () => {
        const { slider } = mountSlider({ innerMin: 20, innerMax: 80 })

        expect(slider.methods.convertRatioToModel(0)).toBe(20)
        expect(slider.methods.convertRatioToModel(1)).toBe(80)
      })

      test.each([
        ['a plain range', {}, 25, 0.25],
        ['an offset range', { min: 100, max: 200 }, 150, 0.5],
        ['a zero-length range', { min: 5, max: 5 }, 5, 0]
      ])(
        'converts a model value of %s into a ratio',
        (_, props, model, ratio) => {
          const { slider } = mountSlider(props)

          expect(slider.methods.convertModelToRatio(model)).toBe(ratio)
        }
      )

      test.each([
        ['horizontally', {}, { left: 50, top: 0 }, 0.25],
        ['reversed', { reverse: true }, { left: 50, top: 0 }, 0.75],
        ['vertically', { vertical: true }, { left: 0, top: 25 }, 0.25]
      ])('derives the dragging ratio %s', (_, props, pos, expected) => {
        const { slider, getDragging } = mountSlider(props)
        const draggingInfo = getDragging()

        const ratio = slider.methods.getDraggingRatio(
          { clientX: pos.left, clientY: pos.top, type: 'mousedown' },
          draggingInfo
        )

        expect(ratio).toBeCloseTo(expected, 5)
      })

      test('clamps the dragging ratio to the inner range', () => {
        const { slider, getDragging } = mountSlider({
          innerMin: 40,
          innerMax: 60
        })

        expect(
          slider.methods.getDraggingRatio(
            { clientX: 0, clientY: 0, type: 'mousedown' },
            getDragging()
          )
        ).toBe(0.4)
        expect(
          slider.methods.getDraggingRatio(
            { clientX: 200, clientY: 0, type: 'mousedown' },
            getDragging()
          )
        ).toBe(0.6)
      })

      test('exposes the orientation for assistive technology', async () => {
        // the ARIA attribute set itself is built by the consumers on their
        // focusable element (see QSlider.test.js / QRange.test.js)
        const { slider } = mountSlider()

        expect(slider.state.orientation.value).toBe('horizontal')

        await wrapper.setProps({ vertical: true })

        expect(slider.state.orientation.value).toBe('vertical')
      })

      test.each([
        ['vertical', { vertical: true }, 'q-slider--v'],
        ['dense', { dense: true }, 'q-slider--dense'],
        ['labeled', { label: true }, 'q-slider--label'],
        ['always labeled', { labelAlways: true }, 'q-slider--label-always'],
        ['disabled', { disable: true }, 'disabled'],
        ['dark', { dark: true }, 'q-slider--dark']
      ])('classes itself as %s', (_, props, className) => {
        const { slider } = mountSlider(props)

        expect(slider.state.classes.value.split(' ')).toContain(className)
      })

      test('activates on a mouse interaction and settles on release', () => {
        const { slider, updateValue, updatePosition, getDragging } =
          mountSlider()
        const event = { type: 'mousedown' }

        slider.methods.onActivate(event)

        expect(getDragging).toHaveBeenCalledExactlyOnceWith(event)
        expect(updatePosition).toHaveBeenCalledExactlyOnceWith(
          event,
          expect.any(Object)
        )
        expect(updateValue).toHaveBeenCalledExactlyOnceWith()
        expect(slider.state.active.value).toBe(true)
        expect(slider.state.preventFocus.value).toBe(true)

        document.dispatchEvent(new MouseEvent('mouseup'))

        expect(slider.state.active.value).toBe(false)
        expect(slider.state.preventFocus.value).toBe(false)
        expect(slider.state.focus.value).toBe(false)
        expect(updateValue).toHaveBeenLastCalledWith(true)
      })

      test('stops listening for the release once unmounted', () => {
        const { slider, updateValue } = mountSlider()

        slider.methods.onActivate({ type: 'mousedown' })
        wrapper.unmount()
        wrapper = void 0

        updateValue.mockClear()
        document.dispatchEvent(new MouseEvent('mouseup'))

        expect(updateValue).not.toHaveBeenCalled()
      })

      test('applies a mobile tap right away', () => {
        const { slider, updateValue, updatePosition } = mountSlider()
        const event = { type: 'click' }

        slider.methods.onMobileClick(event)

        expect(updatePosition).toHaveBeenCalledExactlyOnceWith(
          event,
          expect.any(Object)
        )
        expect(updateValue).toHaveBeenCalledExactlyOnceWith(true)
      })

      test.each([
        ...keyCodes.map(keyCode => [`the handled key ${keyCode}`, keyCode, 1]),
        ['any other key', 65, 0]
      ])('settles the value on keyup for %s', (_, keyCode, calls) => {
        const { slider, updateValue } = mountSlider()

        slider.methods.onKeyup({ keyCode })

        expect(updateValue).toHaveBeenCalledTimes(calls)
        if (calls !== 0) {
          expect(updateValue).toHaveBeenCalledWith(true)
        }
      })

      test('drops the focus on blur', () => {
        const { slider } = mountSlider()

        slider.state.focus.value = 'both'
        slider.methods.onBlur()

        expect(slider.state.focus.value).toBe(false)
      })

      test('renders the track, the inner bar and the selection', () => {
        mountSlider()

        expect(wrapper.find('.q-slider__track-container').exists()).toBe(true)
        expect(wrapper.find('.q-slider__track').exists()).toBe(true)
        expect(wrapper.find('.q-slider__inner').exists()).toBe(true)
        expect(wrapper.get('.q-slider__selection').$style('width')).toBe('50%')
      })

      test.each([
        [
          'the inner bar',
          { innerTrackColor: 'transparent' },
          '.q-slider__inner'
        ],
        [
          'the selection',
          { selectionColor: 'transparent' },
          '.q-slider__selection'
        ]
      ])('leaves out %s when asked to', (_, props, selector) => {
        mountSlider(props)

        expect(wrapper.find(selector).exists()).toBe(false)
      })

      test('shows the markers only when asked to', async () => {
        mountSlider()

        expect(wrapper.find('.q-slider__markers').exists()).toBe(false)

        await wrapper.setProps({ markers: 25 })

        // one tick every 25% of the inner bar
        expect(wrapper.get('.q-slider__markers').$style('backgroundSize')).toBe(
          '25% 2px'
        )
      })

      test('colors the track and the selection', () => {
        mountSlider({ trackColor: 'red', selectionColor: 'blue' })

        expect(wrapper.get('.q-slider__track').classes()).toContain('bg-red')
        expect(wrapper.get('.q-slider__selection').classes()).toContain(
          'text-blue'
        )
      })

      test('sizes the track and the thumb', () => {
        mountSlider({ trackSize: '8px', thumbSize: '30px' })

        expect(wrapper.get('.q-slider__track').$style('height')).toBe('8px')
        expect(wrapper.get('.q-slider__thumb').$style('width')).toBe('30px')
      })

      test('places the thumb at the model ratio', async () => {
        mountSlider({ modelValue: 25 })

        expect(wrapper.get('.q-slider__thumb').$style('left')).toBe('25%')

        await wrapper.setProps({ modelValue: 75 })

        expect(wrapper.get('.q-slider__thumb').$style('left')).toBe('75%')
      })

      test('renders the thumb label only when there is one', async () => {
        mountSlider({ modelValue: 42 })

        expect(wrapper.find('.q-slider__pin').exists()).toBe(false)

        await wrapper.setProps({ label: true })

        expect(wrapper.get('.q-slider__text').text()).toBe('42')
      })

      test('colors the thumb and its label', () => {
        mountSlider({
          label: true,
          thumbColor: 'red',
          labelColor: 'green',
          labelTextColor: 'blue'
        })

        expect(wrapper.get('.q-slider__thumb').classes()).toContain('text-red')
        expect(wrapper.get('.q-slider__pin').classes()).toContain('text-green')
        expect(wrapper.get('.q-slider__text').classes()).toContain('text-blue')
      })

      test('injects a hidden form input when it is named', async () => {
        mountSlider({ modelValue: 42 })

        expect(wrapper.find('input').exists()).toBe(false)

        await wrapper.setProps({ name: 'volume' })

        const input = wrapper.get('input')

        expect(input.attributes('name')).toBe('volume')
        expect(input.element.value).toBe('42')

        await wrapper.setProps({ disable: true })

        expect(wrapper.find('input').exists()).toBe(false)
      })

      test.each([
        [
          'every step',
          { markerLabels: true, step: 25 },
          ['0', '25', '50', '75', '100']
        ],
        [
          'a custom step',
          { markerLabels: true, markers: 50 },
          ['0', '50', '100']
        ],
        [
          'an array',
          {
            markerLabels: [
              { value: 0, label: 'low' },
              { value: 100 },
              { value: 500 }
            ]
          },
          ['low', '100']
        ],
        [
          'an object',
          { markerLabels: { 0: 'zero', 50: 'half' } },
          ['zero', 'half']
        ],
        [
          'a function',
          { markerLabels: v => `#${v}`, markers: 50 },
          ['#0', '#50', '#100']
        ]
      ])('builds the marker labels out of %s', (_, props, expected) => {
        mountSlider(props)

        expect(
          wrapper.findAll('.q-slider__marker-labels').map(label => label.text())
        ).toStrictEqual(expected)
      })

      test('positions each marker label along the track', () => {
        mountSlider({ markerLabels: { 0: 'a', 50: 'b' } })

        const [first, second] = wrapper.findAll('.q-slider__marker-labels')

        expect(first.$style('left')).toBe('0%')
        expect(second.$style('left')).toBe('50%')
      })

      test('lets a slot render each marker label', () => {
        mountSlider({
          markerLabels: true,
          markers: 50,
          slots: {
            'marker-label': ({ marker }) =>
              h('div', { class: 'my-label' }, `v${marker.value}`)
          }
        })

        expect(wrapper.findAll('.my-label').map(el => el.text())).toStrictEqual(
          ['v0', 'v50', 'v100']
        )
      })

      test('lets a slot render the whole marker group', () => {
        const markerLabelGroup = vi.fn(() => h('div', { class: 'my-group' }))

        mountSlider({
          markerLabels: true,
          markers: 50,
          slots: { 'marker-label-group': markerLabelGroup }
        })

        expect(wrapper.find('.my-group').exists()).toBe(true)
        expect(markerLabelGroup).toHaveBeenCalledWith({
          markerList: expect.any(Array),
          markerMap: expect.any(Object),
          classes: expect.any(String),
          getStyle: expect.any(Function)
        })
      })

      test('moves the marker labels to the other side when switched', () => {
        mountSlider({
          markerLabels: true,
          markers: 50,
          switchMarkerLabelsSide: true
        })

        const container = wrapper.get('.q-slider__marker-labels-container')

        // the whole group comes before the track now
        expect([...wrapper.element.children].indexOf(container.element)).toBe(0)
        expect(wrapper.get('.q-slider__marker-labels').classes()).toContain(
          'q-slider__marker-labels--h-switched'
        )
      })

      test('follows the label side for the marker labels container', async () => {
        mountSlider({ markerLabels: true })

        expect(
          wrapper.get('.q-slider__marker-labels-container').classes()
        ).toContain('q-slider__marker-labels-container--h-standard')

        await wrapper.setProps({ switchLabelSide: true })

        expect(
          wrapper.get('.q-slider__marker-labels-container').classes()
        ).toContain('q-slider__marker-labels-container--h-switched')
      })

      test('adds the requested class to the marker labels container', () => {
        mountSlider({ markerLabels: true, markerLabelsClass: 'my-markers' })

        expect(
          wrapper.get('.q-slider__marker-labels-container').classes()
        ).toContain('my-markers')
      })

      test('leaves out the marker labels by default', () => {
        mountSlider()

        expect(
          wrapper.find('.q-slider__marker-labels-container').exists()
        ).toBe(false)
      })
    })
  })
})
