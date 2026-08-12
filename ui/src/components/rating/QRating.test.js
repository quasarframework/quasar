import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QIcon from '../icon/QIcon.js'
import QRating from './QRating.js'

function mountRating(props, slots) {
  props ||= {}

  return mount(QRating, {
    props: {
      modelValue: 2,
      ...props
    },
    slots
  })
}

function iconNames(wrapper) {
  return wrapper.findAllComponents(QIcon).map(icon => icon.props('name'))
}

function ratingIcons(wrapper) {
  return wrapper.findAll('.q-rating__icon')
}

describe('[QRating API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ name: 'car_id' })
        const input = wrapper.get('input[type="hidden"]')

        expect(input.attributes()).toMatchObject({
          name: 'car_id',
          value: '2'
        })
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ size: '16px' })

        expect(wrapper.get('.q-rating').$style('font-size')).toBe('16px')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Number has effect', () => {
        const wrapper = mountRating({ modelValue: 3 })
        const containers = wrapper.findAll('.q-rating__icon-container')

        expect(containers[2].attributes('aria-checked')).toBe('true')
        expect(
          ratingIcons(wrapper)
            .slice(0, 3)
            .every(icon => icon.classes().includes('q-rating__icon--active'))
        ).toBe(true)
      })
    })

    describe('[(prop)max]', () => {
      test('type Number has effect', () => {
        const wrapper = mountRating({ max: 3 })

        expect(ratingIcons(wrapper)).toHaveLength(3)
      })

      test('type String has effect', () => {
        const wrapper = mountRating({ max: '3' })

        expect(ratingIcons(wrapper)).toHaveLength(3)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({
          modelValue: 0,
          icon: 'map'
        })

        expect(iconNames(wrapper)).toStrictEqual([
          'map',
          'map',
          'map',
          'map',
          'map'
        ])
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          modelValue: 0,
          max: 3,
          icon: ['looks_one', 'looks_two', 'looks_3']
        })

        expect(iconNames(wrapper)).toStrictEqual([
          'looks_one',
          'looks_two',
          'looks_3'
        ])
      })
    })

    describe('[(prop)icon-selected]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ iconSelected: 'star' })

        expect(iconNames(wrapper).slice(0, 2)).toStrictEqual(['star', 'star'])
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          iconSelected: ['looks_one', 'looks_two']
        })

        expect(iconNames(wrapper).slice(0, 2)).toStrictEqual([
          'looks_one',
          'looks_two'
        ])
      })
    })

    describe('[(prop)icon-half]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({
          modelValue: 1.5,
          iconHalf: 'star_half'
        })

        expect(iconNames(wrapper)[1]).toBe('star_half')
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          modelValue: 1.5,
          iconHalf: ['half_one', 'half_two']
        })

        expect(iconNames(wrapper)[1]).toBe('half_two')
      })
    })

    describe('[(prop)icon-aria-label]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ iconAriaLabel: 'Rating' })

        expect(
          wrapper
            .findAll('.q-rating__icon-container')
            .map(icon => icon.attributes('aria-label'))
        ).toStrictEqual([
          'Rating 1',
          'Rating 2',
          'Rating 3',
          'Rating 4',
          'Rating 5'
        ])
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          max: 3,
          iconAriaLabel: ['Bad', 'Normal', 'Good']
        })

        expect(
          wrapper
            .findAll('.q-rating__icon-container')
            .map(icon => icon.attributes('aria-label'))
        ).toStrictEqual(['Bad', 'Normal', 'Good'])
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ color: 'primary' })

        expect(wrapper.classes()).toContain('text-primary')
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          modelValue: 0,
          max: 3,
          color: ['accent', 'grey-7', 'blue']
        })

        expect(ratingIcons(wrapper).map(icon => icon.classes())).toStrictEqual([
          expect.arrayContaining(['text-accent']),
          expect.arrayContaining(['text-grey-7']),
          expect.arrayContaining(['text-blue'])
        ])
      })
    })

    describe('[(prop)color-selected]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({ colorSelected: 'primary' })

        expect(ratingIcons(wrapper)[0].classes()).toContain('text-primary')
        expect(ratingIcons(wrapper)[1].classes()).toContain('text-primary')
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          colorSelected: ['accent', 'primary']
        })

        expect(ratingIcons(wrapper)[0].classes()).toContain('text-accent')
        expect(ratingIcons(wrapper)[1].classes()).toContain('text-primary')
      })
    })

    describe('[(prop)color-half]', () => {
      test('type String has effect', () => {
        const wrapper = mountRating({
          modelValue: 1.5,
          iconHalf: 'star_half',
          colorHalf: 'primary'
        })

        expect(ratingIcons(wrapper)[1].classes()).toContain('text-primary')
      })

      test('type Array has effect', () => {
        const wrapper = mountRating({
          modelValue: 1.5,
          iconHalf: 'star_half',
          colorHalf: ['accent', 'primary']
        })

        expect(ratingIcons(wrapper)[1].classes()).toContain('text-primary')
      })
    })

    describe('[(prop)no-dimming]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountRating({ noDimming: true })

        expect(wrapper.classes()).toContain('q-rating--no-dimming')
      })
    })

    describe('[(prop)no-reset]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRating({ noReset: true })

        await wrapper.findAll('.q-rating__icon-container')[1].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRating({ readonly: true })

        expect(wrapper.attributes('aria-readonly')).toBe('true')
        expect(wrapper.classes()).toContain('q-rating--non-editable')

        await wrapper.findAll('.q-rating__icon-container')[2].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountRating({
          name: 'car_id',
          disable: true
        })

        expect(wrapper.attributes('aria-disabled')).toBe('true')
        expect(wrapper.classes()).toContain('disabled')
        expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)

        await wrapper.findAll('.q-rating__icon-container')[2].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)tip-[name]]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountRating(
          {},
          {
            'tip-2': () => slotContent
          }
        )

        expect(
          wrapper.findAll('.q-rating__icon-container')[1].text()
        ).toContain(slotContent)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountRating()

        await wrapper.findAll('.q-rating__icon-container')[3].trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[4]])
      })
    })
  })

  describe('[Accessibility]', () => {
    function mountNavRating(props) {
      return mount(QRating, {
        attachTo: document.body,
        props: {
          modelValue: 2,
          ...props
        }
      })
    }

    function getStars(wrapper) {
      return wrapper.findAll('.q-rating__icon-container')
    }

    test('implements the WAI-ARIA radio group semantics with a roving tabindex', async () => {
      const wrapper = mountNavRating()
      const getTabindexes = () =>
        getStars(wrapper).map(star => star.attributes('tabindex'))

      expect(wrapper.attributes('role')).toBe('radiogroup')
      expect(
        getStars(wrapper).map(star => star.attributes('aria-checked'))
      ).toStrictEqual(['false', 'true', 'false', 'false', 'false'])

      // the checked star is the group's single tab stop
      expect(getTabindexes()).toStrictEqual(['-1', '0', '-1', '-1', '-1'])

      // without a (whole-star) value, the first star is the tab stop
      await wrapper.setProps({ modelValue: 0 })
      expect(getTabindexes()).toStrictEqual(['0', '-1', '-1', '-1', '-1'])
    })

    test('arrow keys move focus without updating the model', async () => {
      const wrapper = mountNavRating()
      const stars = getStars(wrapper)

      stars[1].element.focus()

      // ArrowRight and ArrowDown move to the next star
      await stars[1].trigger('keydown', { keyCode: 39 })
      expect(document.activeElement).toBe(stars[2].element)

      await stars[2].trigger('keydown', { keyCode: 40 })
      expect(document.activeElement).toBe(stars[3].element)

      // ArrowLeft and ArrowUp move to the previous star
      await stars[3].trigger('keydown', { keyCode: 37 })
      expect(document.activeElement).toBe(stars[2].element)

      await stars[2].trigger('keydown', { keyCode: 38 })
      expect(document.activeElement).toBe(stars[1].element)

      // moving focus never selects
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test('horizontal arrow keys are reversed in RTL', async () => {
      const wrapper = mountNavRating()
      const stars = getStars(wrapper)

      wrapper.vm.$q.lang.rtl = true

      try {
        stars[1].element.focus()

        // ArrowLeft moves to the next star in RTL
        await stars[1].trigger('keydown', { keyCode: 37 })
        expect(document.activeElement).toBe(stars[2].element)

        // ArrowDown is direction-neutral: still the next star
        await stars[2].trigger('keydown', { keyCode: 40 })
        expect(document.activeElement).toBe(stars[3].element)
      } finally {
        wrapper.vm.$q.lang.rtl = false
      }
    })

    test('Enter and Space select the focused star', async () => {
      const wrapper = mountNavRating()
      const stars = getStars(wrapper)

      await stars[3].trigger('keydown', { keyCode: 13 })
      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[4]])

      await wrapper.setProps({ modelValue: 4 })
      await stars[2].trigger('keydown', { keyCode: 32 })
      expect(wrapper.emitted('update:modelValue')[1]).toStrictEqual([3])
    })
  })
})
