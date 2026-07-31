import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import QCarousel from './QCarousel.js'
import QCarouselSlide from './QCarouselSlide.js'

let activeWrapper

afterEach(() => {
  activeWrapper?.unmount()
  activeWrapper = void 0
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function createCounter(name) {
  return defineComponent({
    name,
    data: () => ({ count: 0 }),
    template: `<button data-slide="${name}" @click="count++">{{ count }}</button>`
  })
}

function mountCarousel(props, slides, slots) {
  props ||= {}
  slots ||= {}

  const slideList = slides || [
    ['slide-a', createCounter('SlideA')],
    ['slide-b', createCounter('SlideB')],
    ['slide-c', createCounter('SlideC')]
  ]

  activeWrapper = mount(QCarousel, {
    props: { modelValue: 'slide-a', ...props },
    slots: {
      default: () =>
        slideList.map(([name, component, slideProps = {}]) =>
          h(QCarouselSlide, { name, ...slideProps }, () => h(component))
        ),
      ...slots
    },
    attachTo: document.body
  })

  return activeWrapper
}

async function expectSlideCached(filterProps) {
  const wrapper = mountCarousel({ keepAlive: true, ...filterProps })

  await wrapper.get('button').trigger('click')
  expect(wrapper.get('button').text()).toBe('1')

  await wrapper.setProps({ modelValue: 'slide-b' })
  await wrapper.setProps({ modelValue: 'slide-a' })

  expect(wrapper.get('button').text()).toBe('1')
}

function getNavigationIcons(wrapper) {
  return wrapper.findAll('.q-carousel__navigation-icon')
}

describe('[QCarousel API]', () => {
  describe('[Props]', () => {
    describe('[(prop)fullscreen]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.classes()).not.toContain('fullscreen')

        await wrapper.setProps({ fullscreen: true })

        expect(wrapper.classes()).toContain('fullscreen')
        expect(document.body.classList).toContain('q-body--fullscreen-mixin')

        await wrapper.setProps({ fullscreen: false })

        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(prop)no-route-fullscreen-exit]', () => {
      test('type Boolean has effect', () => {
        // without a router there is nothing to exit on, so the prop is
        // only a flag read by the route watcher
        const wrapper = mountCarousel({ noRouteFullscreenExit: true })

        expect(wrapper.vm.$props.noRouteFullscreenExit).toBe(true)
        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.get('button').attributes('data-slide')).toBe('SlideA')

        await wrapper.setProps({ modelValue: 'slide-b' })

        expect(wrapper.get('button').attributes('data-slide')).toBe('SlideB')
      })
    })

    describe('[(prop)keep-alive]', () => {
      test('type Boolean has effect', async () => {
        await expectSlideCached({})
      })
    })

    describe('[(prop)keep-alive-include]', () => {
      test('type String has effect', async () => {
        await expectSlideCached({ keepAliveInclude: 'slide-a' })
      })

      test('type Array has effect', async () => {
        await expectSlideCached({ keepAliveInclude: ['slide-a'] })
      })

      test('type RegExp has effect', async () => {
        await expectSlideCached({ keepAliveInclude: /^slide-a$/ })
      })
    })

    describe('[(prop)keep-alive-exclude]', () => {
      test('type String has effect', async () => {
        await expectSlideCached({ keepAliveExclude: 'slide-b' })
      })

      test('type Array has effect', async () => {
        await expectSlideCached({ keepAliveExclude: ['slide-b'] })
      })

      test('type RegExp has effect', async () => {
        await expectSlideCached({ keepAliveExclude: /^slide-b$/ })
      })
    })

    describe('[(prop)keep-alive-max]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountCarousel({ keepAlive: true, keepAliveMax: 1 })

        await wrapper.get('button').trigger('click')
        await wrapper.setProps({ modelValue: 'slide-b' })
        await wrapper.setProps({ modelValue: 'slide-a' })

        expect(wrapper.get('button').text()).toBe('0')
      })
    })

    describe('[(prop)animated]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel({ animated: true })

        await wrapper.setProps({ modelValue: 'slide-b' })

        // the carousel defaults both transitions to "fade"
        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--fade'
        )
      })

      test('renders no transition without it', () => {
        const wrapper = mountCarousel()

        expect(wrapper.find('transition-stub').exists()).toBe(false)
      })
    })

    describe('[(prop)infinite]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCarousel({
          modelValue: 'slide-c',
          infinite: true
        })

        wrapper.vm.next()

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-a']
        ])
      })

      test('keeps both arrows around on the edges', () => {
        const wrapper = mountCarousel({ arrows: true, infinite: true })

        expect(wrapper.find('.q-carousel__prev-arrow').exists()).toBe(true)
        expect(wrapper.find('.q-carousel__next-arrow').exists()).toBe(true)
      })
    })

    describe('[(prop)swipeable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCarousel({ swipeable: true })
        const swipe = wrapper.get('.q-carousel__slides-container').element
          .__qtouchswipe

        expect(swipe.direction.horizontal).toBe(true)
        swipe.handler({ direction: 'left' })

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCarousel({
          modelValue: 'slide-b',
          vertical: true,
          arrows: true
        })

        expect(wrapper.classes()).toContain('q-carousel--arrows-vertical')
        expect(wrapper.find('.q-carousel__prev-arrow--vertical').exists()).toBe(
          true
        )
      })

      test('moves the navigation to the right', () => {
        const wrapper = mountCarousel({ vertical: true, navigation: true })

        expect(wrapper.classes()).toContain('q-carousel--navigation-right')
      })
    })

    describe('[(prop)transition-prev]', () => {
      test('type String has effect', async () => {
        const wrapper = mountCarousel({
          modelValue: 'slide-b',
          animated: true,
          transitionPrev: 'slide-right'
        })

        await wrapper.setProps({ modelValue: 'slide-a' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--slide-right'
        )
      })
    })

    describe('[(prop)transition-next]', () => {
      test('type String has effect', async () => {
        const wrapper = mountCarousel({
          animated: true,
          transitionNext: 'slide-left'
        })

        await wrapper.setProps({ modelValue: 'slide-b' })

        expect(wrapper.get('transition-stub').attributes('name')).toBe(
          'q-transition--slide-left'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({ transitionDuration: '450' })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mountCarousel({ transitionDuration: 450 })

        expect(wrapper.get('.q-panel').attributes('style')).toContain(
          '--q-transition-duration: 450ms'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.classes()).not.toContain('q-carousel--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toContain('q-carousel--dark')
        expect(wrapper.classes()).toContain('q-dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountCarousel({ dark: null })

        await wrapper.vm.$q.dark.set(true)
        expect(wrapper.classes()).toContain('q-carousel--dark')

        await wrapper.vm.$q.dark.set(false)
        expect(wrapper.classes()).not.toContain('q-carousel--dark')
      })
    })

    describe('[(prop)height]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({ height: '300px' })

        expect(wrapper.element.style.height).toBe('300px')
      })

      test('is dropped while in fullscreen', async () => {
        const wrapper = mountCarousel({ height: '300px' })

        await wrapper.setProps({ fullscreen: true })

        expect(wrapper.element.style.height).toBe('')
      })
    })

    describe('[(prop)padding]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.classes()).toContain('q-carousel--without-padding')

        await wrapper.setProps({ padding: true })

        expect(wrapper.classes()).toContain('q-carousel--with-padding')
      })
    })

    describe('[(prop)control-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({ arrows: true, controlColor: 'purple' })

        expect(
          wrapper.get('.q-carousel__next-arrow .q-btn').classes()
        ).toContain('text-purple')
      })

      test('colors the navigation container too', () => {
        const wrapper = mountCarousel({
          navigation: true,
          controlColor: 'purple'
        })

        expect(wrapper.get('.q-carousel__navigation').classes()).toContain(
          'text-purple'
        )
      })
    })

    describe('[(prop)control-text-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          arrows: true,
          controlColor: 'purple',
          controlTextColor: 'white'
        })

        expect(
          wrapper.get('.q-carousel__next-arrow .q-btn').classes()
        ).toContain('text-white')
      })
    })

    describe('[(prop)control-type]', () => {
      test('type String has effect', () => {
        const flat = mountCarousel({ arrows: true })
        expect(flat.get('.q-carousel__next-arrow .q-btn').classes()).toContain(
          'q-btn--flat'
        )
        flat.unmount()

        const wrapper = mountCarousel({ arrows: true, controlType: 'outline' })

        expect(
          wrapper.get('.q-carousel__next-arrow .q-btn').classes()
        ).toContain('q-btn--outline')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QCarousel.props.controlType

        expect(validator('regular')).toBe(true)
        expect(validator('flat')).toBe(true)
        expect(validator('outline')).toBe(true)
        expect(validator('push')).toBe(true)
        expect(validator('unelevated')).toBe(true)
        expect(validator('fab')).toBe(false)
        expect(validator(defaultValue)).toBe(true)
      })
    })

    describe('[(prop)autoplay]', () => {
      test('type Number has effect', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({ autoplay: 1000 })

        await vi.advanceTimersByTimeAsync(1000)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })

      test('type Boolean has effect', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({ autoplay: true })

        await vi.advanceTimersByTimeAsync(4999)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await vi.advanceTimersByTimeAsync(1)
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })

      test('a negative duration walks backwards', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({
          modelValue: 'slide-b',
          autoplay: -1000
        })

        // the sign picks the direction, its absolute value the interval
        await vi.advanceTimersByTimeAsync(999)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        await vi.advanceTimersByTimeAsync(1)
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-a']
        ])
      })

      test('a negative duration wraps around when infinite', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({
          modelValue: 'slide-a',
          autoplay: -1000,
          infinite: true
        })

        await vi.advanceTimersByTimeAsync(1000)

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-c']
        ])
      })

      test('stops when turned off', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({ autoplay: 1000 })

        await wrapper.setProps({ autoplay: false })
        await vi.advanceTimersByTimeAsync(5000)

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)arrows]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel({ modelValue: 'slide-b' })

        expect(wrapper.find('.q-carousel__arrow').exists()).toBe(false)

        await wrapper.setProps({ arrows: true })

        expect(wrapper.find('.q-carousel__prev-arrow').exists()).toBe(true)
        expect(wrapper.find('.q-carousel__next-arrow').exists()).toBe(true)
      })

      test('hides the arrow which has nowhere to go', () => {
        const wrapper = mountCarousel({ arrows: true })

        expect(wrapper.find('.q-carousel__prev-arrow').exists()).toBe(false)
        expect(wrapper.find('.q-carousel__next-arrow').exists()).toBe(true)
      })

      test('walks the slides', async () => {
        const wrapper = mountCarousel({ modelValue: 'slide-b', arrows: true })

        await wrapper.get('.q-carousel__next-arrow .q-btn').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-c']
        ])

        await wrapper.get('.q-carousel__prev-arrow .q-btn').trigger('click')
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-c'],
          ['slide-a']
        ])
      })
    })

    describe('[(prop)prev-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          modelValue: 'slide-b',
          arrows: true,
          prevIcon: 'alarm_on'
        })

        expect(wrapper.get('.q-carousel__prev-arrow .q-icon').text()).toBe(
          'alarm_on'
        )
      })
    })

    describe('[(prop)next-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          arrows: true,
          nextIcon: 'alarm_on'
        })

        expect(wrapper.get('.q-carousel__next-arrow .q-icon').text()).toBe(
          'alarm_on'
        )
      })
    })

    describe('[(prop)navigation]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.find('.q-carousel__navigation').exists()).toBe(false)

        await wrapper.setProps({ navigation: true })

        expect(wrapper.get('.q-carousel__navigation').classes()).toContain(
          'q-carousel__navigation--buttons'
        )
        expect(getNavigationIcons(wrapper)).toHaveLength(3)
      })

      test('marks the current slide', () => {
        const wrapper = mountCarousel({ navigation: true })
        const [first, second] = getNavigationIcons(wrapper)

        expect(first.classes()).toContain('q-carousel__navigation-icon--active')
        expect(second.classes()).toContain(
          'q-carousel__navigation-icon--inactive'
        )
      })

      test('selects the slide it is clicked on', async () => {
        const wrapper = mountCarousel({ navigation: true })

        await getNavigationIcons(wrapper)[2].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-c']
        ])
      })
    })

    describe('[(prop)navigation-position]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          navigation: true,
          navigationPosition: 'top'
        })

        expect(wrapper.classes()).toContain('q-carousel--navigation-top')
        expect(wrapper.get('.q-carousel__navigation').classes()).toContain(
          'q-carousel__navigation--top'
        )
      })

      test('only accepts the documented values', () => {
        const { validator } = QCarousel.props.navigationPosition

        expect(validator('top')).toBe(true)
        expect(validator('right')).toBe(true)
        expect(validator('bottom')).toBe(true)
        expect(validator('left')).toBe(true)
        expect(validator('center')).toBe(false)
      })
    })

    describe('[(prop)navigation-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          navigation: true,
          navigationIcon: 'alarm_on'
        })

        expect(getNavigationIcons(wrapper)[1].get('.q-icon').text()).toBe(
          'alarm_on'
        )
      })
    })

    describe('[(prop)navigation-active-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountCarousel({
          navigation: true,
          navigationIcon: 'star',
          navigationActiveIcon: 'alarm_on'
        })

        const icons = getNavigationIcons(wrapper)

        expect(icons[0].get('.q-icon').text()).toBe('alarm_on')
        expect(icons[1].get('.q-icon').text()).toBe('star')
      })
    })

    describe('[(prop)thumbnails]', () => {
      test('type Boolean has effect', () => {
        const slides = [
          ['slide-a', createCounter('SlideA'), { imgSrc: '/a.jpg' }],
          ['slide-b', createCounter('SlideB'), { imgSrc: '/b.jpg' }]
        ]
        const wrapper = mountCarousel({ thumbnails: true }, slides)

        const thumbs = wrapper.findAll('.q-carousel__thumbnail')

        expect(wrapper.get('.q-carousel__navigation').classes()).toContain(
          'q-carousel__navigation--thumbnails'
        )
        expect(thumbs.map(el => el.attributes('src'))).toStrictEqual([
          '/a.jpg',
          '/b.jpg'
        ])
        expect(thumbs[0].classes()).toContain('q-carousel__thumbnail--active')
      })

      test('selects the slide it is clicked on', async () => {
        const slides = [
          ['slide-a', createCounter('SlideA'), { imgSrc: '/a.jpg' }],
          ['slide-b', createCounter('SlideB'), { imgSrc: '/b.jpg' }]
        ]
        const wrapper = mountCarousel({ thumbnails: true }, slides)

        await wrapper.findAll('.q-carousel__thumbnail')[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        activeWrapper = mount(QCarousel, {
          props: { modelValue: 'slot' },
          slots: {
            default: () =>
              h(QCarouselSlide, { name: 'slot' }, () => slotContent)
          }
        })

        expect(activeWrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)control]', () => {
      test('renders the content', () => {
        const slotContent = 'some-control-content'
        const wrapper = mountCarousel({}, void 0, {
          control: () => slotContent
        })

        expect(wrapper.text()).toContain(slotContent)
      })
    })

    describe('[(slot)navigation-icon]', () => {
      test('renders the content', () => {
        const wrapper = mountCarousel({ navigation: true }, void 0, {
          'navigation-icon': ({ index, active }) =>
            h('button', { class: 'my-nav', 'data-active': active }, index)
        })

        const buttons = wrapper.findAll('.my-nav')

        expect(buttons).toHaveLength(3)
        expect(buttons.map(el => el.text())).toStrictEqual(['0', '1', '2'])
        expect(buttons[0].attributes('data-active')).toBe('true')
      })

      test('receives everything it needs to navigate', async () => {
        const slot = vi.fn(({ onClick }) =>
          h('button', { class: 'my-nav', onClick })
        )
        const wrapper = mountCarousel({ navigation: true }, void 0, {
          'navigation-icon': slot
        })

        expect(slot.mock.calls[0][0]).toStrictEqual({
          index: 0,
          maxIndex: 2,
          name: 'slide-a',
          active: true,
          btnProps: expect.objectContaining({ icon: expect.any(String) }),
          onClick: expect.any(Function)
        })

        await wrapper.findAll('.my-nav')[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountCarousel()

        wrapper.vm.setFullscreen()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('fullscreen')).toStrictEqual([[true]])

        wrapper.vm.exitFullscreen()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('fullscreen')).toStrictEqual([[true], [false]])
      })
    })

    describe('[(event)update:fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountCarousel()

        wrapper.vm.toggleFullscreen()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:fullscreen')).toStrictEqual([[true]])
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', () => {
        const wrapper = mountCarousel()

        wrapper.vm.goTo('slide-b')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })
    })

    describe('[(event)before-transition]', () => {
      test('is emitting', async () => {
        const wrapper = mountCarousel()

        await wrapper.setProps({ modelValue: 'slide-b' })

        expect(wrapper.emitted('beforeTransition')).toStrictEqual([
          ['slide-b', 'slide-a']
        ])
      })
    })

    describe('[(event)transition]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()
        const wrapper = mountCarousel({ transitionDuration: 25 })

        await wrapper.setProps({ modelValue: 'slide-b' })
        await vi.advanceTimersByTimeAsync(25)

        expect(wrapper.emitted('transition')).toStrictEqual([
          ['slide-b', 'slide-a']
        ])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)toggleFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.vm.toggleFullscreen()).toBeUndefined()
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).toContain('fullscreen')

        wrapper.vm.toggleFullscreen()
        await wrapper.vm.$nextTick()
        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(method)setFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountCarousel()

        expect(wrapper.vm.setFullscreen()).toBeUndefined()
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).toContain('fullscreen')

        // calling it twice changes nothing
        wrapper.vm.setFullscreen()
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('update:fullscreen')).toStrictEqual([[true]])
      })
    })

    describe('[(method)exitFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountCarousel({ fullscreen: true })
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).toContain('fullscreen')

        expect(wrapper.vm.exitFullscreen()).toBeUndefined()
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(method)next]', () => {
      test('should be callable', () => {
        const wrapper = mountCarousel()

        expect(wrapper.vm.next()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-b']
        ])
      })
    })

    describe('[(method)previous]', () => {
      test('should be callable', () => {
        const wrapper = mountCarousel({ modelValue: 'slide-b' })

        expect(wrapper.vm.previous()).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-a']
        ])
      })
    })

    describe('[(method)goTo]', () => {
      test('should be callable', () => {
        const wrapper = mountCarousel()

        expect(wrapper.vm.goTo('slide-c')).toBeUndefined()
        expect(wrapper.emitted('update:modelValue')).toStrictEqual([
          ['slide-c']
        ])
      })
    })
  })
})
