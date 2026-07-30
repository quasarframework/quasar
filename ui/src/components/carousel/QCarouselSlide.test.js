import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCarousel from './QCarousel.js'
import QCarouselSlide from './QCarouselSlide.js'

function mountCarousel(modelValue, secondSlideProps = {}) {
  return mount(QCarousel, {
    props: { modelValue },
    slots: {
      default: () => [
        h(QCarouselSlide, { name: 'first' }, () => 'First slide'),
        h(
          QCarouselSlide,
          { name: 'second', ...secondSlideProps },
          () => 'Second slide'
        )
      ]
    }
  })
}

describe('[QCarouselSlide API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type Any has effect', () => {
        const wrapper = mountCarousel('second')

        expect(wrapper.get('.q-carousel__slide').text()).toBe('Second slide')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountCarousel('second', { disable: true })

        expect(wrapper.find('.q-carousel__slide').exists()).toBe(false)
      })
    })

    describe('[(prop)img-src]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCarouselSlide, {
          props: {
            name: 'slide',
            imgSrc: '/images/slide.jpg'
          }
        })

        expect(wrapper.attributes('style')).toContain(
          'background-image: url("/images/slide.jpg")'
        )
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Carousel slide content'
        const wrapper = mount(QCarouselSlide, {
          props: { name: 'slide' },
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
