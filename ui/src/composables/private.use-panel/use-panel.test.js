import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { hSlot } from '../../utils/private.render/render.js'
import usePanel, {
  usePanelChildProps,
  usePanelEmits,
  usePanelProps
} from './use-panel.js'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
  vi.useRealTimers()
})

const Panel = defineComponent({
  name: 'TestPanel',
  props: usePanelChildProps,
  setup(_, { slots }) {
    return () => h('div', { class: 'test-panel' }, hSlot(slots.default))
  }
})

let panelControls

const Parent = defineComponent({
  props: usePanelProps,
  emits: usePanelEmits,

  setup(props, { slots }) {
    panelControls = usePanel()

    return () => {
      panelControls.updatePanelsList(slots)
      return h('div', { class: 'test-parent' }, panelControls.getPanelContent())
    }
  }
})

/**
 * Mounts a parent holding one panel per supplied definition;
 * `[ 'a', 'b' ]` and `[ { name: 'a', disable: true } ]` are both accepted.
 */
function mountPanels({ panels = ['one', 'two', 'three'], ...props } = {}) {
  wrapper = mount(Parent, {
    props: { modelValue: 'one', ...props },
    slots: {
      default: () =>
        panels.map(panel => {
          const panelProps = typeof panel === 'string' ? { name: panel } : panel
          return h(Panel, panelProps, () => panelProps.name)
        })
    }
  })

  return panelControls
}

function getRenderedPanel() {
  return wrapper.find('.q-panel').text()
}

/** The transition is only observable on the vnode that wraps the panel. */
function getTransitionName(controls) {
  return controls.getPanelContent()[0].props.name
}

describe('[usePanel API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)usePanelChildProps]', () => {
      test('is defined correctly', () => {
        expect(usePanelChildProps).$props()
        expect(usePanelChildProps.name.required).toBe(true)
      })
    })

    describe('[(variable)usePanelProps]', () => {
      test('is defined correctly', () => {
        expect(usePanelProps).$props()
        expect(usePanelProps.modelValue.required).toBe(true)
      })
    })

    describe('[(variable)usePanelEmits]', () => {
      test('is defined correctly', () => {
        expect(usePanelEmits).$emits()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const controls = mountPanels()

        expect(controls).toStrictEqual({
          panelIndex: { value: expect.any(Number) },
          panelDirectives: expect.$ref(expect.any(Array)),

          updatePanelsList: expect.any(Function),
          updatePanelIndex: expect.any(Function),

          getPanelContent: expect.any(Function),
          getEnabledPanels: expect.any(Function),
          getPanels: expect.any(Function),

          isValidPanelName: expect.any(Function),

          keepAliveProps: expect.$ref({
            include: void 0,
            exclude: void 0,
            max: void 0
          }),
          needsUniqueKeepAliveWrapper: expect.$ref(false),

          goToPanelByOffset: expect.any(Function),
          goToPanel: expect.any(Function),

          nextPanel: expect.any(Function),
          previousPanel: expect.any(Function)
        })
      })

      test('renders only the panel matching the model', () => {
        mountPanels({ modelValue: 'two' })

        expect(wrapper.findAll('.q-panel')).toHaveLength(1)
        expect(getRenderedPanel()).toBe('two')
      })

      test.each([
        ['undefined', void 0],
        ['null', null],
        ['an empty string', ''],
        ['an unknown name', 'nowhere']
      ])('renders no panel for %s', (_, modelValue) => {
        const controls = mountPanels({ modelValue })

        expect(wrapper.find('.test-panel').exists()).toBe(false)
        expect(controls.isValidPanelName(modelValue)).toBe(
          modelValue === 'nowhere'
        )
      })

      test('renders nothing at all without panels', () => {
        const controls = mountPanels({ panels: [] })

        expect(controls.getPanelContent()).toBeUndefined()
        expect(wrapper.find('.q-panel').exists()).toBe(false)
      })

      test('only collects the valid panels', () => {
        const controls = mountPanels({
          panels: [{ name: 'one' }, { name: '' }, { name: 'two' }]
        })

        expect(
          controls.getPanels().map(panel => panel.props.name)
        ).toStrictEqual(['one', 'two'])
      })

      test('leaves the disabled panels out of the enabled list', () => {
        const controls = mountPanels({
          panels: [
            'one',
            { name: 'two', disable: true },
            { name: 'three', disable: '' }
          ]
        })

        expect(controls.getPanels()).toHaveLength(3)
        expect(
          controls.getEnabledPanels().map(panel => panel.props.name)
        ).toStrictEqual(['one'])
      })

      test('tracks the index of the current panel', async () => {
        const controls = mountPanels()

        expect(controls.panelIndex.value).toBe(0)

        await wrapper.setProps({ modelValue: 'three' })

        expect(controls.panelIndex.value).toBe(2)

        await wrapper.setProps({ modelValue: 'nowhere' })

        expect(controls.panelIndex.value).toBe(-1)
      })

      test('reports the transitions around a panel change', async () => {
        vi.useFakeTimers()
        mountPanels({ transitionDuration: 100 })

        await wrapper.setProps({ modelValue: 'two' })

        expect(wrapper.emitted('beforeTransition')).toStrictEqual([
          ['two', 'one']
        ])
        expect(wrapper.emitted('transition')).toBeUndefined()

        vi.advanceTimersByTime(100)

        expect(wrapper.emitted('transition')).toStrictEqual([['two', 'one']])
      })

      test('stays quiet when the index does not really change', async () => {
        mountPanels({ panels: ['one'] })

        await wrapper.setProps({ modelValue: 'nowhere' })
        await wrapper.setProps({ modelValue: 'also-nowhere' })

        expect(wrapper.emitted('beforeTransition')).toHaveLength(1)
      })

      test('requests a panel change instead of applying it', () => {
        const controls = mountPanels()

        controls.goToPanel('three')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['three']])
        // the model is owned by the consumer, so nothing moved yet
        expect(getRenderedPanel()).toBe('one')
      })

      test.each([
        ['nextPanel', 'nextPanel', 'two'],
        ['previousPanel', 'previousPanel', null]
      ])('walks to the %s', (_, method, expected) => {
        const controls = mountPanels({ modelValue: 'one' })

        controls[method]()

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0] ?? null).toBe(
          expected
        )
      })

      test('skips the disabled panels while walking', () => {
        const controls = mountPanels({
          panels: ['one', { name: 'two', disable: true }, 'three']
        })

        controls.nextPanel()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['three']])
      })

      test('wraps around only when infinite', () => {
        const controls = mountPanels({ modelValue: 'three' })

        controls.nextPanel()
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        wrapper.unmount()

        const infiniteControls = mountPanels({
          modelValue: 'three',
          infinite: true
        })

        infiniteControls.nextPanel()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['one']])
      })

      test('exposes the navigation methods on the parent instance', () => {
        const controls = mountPanels()

        expect(wrapper.vm.next).toBe(controls.nextPanel)
        expect(wrapper.vm.previous).toBe(controls.previousPanel)
        expect(wrapper.vm.goTo).toBe(controls.goToPanel)
      })

      test('publishes the transition duration as a CSS variable', () => {
        mountPanels({ transitionDuration: 500 })

        expect(wrapper.find('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 500ms'
        )
      })

      test('does not transition until the panel changes', () => {
        const controls = mountPanels({ animated: true })

        expect(getTransitionName(controls)).toBeNull()
      })

      test.each([
        ['horizontal', {}, 'slide-left', 'slide-right'],
        ['vertical', { vertical: true }, 'slide-up', 'slide-down'],
        [
          'explicitly named',
          { transitionNext: 'my-next', transitionPrev: 'my-prev' },
          'my-next',
          'my-prev'
        ]
      ])('picks the %s transitions', async (_, props, next, prev) => {
        const controls = mountPanels({
          modelValue: 'two',
          animated: true,
          ...props
        })

        await wrapper.setProps({ modelValue: 'three' })
        expect(getTransitionName(controls)).toBe(`q-transition--${next}`)

        await wrapper.setProps({ modelValue: 'one' })
        expect(getTransitionName(controls)).toBe(`q-transition--${prev}`)
      })

      test('does not transition when it is not animated', async () => {
        const controls = mountPanels()

        await wrapper.setProps({ modelValue: 'three' })

        expect(controls.getPanelContent()[0].type).toBe('div')
      })

      test('wraps the panel in a KeepAlive when asked to', () => {
        const controls = mountPanels({ keepAlive: true })

        expect(controls.needsUniqueKeepAliveWrapper.value).toBe(false)
        expect(getRenderedPanel()).toBe('one')
      })

      test('needs a uniquely named wrapper for a filtered KeepAlive', () => {
        const controls = mountPanels({
          keepAlive: true,
          keepAliveInclude: 'one',
          keepAliveMax: 3
        })

        expect(controls.needsUniqueKeepAliveWrapper.value).toBe(true)
        expect(controls.keepAliveProps.value).toStrictEqual({
          include: 'one',
          exclude: void 0,
          max: 3
        })
        expect(getRenderedPanel()).toBe('one')
      })

      test('validates the panel names', () => {
        const controls = mountPanels()

        expect(controls.isValidPanelName('one')).toBe(true)
        expect(controls.isValidPanelName(0)).toBe(true)
        expect(controls.isValidPanelName('')).toBe(false)
        expect(controls.isValidPanelName(null)).toBe(false)
        expect(controls.isValidPanelName(void 0)).toBe(false)
      })

      test('offers a swipe directive binding', () => {
        const controls = mountPanels({ swipeable: true })
        const [[, handler, , modifiers]] = controls.panelDirectives.value

        expect(handler).toBeTypeOf('function')
        expect(modifiers).toStrictEqual({
          horizontal: true,
          vertical: false,
          mouse: true
        })
      })

      test('swipes towards the next panel', () => {
        const controls = mountPanels({ modelValue: 'one', swipeable: true })
        const [[, onSwipe]] = controls.panelDirectives.value

        onSwipe({ direction: 'left' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['two']])
      })

      test('swipes towards the previous panel', () => {
        const controls = mountPanels({ modelValue: 'two', swipeable: true })
        const [[, onSwipe]] = controls.panelDirectives.value

        onSwipe({ direction: 'right' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([['one']])
      })
    })
  })
})
