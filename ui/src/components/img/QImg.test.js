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
 * jsdom never really loads an image, so completion is simulated.
 */
async function simulateLoad(
  wrapper,
  { naturalWidth = 16, naturalHeight = 9 } = {}
) {
  const img = getCurrentImg(wrapper)

  Object.defineProperties(img.element, {
    naturalWidth: { configurable: true, value: naturalWidth },
    naturalHeight: { configurable: true, value: naturalHeight },
    complete: { configurable: true, value: true },
    currentSrc: { configurable: true, value: img.element.getAttribute('src') }
  })

  await img.trigger('load')
  await flushPromises()
}

async function simulateError(wrapper) {
  await getCurrentImg(wrapper).trigger('error')
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
        const wrapper = mountImg({ errorSrc: propVal })

        await simulateError(wrapper)

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
        const wrapper = mountImg({ initialRatio: 2 })

        await simulateLoad(wrapper, { naturalWidth: 4, naturalHeight: 1 })

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

        expect(getCurrentImg(wrapper).element.style.objectPosition).toBe('0 0')
      })
    })

    describe('[(prop)alt]', () => {
      test('type String has effect', () => {
        const propVal = 'A nice photo'
        const wrapper = mountImg({ alt: propVal })

        expect(wrapper.attributes('aria-label')).toBe(propVal)
        expect(getCurrentImg(wrapper).attributes('alt')).toBe(propVal)
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
        const wrapper = mountImg({}, { default: () => slotContent })

        await simulateLoad(wrapper)

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
          {},
          { default: () => 'ok content', error: () => slotContent }
        )

        await simulateError(wrapper)

        expect(wrapper.get('.q-img__content').text()).toBe(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)load]', () => {
      test('is emitting', async () => {
        const wrapper = mountImg()

        await simulateLoad(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('load')
        expect(eventList.load).toHaveLength(1)
        expect(eventList.load[0]).toStrictEqual([src])
      })

      test('clears the loading state', async () => {
        const wrapper = mountImg()

        expect(wrapper.find('.q-img__loading').exists()).toBe(true)

        await simulateLoad(wrapper)

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)
      })
    })

    describe('[(event)error]', () => {
      test('is emitting', async () => {
        const wrapper = mountImg()

        await simulateError(wrapper)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('error')
        expect(eventList.error).toHaveLength(1)
        expect(eventList.error[0][0]).toBeInstanceOf(Event)
      })

      test('clears the loading state', async () => {
        const wrapper = mountImg()

        await simulateError(wrapper)

        expect(wrapper.find('.q-img__loading').exists()).toBe(false)
      })
    })
  })
})
