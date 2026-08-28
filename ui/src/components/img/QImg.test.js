import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QImg from './QImg.js'

const src = '/images/photo.jpg'

function mountImg(props, slots) {
  props ||= {}

  return mount(QImg, {
    props: { src, ...props },
    slots
  })
}

/**
 * The current <img> is the one carrying the load/error handlers.
 */
function getCurrentImg(wrapper) {
  return wrapper.get('.q-img__image--current')
}

/**
 * A data: URL image that the browser loads for real,
 * with a deterministic natural size.
 *
 * Tests awaiting a real load/error event mount with
 * loading: 'eager' -- headless Chromium can defer
 * loading="lazy" fetches indefinitely mid-suite.
 */
function realImgSrc(naturalWidth = 16, naturalHeight = 9) {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${naturalWidth}" height="${naturalHeight}"></svg>`
    )
  )
}

// undecodable image data, so the browser fires a real error event
const brokenImgSrc = 'data:image/png;base64,invalid'

async function waitForLoad(wrapper) {
  await vi.waitFor(() => {
    expect(wrapper.emitted('load')).toBeDefined()
  })
  await flushPromises()
}

async function waitForError(wrapper) {
  await vi.waitFor(() => {
    expect(wrapper.emitted('error')).toBeDefined()
  })
  await flushPromises()
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('[QImg API]', () => {
  describe('[Props]', () => {
    describe('[(prop)ratio]', () => {
      test('type String has effect', () => {
        const wrapper = mountImg({ ratio: '4' })

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '25%'
        )
      })

      test('type Number has effect', () => {
        const wrapper = mountImg({ ratio: 2 })

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '50%'
        )
      })
    })

    describe('[(prop)src]', () => {
      test('type String has effect', async () => {
        const wrapper = mountImg()

        expect(getCurrentImg(wrapper).attributes('src')).toBe(src)

        await wrapper.setProps({ src: '/images/other.jpg' })

        expect(getCurrentImg(wrapper).attributes('src')).toBe(
          '/images/other.jpg'
        )
      })

      test('renders no image without it', () => {
        const wrapper = mount(QImg)

        expect(wrapper.find('img').exists()).toBe(false)
      })
    })

    describe('[(prop)srcset]', () => {
      test('type String has effect', () => {
        const propVal = '/images/small.jpg 400w, /images/big.jpg 1200w'
        const wrapper = mountImg({ srcset: propVal })

        expect(getCurrentImg(wrapper).attributes('srcset')).toBe(propVal)
      })
    })

    describe('[(prop)sizes]', () => {
      test('type String has effect', () => {
        const propVal = '(max-width: 600px) 400px, 1200px'
        const wrapper = mountImg({ sizes: propVal })

        expect(getCurrentImg(wrapper).attributes('sizes')).toBe(propVal)
      })
    })

    describe('[(prop)placeholder-src]', () => {
      test('type String has effect', () => {
        const propVal = '/images/placeholder.png'
        const wrapper = mountImg({ src: void 0, placeholderSrc: propVal })

        expect(wrapper.get('img').attributes('src')).toBe(propVal)
      })

      test('shows behind the image being loaded', () => {
        const wrapper = mountImg({ placeholderSrc: '/images/placeholder.png' })

        const sources = wrapper.findAll('img').map(el => el.attributes('src'))
        expect(sources).toContain(src)
        expect(sources).toContain('/images/placeholder.png')
      })
    })

    describe('[(prop)error-src]', () => {
      test('type String has effect', async () => {
        const propVal = '/images/error.png'
        const wrapper = mountImg({
          src: brokenImgSrc,
          loading: 'eager',
          errorSrc: propVal
        })

        await waitForError(wrapper)

        expect(wrapper.get('img').attributes('src')).toBe(propVal)
      })

      test('is not used while the image loads fine', () => {
        const wrapper = mountImg({ errorSrc: '/images/error.png' })

        expect(
          wrapper.findAll('img').map(el => el.attributes('src'))
        ).not.toContain('/images/error.png')
      })
    })

    describe('[(prop)initial-ratio]', () => {
      test('type Number has effect', () => {
        const wrapper = mountImg({ initialRatio: 2 })

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '50%'
        )
      })

      test('type String has effect', () => {
        const wrapper = mountImg({ initialRatio: '2' })

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '50%'
        )
      })

      test('is replaced by the natural ratio once loaded', async () => {
        const wrapper = mountImg({
          initialRatio: 2,
          src: realImgSrc(4, 1),
          loading: 'eager'
        })

        await waitForLoad(wrapper)

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '25%'
        )
      })

      test('is superseded by the ratio prop', () => {
        const wrapper = mountImg({ initialRatio: 2, ratio: 4 })

        expect(wrapper.element.firstElementChild.style.paddingBottom).toBe(
          '25%'
        )
      })
    })

    describe('[(prop)width]', () => {
      test('type String has effect', () => {
        const propVal = '200px'
        const wrapper = mountImg({ width: propVal })

        expect(wrapper.element.style.width).toBe(propVal)
        expect(getCurrentImg(wrapper).attributes('width')).toBe(propVal)
      })
    })

    describe('[(prop)height]', () => {
      test('type String has effect', () => {
        const propVal = '200px'
        const wrapper = mountImg({ height: propVal })

        expect(wrapper.element.style.height).toBe(propVal)
        expect(getCurrentImg(wrapper).attributes('height')).toBe(propVal)
      })
    })

    describe('[(prop)loading]', () => {
      test('type String has effect', () => {
        expect(getCurrentImg(mountImg()).attributes('loading')).toBe('lazy')

        const wrapper = mountImg({ loading: 'eager' })

        expect(getCurrentImg(wrapper).attributes('loading')).toBe('eager')
      })
    })

    describe('[(prop)loading-show-delay]', () => {
      test('type Number has effect', async () => {
        vi.useFakeTimers()
        const wrapper = mountImg({ loadingShowDelay: 500 })

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)

        await vi.advanceTimersByTimeAsync(500)

        expect(wrapper.find('.q-img__loading').exists()).toBe(true)
      })

      test('type String has effect', async () => {
        vi.useFakeTimers()
        const wrapper = mountImg({ loadingShowDelay: '500' })

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)

        await vi.advanceTimersByTimeAsync(500)

        expect(wrapper.find('.q-img__loading').exists()).toBe(true)
      })

      test('shows the loading state right away by default', () => {
        const wrapper = mountImg()

        expect(wrapper.find('.q-img__loading').exists()).toBe(true)
      })
    })

    describe('[(prop)crossorigin]', () => {
      test('type String has effect', () => {
        const propVal = 'anonymous'
        const wrapper = mountImg({ crossorigin: propVal })

        expect(getCurrentImg(wrapper).attributes('crossorigin')).toBe(propVal)
      })
    })

    describe('[(prop)decoding]', () => {
      test('type String has effect', () => {
        const propVal = 'async'
        const wrapper = mountImg({ decoding: propVal })

        expect(getCurrentImg(wrapper).attributes('decoding')).toBe(propVal)
      })
    })

    describe('[(prop)referrerpolicy]', () => {
      test('type String has effect', () => {
        const propVal = 'no-referrer'
        const wrapper = mountImg({ referrerpolicy: propVal })

        expect(getCurrentImg(wrapper).attributes('referrerpolicy')).toBe(
          propVal
        )
      })
    })

    describe('[(prop)fetchpriority]', () => {
      test('type String has effect', () => {
        expect(getCurrentImg(mountImg()).attributes('fetchpriority')).toBe(
          'auto'
        )

        const wrapper = mountImg({ fetchpriority: 'high' })

        expect(getCurrentImg(wrapper).attributes('fetchpriority')).toBe('high')
      })
    })

    describe('[(prop)fit]', () => {
      test('type String has effect', () => {
        expect(getCurrentImg(mountImg()).element.style.objectFit).toBe('cover')

        const wrapper = mountImg({ fit: 'contain' })

        expect(getCurrentImg(wrapper).element.style.objectFit).toBe('contain')
      })
    })

    describe('[(prop)position]', () => {
      test('type String has effect', () => {
        expect(getCurrentImg(mountImg()).element.style.objectPosition).toBe(
          '50% 50%'
        )

        const wrapper = mountImg({ position: '0 0' })

        expect(getCurrentImg(wrapper).element.style.objectPosition).toBe(
          '0px 0px'
        )
      })
    })

    describe('[(prop)alt]', () => {
      test('type String has effect', () => {
        const propVal = 'A nice photo'
        const wrapper = mountImg({ alt: propVal })

        expect(wrapper.attributes('role')).toBe('img')
        expect(wrapper.attributes('aria-label')).toBe(propVal)
        expect(getCurrentImg(wrapper).attributes('alt')).toBe(propVal)
      })

      test('the img role is only claimed when "alt" provides a name', () => {
        // the img role requires an accessible name; without "alt" the
        // wrapper stays neutral, like a native <img alt="">
        const wrapper = mountImg()

        expect(wrapper.attributes('role')).toBeUndefined()
        expect(wrapper.attributes('aria-label')).toBeUndefined()
      })

      test('an empty "alt" marks the image decorative', () => {
        // alt="" is the native way to say "decorative"; claiming the img
        // role for it would produce a role with no accessible name
        const wrapper = mountImg({ alt: '' })

        expect(wrapper.attributes('role')).toBeUndefined()
        expect(wrapper.attributes('aria-label')).toBeUndefined()
        expect(getCurrentImg(wrapper).attributes('alt')).toBe('')
      })

      test('the inner image is decorative when "alt" is omitted', () => {
        // an absent alt attribute leaves the image unnamed, which is a
        // different failure from being explicitly decorative
        const wrapper = mountImg()

        expect(getCurrentImg(wrapper).attributes('alt')).toBe('')
      })
    })

    describe('[(prop)draggable]', () => {
      test('type Boolean has effect', () => {
        expect(getCurrentImg(mountImg()).attributes('draggable')).toBe('false')

        const wrapper = mountImg({ draggable: true })

        expect(getCurrentImg(wrapper).attributes('draggable')).toBe('true')
      })
    })

    describe('[(prop)img-class]', () => {
      test('type String has effect', () => {
        const propVal = 'my-img-class'

        expect(getCurrentImg(mountImg()).classes()).not.toContain(propVal)

        const wrapper = mountImg({ imgClass: propVal })

        expect(getCurrentImg(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)img-style]', () => {
      test('type Object has effect', () => {
        const wrapper = mountImg({ imgStyle: { borderRadius: '4px' } })

        expect(getCurrentImg(wrapper).element.style.borderRadius).toBe('4px')
      })

      test('does not override the fit and position', () => {
        const wrapper = mountImg({
          fit: 'contain',
          imgStyle: { objectFit: 'fill' }
        })

        expect(getCurrentImg(wrapper).element.style.objectFit).toBe('contain')
      })
    })

    describe('[(prop)spinner-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountImg({ spinnerColor: 'red' })

        expect(wrapper.get('.q-img__loading .q-spinner').classes()).toContain(
          'text-red'
        )
      })
    })

    describe('[(prop)spinner-size]', () => {
      test('type String has effect', () => {
        const wrapper = mountImg({ spinnerSize: '50px' })

        const spinner = wrapper.get('.q-img__loading .q-spinner').element
        expect(spinner.getAttribute('width')).toBe('50px')
        expect(spinner.getAttribute('height')).toBe('50px')
      })
    })

    describe('[(prop)no-spinner]', () => {
      test('type Boolean has effect', () => {
        expect(mountImg().find('.q-img__loading .q-spinner').exists()).toBe(
          true
        )

        const wrapper = mountImg({ noSpinner: true })

        expect(wrapper.get('.q-img__loading').text()).toBe('')
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(prop)no-native-menu]', () => {
      test('type Boolean has effect', () => {
        expect(mountImg().classes()).toContain('q-img--menu')

        const wrapper = mountImg({ noNativeMenu: true })

        expect(wrapper.classes()).toContain('q-img--no-menu')
        expect(wrapper.classes()).not.toContain('q-img--menu')
      })
    })

    describe('[(prop)no-transition]', () => {
      test('type Boolean has effect', () => {
        expect(getCurrentImg(mountImg()).classes()).toContain(
          'q-img__image--with-transition'
        )

        const wrapper = mountImg({ noTransition: true })

        expect(getCurrentImg(wrapper).classes()).toContain(
          'q-img__image--without-transition'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountImg(
          { src: realImgSrc(), loading: 'eager' },
          { default: () => slotContent }
        )

        await waitForLoad(wrapper)

        expect(wrapper.get('.q-img__content').text()).toBe(slotContent)
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const slotContent = 'some-loading-content'
        const wrapper = mountImg({}, { loading: () => slotContent })

        expect(wrapper.get('.q-img__loading').text()).toBe(slotContent)
        // it replaces the spinner
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(slot)error]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-error-content'
        const wrapper = mountImg(
          { src: brokenImgSrc, loading: 'eager' },
          { default: () => 'ok content', error: () => slotContent }
        )

        await waitForError(wrapper)

        expect(wrapper.get('.q-img__content').text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)load]', () => {
      test('is emitting', async () => {
        const propVal = realImgSrc()
        const wrapper = mountImg({ src: propVal, loading: 'eager' })

        await waitForLoad(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('load')
        expect(eventList.load).toHaveLength(1)
        expect(eventList.load[0]).toStrictEqual([propVal])
      })

      test('clears the loading state', async () => {
        const wrapper = mountImg({ src: realImgSrc(), loading: 'eager' })

        expect(wrapper.find('.q-img__loading').exists()).toBe(true)

        await waitForLoad(wrapper)

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)
      })
    })

    describe('[(event)error]', () => {
      test('is emitting', async () => {
        const wrapper = mountImg({ src: brokenImgSrc, loading: 'eager' })

        await waitForError(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('error')
        expect(eventList.error).toHaveLength(1)
        expect(eventList.error[0][0]).toBeInstanceOf(Event)
      })

      test('clears the loading state', async () => {
        const wrapper = mountImg({ src: brokenImgSrc, loading: 'eager' })

        await waitForError(wrapper)

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)
      })
    })
  })

  describe('[Generic]', () => {
    test('re-reads the natural size a frame after load', async () => {
      // WebKit reports an SVG's natural size from the img's current CSS
      // box when the load event races layout (#15652); QImg re-reads the
      // getters after a double-rAF, mocked here to replay that correction
      const rafQueue = []
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb =>
        rafQueue.push(cb)
      )

      const wrapper = mountImg({ src: realImgSrc(4, 1), loading: 'eager' })

      await waitForLoad(wrapper)

      expect(wrapper.element.firstElementChild.style.paddingBottom).toBe('25%')

      const img = wrapper.get('img').element
      Object.defineProperty(img, 'naturalWidth', { get: () => 500 })
      Object.defineProperty(img, 'naturalHeight', { get: () => 100 })

      while (rafQueue.length !== 0) {
        rafQueue.shift()()
      }
      await flushPromises()

      expect(wrapper.element.firstElementChild.style.paddingBottom).toBe('20%')
    })
  })
})
