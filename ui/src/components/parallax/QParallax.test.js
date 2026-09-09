import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import QParallax from './QParallax.js'

// the test browser is a Chromium, so the media rides a view timeline by
// default; hiding the API before mounting forces the JS scroll tracking
// of non-supporting browsers (and of layouts a timeline cannot express)
const RealViewTimeline = window.ViewTimeline

const targets = []
const observers = []

beforeEach(() => {
  vi.stubGlobal('ViewTimeline', void 0)
  vi.useFakeTimers()
  // a synchronous, always-intersecting stand-in, so the component
  // starts right on mount and stays deterministic under fake timers
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb) {
        this.cb = cb
        observers.push(this)
      }

      observe() {
        this.cb([{ isIntersecting: true }])
      }

      unobserve() {}
      disconnect() {}
    }
  )
})

afterEach(() => {
  targets.splice(0).forEach(target => target.remove())
  observers.splice(0)
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

const gif = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

// what the JS tracking would write for the current scroll position
function expectedOffset(wrapper, container, mediaHeight, speed = 1) {
  const root = wrapper.get('.q-parallax').element
  const height = root.offsetHeight
  const box = container.getBoundingClientRect()
  const percent =
    (box.bottom - root.getBoundingClientRect().top) / (height + box.height)
  return (mediaHeight - height) * percent * speed
}

function getMedia(wrapper) {
  return wrapper.get('.q-parallax__media > *').element
}

function mediaTranslateY(wrapper) {
  return new DOMMatrix(getComputedStyle(getMedia(wrapper)).transform).m42
}

function getTimelineAnimation(wrapper) {
  const list = getMedia(wrapper).getAnimations()
  return list.length === 1 && list[0].timeline instanceof RealViewTimeline
    ? list[0]
    : null
}

function createScrollTarget(id) {
  const target = document.createElement('div')
  if (id !== void 0) target.id = id
  document.body.append(target)
  targets.push(target)
  return target
}

function updateMedia(wrapper, naturalHeight = 300) {
  const root = wrapper.get('.q-parallax').element
  const media = wrapper.get('.q-parallax__media > *').element

  root.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100
  })

  Object.defineProperty(media, 'naturalHeight', {
    configurable: true,
    value: naturalHeight
  })

  media.dispatchEvent(new Event('load'))
  vi.advanceTimersToNextFrame()

  return media
}

describe('[QParallax API]', () => {
  describe('[Props]', () => {
    describe('[(prop)src]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QParallax, {
          props: { src: 'https://example.test/background.png' }
        })

        expect(wrapper.get('.q-parallax__media img').attributes('src')).toBe(
          'https://example.test/background.png'
        )
      })
    })

    describe('[(prop)height]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QParallax, {
          props: { height: 320 }
        })

        expect(wrapper.attributes('style')).toContain('height: 320px')
      })
    })

    describe('[(prop)speed]', () => {
      test('type Number has effect', () => {
        const stationary = mount(QParallax, {
          props: {
            height: 100,
            speed: 0
          }
        })
        const moving = mount(QParallax, {
          props: {
            height: 100,
            speed: 1
          }
        })

        const stationaryMedia = updateMedia(stationary)
        const movingMedia = updateMedia(moving)

        expect(stationaryMedia.style.transform).toBe('translate(-50%, 0px)')
        expect(movingMedia.style.transform).not.toBe(
          stationaryMedia.style.transform
        )
      })
    })

    describe('[(prop)scroll-target]', () => {
      // the target defines the container box the scroll percentage is
      // computed against; the default (the whole viewport) is much
      // taller than the 200px target, so the parallax offset differs
      function transformWith(props) {
        const wrapper = mount(QParallax, { props: { height: 100, ...props } })
        const transform = updateMedia(wrapper).style.transform
        wrapper.unmount()
        return transform
      }

      function styleTarget(target) {
        Object.assign(target.style, {
          position: 'fixed',
          top: '0px',
          width: '100px',
          height: '200px'
        })
      }

      test('type Element has effect', () => {
        const target = createScrollTarget()
        styleTarget(target)

        expect(transformWith({ scrollTarget: target })).not.toBe(
          transformWith({})
        )
      })

      test('type String has effect', () => {
        const target = createScrollTarget('parallax-scroll-target')
        styleTarget(target)

        expect(
          transformWith({ scrollTarget: '#parallax-scroll-target' })
        ).not.toBe(transformWith({}))
      })

      test('type ComponentInstance has effect', () => {
        // the instance stands for its root element, the scroll container
        const holder = mount(
          {
            // closed, as a script setup component is: its ref is the expose proxy
            setup(_, { expose }) {
              expose({})
              return () => h('div', {})
            }
          },
          { attachTo: document.body }
        )
        styleTarget(holder.element)

        expect(transformWith({ scrollTarget: holder.vm })).not.toBe(
          transformWith({})
        )

        holder.unmount()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Parallax content'
        const wrapper = mount(QParallax, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-parallax__content').text()).toBe(slotContent)
      })
    })

    describe('[(slot)media]', () => {
      test('renders the content', () => {
        const wrapper = mount(QParallax, {
          slots: {
            media: () => h('video', { 'data-test': 'custom-media' })
          }
        })

        expect(wrapper.find('[data-test="custom-media"]').exists()).toBe(true)
      })
    })

    describe('[(slot)content]', () => {
      test('renders the content', () => {
        let slotScope
        const slotContent = 'Scoped parallax content'
        const wrapper = mount(QParallax, {
          slots: {
            content: scope => {
              slotScope = scope
              return slotContent
            }
          }
        })

        expect(wrapper.get('.q-parallax__content').text()).toBe(slotContent)
        expect(slotScope).toStrictEqual({
          percentScrolled: expect.any(Number)
        })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)scroll]', () => {
      test('is emitting', () => {
        const wrapper = mount(QParallax, {
          props: { onScroll: () => {} }
        })

        updateMedia(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('scroll')
        expect(eventList.scroll).toHaveLength(1)

        const [percentage] = eventList.scroll[0]
        expect(percentage).toBeTypeOf('number')
      })
    })
  })

  describe('[Generic]', () => {
    test('updates on a scroll from any container, none designated', () => {
      const wrapper = mount(QParallax, { props: { height: 100 } })
      const media = updateMedia(wrapper)
      const before = media.style.transform

      // the parallax box has moved (some ancestor scrolled) by the time
      // a scroll comes in from a container the component never saw
      wrapper.get('.q-parallax').element.getBoundingClientRect = () => ({
        top: 200,
        left: 0,
        right: 100,
        bottom: 300,
        width: 100,
        height: 100
      })

      const container = createScrollTarget()
      container.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(media.style.transform).not.toBe(before)
      wrapper.unmount()
    })

    test('rides a view timeline, with no JS tracking, when nothing scrollable is in between', async () => {
      vi.unstubAllGlobals()
      vi.useRealTimers()

      // the auto detected scrolling container, tall enough inside to
      // scroll the parallax through its box
      const container = createScrollTarget()
      container.className = 'scroll'
      container.style.height = '300px'
      const filler = () => {
        const el = document.createElement('div')
        el.style.height = '600px'
        return el
      }
      container.append(filler())

      const wrapper = mount(QParallax, {
        props: { height: 100, speed: 0.5 },
        slots: {
          media: () => h('img', { src: gif, style: 'height: 400px' })
        },
        attachTo: container
      })
      container.append(filler())

      // the movement spans the media's natural height, as the JS tracking
      const media = getMedia(wrapper)
      Object.defineProperty(media, 'naturalHeight', { value: 400 })
      media.dispatchEvent(new Event('load'))
      await nextFrame()

      expect(getTimelineAnimation(wrapper)).not.toBeNull()
      expect(media.style.transform).toBe('')
      expect(observers).toHaveLength(0)

      const samples = []
      for (const y of [450, 550]) {
        container.scrollTop = y
        await nextFrame()
        expect(mediaTranslateY(wrapper)).toBeCloseTo(
          expectedOffset(wrapper, container, 400, 0.5),
          0
        )
        samples.push(mediaTranslateY(wrapper))
      }
      expect(samples[0]).toBeGreaterThan(0)
      expect(samples[1]).toBeGreaterThan(samples[0])

      wrapper.unmount()
      expect(media.getAnimations()).toHaveLength(0)
    })

    test('keeps the timeline keyframes in step with the media, height and speed', async () => {
      vi.stubGlobal('ViewTimeline', RealViewTimeline)

      const wrapper = mount(QParallax, { props: { height: 100, speed: 1 } })
      updateMedia(wrapper, 300)

      // the y component of the end keyframe's translate
      const endShift = () =>
        Number.parseFloat(
          getTimelineAnimation(wrapper)
            .effect.getKeyframes()[1]
            .transform.split(',')[1]
        )

      expect(endShift()).toBe(200)

      await wrapper.setProps({ speed: 0.5 })
      expect(endShift()).toBe(100)

      await wrapper.setProps({ height: 50 })
      expect(endShift()).toBe(125)
    })

    test('measures the rendered media box while its natural size is unknown', () => {
      vi.stubGlobal('ViewTimeline', RealViewTimeline)

      // no src: naturalHeight is 0, the image fills the root through
      // min-height: 100%, so the media has nothing to travel yet
      const wrapper = mount(QParallax, { props: { height: 100 } })
      const media = getMedia(wrapper)

      expect(media.naturalHeight).toBe(0)
      expect(media.offsetHeight).toBe(100)
      expect(
        getTimelineAnimation(wrapper).effect.getKeyframes()[1].transform
      ).toMatch(/^translate\(-50%,\s*0px\)$/)
    })

    test('keeps the scroll percentage consumers served on the timeline path', () => {
      vi.stubGlobal('ViewTimeline', RealViewTimeline)

      const wrapper = mount(QParallax, {
        props: { height: 100, onScroll: () => {} }
      })
      const media = updateMedia(wrapper)

      expect(getTimelineAnimation(wrapper)).not.toBeNull()
      expect(observers).toHaveLength(1)
      expect(wrapper.emitted().scroll).toHaveLength(1)
      // the browser moves the media, the tracking only reports, straight
      // from the timeline's own progress
      expect(media.style.transform).toBe('')
      expect(wrapper.emitted().scroll[0][0]).toBe(
        getTimelineAnimation(wrapper).timeline.currentTime.value / 100
      )
    })

    test('starts and stops the tracking as a conditional content slot comes and goes', async () => {
      vi.stubGlobal('ViewTimeline', RealViewTimeline)

      const showContent = ref(false)
      const wrapper = mount({
        render: () =>
          h(
            QParallax,
            { height: 100 },
            showContent.value
              ? { content: scope => String(scope.percentScrolled) }
              : { default: () => 'static' }
          )
      })
      updateMedia(wrapper)

      // timeline driven, nothing consumes the percentage: no tracking
      expect(getTimelineAnimation(wrapper)).not.toBeNull()
      expect(observers).toHaveLength(0)

      showContent.value = true
      await nextTick()
      vi.advanceTimersToNextFrame()
      await nextTick()

      expect(observers).toHaveLength(1)
      expect(wrapper.get('.q-parallax__content').text()).toBe(
        String(getTimelineAnimation(wrapper).timeline.currentTime.value / 100)
      )

      const removeSpy = vi.spyOn(window, 'removeEventListener')
      showContent.value = false
      await nextTick()

      expect(wrapper.get('.q-parallax__content').text()).toBe('static')
      expect(removeSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        expect.anything()
      )
      removeSpy.mockRestore()
    })

    test('falls back to the JS tracking below an overflow hidden ancestor', () => {
      vi.stubGlobal('ViewTimeline', RealViewTimeline)

      const box = createScrollTarget()
      box.style.overflow = 'hidden'

      const wrapper = mount(QParallax, {
        props: { height: 100 },
        attachTo: box
      })
      const media = updateMedia(wrapper)

      expect(getTimelineAnimation(wrapper)).toBeNull()
      expect(media.style.transform).toContain('translate(')
      wrapper.unmount()
    })
  })
})
