import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'

import QMenu from '../menu/QMenu.js'
import QSelect from './QSelect.js'

enableAutoUnmount(afterEach)

const stringOptions = ['a', 'b', 'c']

const objectOptions = [
  { label: 'A', value: 1 },
  { label: 'B', value: 2 },
  { label: 'C', value: 3 }
]

function getOptions(count) {
  return Array.from({ length: count }, (_, i) => `option-${i}`)
}

function mountSelect(props = {}, options = {}) {
  return mount(QSelect, {
    props: {
      modelValue: null,
      options: stringOptions,
      ...props
    },
    ...options
  })
}

function nextFrame() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve)
  })
}

// the validation debounce and the focusout handler are both timer based
function flushTimers() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}

// the virtual scroll only computes the rendered slice out of a (debounced)
// scroll event; scrollTo() does it right away, but the resulting range is
// committed over the next two animation frames
async function settleVirtualScroll(wrapper, toIndex, edge) {
  wrapper.vm.scrollTo(toIndex === void 0 ? 0 : toIndex, edge)
  await nextFrame()
  await nextFrame()
  await flushPromises()
}

// returns the portal holding the popup content (menu or dialog), scoped to
// the given wrapper so that concurrently mounted selects do not interfere
async function openPopup(wrapper, toIndex = 0) {
  wrapper.vm.showPopup()
  await flushPromises()
  await settleVirtualScroll(wrapper, toIndex)

  return wrapper.findComponent({ name: 'QPortal' })
}

function getOptionTexts(portal) {
  return portal.findAll('.q-item').map(el => el.text())
}

// the slice ratios only show up when the slice is aligned to the start of
// the scrolled-to item, and the base slice size has to be big enough for
// the ratios to change it
async function getSliceDetails(props) {
  const wrapper = mountSelect({
    options: getOptions(200),
    virtualScrollSliceSize: 60,
    onVirtualScroll: () => {},
    ...props
  })

  await openPopup(wrapper)
  await settleVirtualScroll(wrapper, 100, 'start-force')

  return wrapper.emitted('virtualScroll').at(-1)[0]
}

const maxThreeChars = val =>
  val.length <= 3 || 'Please use maximum 3 characters'

const anchorOrigins = [
  'top left',
  'top middle',
  'top right',
  'top start',
  'top end',
  'center left',
  'center middle',
  'center right',
  'center start',
  'center end',
  'bottom left',
  'bottom middle',
  'bottom right',
  'bottom start',
  'bottom end'
]

describe('[QSelect API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const unnamed = mountSelect({ modelValue: 'a' })
        expect(unnamed.find('select.hidden').exists()).toBe(false)

        const wrapper = mountSelect({ modelValue: 'a', name: 'car_id' })
        const formEl = wrapper.get('select.hidden')

        expect(formEl.attributes('name')).toBe('car_id')
        expect(
          formEl.findAll('option').map(el => el.attributes('value'))
        ).toEqual(['a'])
      })
    })

    describe('[(prop)virtual-scroll-horizontal]', () => {
      test('type Boolean has effect', async () => {
        const vertical = mountSelect()
        const verticalPortal = await openPopup(vertical)

        expect(verticalPortal.get('.q-menu').classes()).not.toContain(
          'q-virtual-scroll--horizontal'
        )
        expect(
          verticalPortal.get('.q-virtual-scroll__padding').$style()
        ).toContain('--q-virtual-scroll-item-height')

        const wrapper = mountSelect({ virtualScrollHorizontal: true })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').classes()).toContain(
          'q-virtual-scroll--horizontal'
        )
        // the padding is sized on the horizontal axis instead
        expect(portal.get('.q-virtual-scroll__padding').$style()).toContain(
          '--q-virtual-scroll-item-width'
        )
      })
    })

    describe('[(prop)virtual-scroll-slice-size]', () => {
      const options = getOptions(50)

      test('type Number has effect', async () => {
        const wrapper = mountSelect({ options, virtualScrollSliceSize: 30 })
        const portal = await openPopup(wrapper)

        expect(portal.findAll('.q-item')).toHaveLength(30)
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({ options, virtualScrollSliceSize: '30' })
        const portal = await openPopup(wrapper)

        expect(portal.findAll('.q-item')).toHaveLength(30)
      })

      test('type null has effect', async () => {
        // null means "no minimum imposed", so it falls back to the default of 10
        const wrapper = mountSelect({ options, virtualScrollSliceSize: null })
        const portal = await openPopup(wrapper)

        const fallback = mountSelect({ options })
        const fallbackPortal = await openPopup(fallback)

        expect(portal.findAll('.q-item').length).toBe(
          fallbackPortal.findAll('.q-item').length
        )
        expect(portal.findAll('.q-item').length).toBeLessThan(options.length)
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-before]', () => {
      test('type Number has effect', async () => {
        const base = await getSliceDetails()
        const details = await getSliceDetails({
          virtualScrollSliceRatioBefore: 3
        })

        // more items get rendered ahead of the scrolled-to one
        expect(details.index - details.from).toBeGreaterThan(
          base.index - base.from
        )
      })

      test('type String has effect', async () => {
        const base = await getSliceDetails()
        const details = await getSliceDetails({
          virtualScrollSliceRatioBefore: '3'
        })

        expect(details.index - details.from).toBeGreaterThan(
          base.index - base.from
        )
      })
    })

    describe('[(prop)virtual-scroll-slice-ratio-after]', () => {
      test('type Number has effect', async () => {
        const base = await getSliceDetails()
        const details = await getSliceDetails({
          virtualScrollSliceRatioAfter: 3
        })

        // more items get rendered past the scrolled-to one
        expect(details.to - details.index).toBeGreaterThan(base.to - base.index)
      })

      test('type String has effect', async () => {
        const base = await getSliceDetails()
        const details = await getSliceDetails({
          virtualScrollSliceRatioAfter: '3'
        })

        expect(details.to - details.index).toBeGreaterThan(base.to - base.index)
      })
    })

    describe('[(prop)virtual-scroll-item-size]', () => {
      test('type Number has effect', async () => {
        const byDefault = mountSelect()
        const defaultPortal = await openPopup(byDefault)

        expect(
          defaultPortal.get('.q-virtual-scroll__padding').$style()
        ).toContain('--q-virtual-scroll-item-height: 48px')

        const wrapper = mountSelect({ virtualScrollItemSize: 100 })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-virtual-scroll__padding').$style()).toContain(
          '--q-virtual-scroll-item-height: 100px'
        )
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({ virtualScrollItemSize: '100' })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-virtual-scroll__padding').$style()).toContain(
          '--q-virtual-scroll-item-height: 100px'
        )
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-start]', () => {
      // scrollTo() offsets the scroll position with the sticky size;
      // jsdom reports every offset as 0, so the result is the negated size
      test('type Number has effect', async () => {
        const wrapper = mountSelect({ virtualScrollStickySizeStart: 40 })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').element.scrollTop).toBe(-40)
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({ virtualScrollStickySizeStart: '40' })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').element.scrollTop).toBe(-40)
      })
    })

    describe('[(prop)virtual-scroll-sticky-size-end]', () => {
      // the sticky part at the end shrinks the usable view, so aligning an
      // item to the end pushes the scroll position further by that size
      async function getEndAlignedScroll(props) {
        const wrapper = mountSelect(props)
        const portal = await openPopup(wrapper)

        await settleVirtualScroll(wrapper, 1, 'end-force')

        return portal.get('.q-menu').element.scrollTop
      }

      test('type Number has effect', async () => {
        const base = await getEndAlignedScroll()
        const scroll = await getEndAlignedScroll({
          virtualScrollStickySizeEnd: 20
        })

        expect(scroll).toBe(base + 20)
      })

      test('type String has effect', async () => {
        const base = await getEndAlignedScroll()
        const scroll = await getEndAlignedScroll({
          virtualScrollStickySizeEnd: '20'
        })

        expect(scroll).toBe(base + 20)
      })
    })

    describe('[(prop)table-colspan]', () => {
      // QSelect renders its option list out of plain divs, so there is no
      // table cell for the colspan to land on
      async function getPaddingEls(props) {
        const wrapper = mountSelect(props)
        const portal = await openPopup(wrapper)

        return portal.findAll('.q-virtual-scroll__padding')
      }

      test('type Number has effect', async () => {
        const paddingEls = await getPaddingEls({ tableColspan: 5 })

        expect(paddingEls).toHaveLength(2)
        paddingEls.forEach(el => {
          expect(el.element.tagName).toBe('DIV')
          expect(el.attributes('colspan')).toBeUndefined()
        })
      })

      test('type String has effect', async () => {
        const paddingEls = await getPaddingEls({ tableColspan: '5' })

        expect(paddingEls).toHaveLength(2)
        paddingEls.forEach(el => {
          expect(el.element.tagName).toBe('DIV')
          expect(el.attributes('colspan')).toBeUndefined()
        })
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const wrapper = mountSelect({ modelValue: null, label: 'Car' })

        expect(wrapper.get('.q-field__native').text()).toBe('')
        expect(wrapper.classes()).not.toContain('q-field--float')

        await wrapper.setProps({ modelValue: 'b' })

        expect(wrapper.get('.q-field__native').text()).toBe('b')
        expect(wrapper.classes()).toContain('q-field--float')

        // an object model gets rendered through its label
        await wrapper.setProps({
          modelValue: objectOptions[1],
          options: objectOptions
        })

        expect(wrapper.get('.q-field__native').text()).toBe('B')
      })
    })

    describe('[(prop)error]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ error: true })

        expect(wrapper.classes()).toContain('q-field--error')
        expect(wrapper.classes()).toContain('q-field--highlighted')
        expect(wrapper.get('.q-field__control').classes()).toContain(
          'text-negative'
        )
      })

      test('type null has effect', () => {
        // null is the "no opinion" value: it does not even reserve
        // the bottom slot, while an explicit false does
        const wrapper = mountSelect({ error: null })

        expect(wrapper.classes()).not.toContain('q-field--error')
        expect(wrapper.find('.q-field__bottom').exists()).toBe(false)

        const explicitFalse = mountSelect({ error: false })

        expect(explicitFalse.classes()).not.toContain('q-field--error')
        expect(explicitFalse.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)error-message]', () => {
      test('type String has effect', () => {
        const propVal = 'Please select a car'
        const wrapper = mountSelect({ error: true, errorMessage: propVal })

        expect(wrapper.get('.q-field__messages [role="alert"]').text()).toBe(
          propVal
        )
      })
    })

    describe('[(prop)no-error-icon]', () => {
      test('type Boolean has effect', () => {
        const withIcon = mountSelect({ error: true })
        expect(withIcon.find('.q-field__append .q-icon').exists()).toBe(true)

        const wrapper = mountSelect({ error: true, noErrorIcon: true })
        expect(
          wrapper
            .findAll('.q-field__append .q-icon')
            .every(el => el.classes().includes('q-select__dropdown-icon'))
        ).toBe(true)
      })
    })

    describe('[(prop)rules]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountSelect({
          modelValue: 'abcd',
          rules: [maxThreeChars]
        })

        expect(wrapper.classes()).not.toContain('q-field--error')

        expect(wrapper.vm.validate()).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
        expect(wrapper.get('.q-field__messages').text()).toBe(
          'Please use maximum 3 characters'
        )
      })
    })

    describe('[(prop)reactive-rules]', () => {
      test('type Boolean has effect', async () => {
        // lazy-rules keeps the model watcher from validating,
        // so only a rules change can trigger the validation below
        const props = {
          modelValue: 'ab',
          lazyRules: true,
          rules: [() => true]
        }

        const inert = mountSelect(props)
        await inert.setProps({ modelValue: 'abcd' })
        await inert.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(inert.classes()).not.toContain('q-field--error')

        const wrapper = mountSelect({ ...props, reactiveRules: true })
        await wrapper.setProps({ modelValue: 'abcd' })
        await wrapper.setProps({ rules: [maxThreeChars] })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)lazy-rules]', () => {
      test('value true has effect', async () => {
        const wrapper = mountSelect({
          modelValue: 'ab',
          lazyRules: true,
          rules: [maxThreeChars]
        })

        // a model change alone does not validate...
        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        // ...but losing the focus does
        const control = wrapper.get('.q-field__control')
        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value false has effect', async () => {
        const wrapper = mountSelect({
          modelValue: 'ab',
          lazyRules: false,
          rules: [maxThreeChars]
        })

        await wrapper.setProps({ modelValue: 'abcd' })
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })

      test('value "ondemand" has effect', async () => {
        const wrapper = mountSelect({
          modelValue: 'abcd',
          lazyRules: 'ondemand',
          rules: [maxThreeChars]
        })

        // neither a model change nor a blur validates
        await wrapper.setProps({ modelValue: 'abcde' })

        const control = wrapper.get('.q-field__control')
        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()
        await flushTimers()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')

        expect(wrapper.vm.validate()).toBe(false)
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ label: 'Car' })

        expect(wrapper.classes()).toContain('q-field--labeled')
        expect(wrapper.get('.q-field__label').text()).toBe('Car')
        expect(
          wrapper.get('.q-select__focus-target').attributes('aria-label')
        ).toBe('Car')
      })
    })

    describe('[(prop)stack-label]', () => {
      test('type Boolean has effect', () => {
        const floating = mountSelect({ modelValue: null, label: 'Car' })
        expect(floating.classes()).not.toContain('q-field--float')

        const wrapper = mountSelect({
          modelValue: null,
          label: 'Car',
          stackLabel: true
        })
        expect(wrapper.classes()).toContain('q-field--float')
      })
    })

    describe('[(prop)hint]', () => {
      test('type String has effect', () => {
        const propVal = 'Pick one of the cars'
        const wrapper = mountSelect({ hint: propVal })

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)hide-hint]', () => {
      test('type Boolean has effect', async () => {
        const propVal = 'Pick one of the cars'
        const wrapper = mountSelect({ hint: propVal, hideHint: true })

        expect(wrapper.get('.q-field__messages').text()).toBe('')

        // the hint is still shown while the control is focused
        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.get('.q-field__messages').text()).toBe(propVal)
      })
    })

    describe('[(prop)prefix]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ prefix: '$' })

        expect(wrapper.get('.q-field__prefix').text()).toBe('$')
      })
    })

    describe('[(prop)suffix]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ suffix: '@gmail.com' })

        expect(wrapper.get('.q-field__suffix').text()).toBe('@gmail.com')
      })
    })

    describe('[(prop)label-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ label: 'Car', labelColor: 'primary' })

        expect(wrapper.get('.q-field__label').classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const wrapper = mountSelect({ modelValue: 'b', color: 'primary' })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          'text-primary'
        )

        // it also becomes the default highlight of the selected option
        const portal = await openPopup(wrapper)

        expect(portal.findAll('.q-item')[1].classes()).toContain('text-primary')
      })
    })

    describe('[(prop)bg-color]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ bgColor: 'primary' })

        expect(wrapper.get('.q-field__control').classes()).toContain(
          'bg-primary'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ dark: true })

        expect(wrapper.classes()).toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountSelect({ dark: null })

        expect(wrapper.classes()).not.toContain('q-field--dark')

        try {
          wrapper.vm.$q.dark.set(true)
          await flushPromises()

          expect(wrapper.classes()).toContain('q-field--dark')
        } finally {
          wrapper.vm.$q.dark.set(false)
        }
      })
    })

    describe('[(prop)loading]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ loading: true })

        expect(wrapper.find('.q-field__append .q-spinner').exists()).toBe(true)
        // the dropdown arrow makes room for the spinner
        expect(wrapper.find('.q-select__dropdown-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)clearable]', () => {
      test('type Boolean has effect', async () => {
        const notClearable = mountSelect({ modelValue: 'a' })
        expect(notClearable.find('.q-field__focusable-action').exists()).toBe(
          false
        )

        const wrapper = mountSelect({ modelValue: 'a', clearable: true })
        await wrapper.get('.q-field__focusable-action').trigger('click')

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([null])
      })
    })

    describe('[(prop)clear-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({
          modelValue: 'a',
          clearable: true,
          clearIcon: 'close'
        })

        expect(wrapper.get('.q-field__focusable-action').text()).toBe('close')
      })
    })

    describe('[(prop)filled]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ filled: true })

        expect(wrapper.classes()).toContain('q-field--filled')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)outlined]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSelect({ outlined: true })

        expect(wrapper.classes()).toContain('q-field--outlined')
        expect(wrapper.classes()).not.toContain('q-field--standard')

        // the menu follows the rounded shape of the control
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').classes()).not.toContain('q-menu--square')
      })
    })

    describe('[(prop)borderless]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ borderless: true })

        expect(wrapper.classes()).toContain('q-field--borderless')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })
    })

    describe('[(prop)standout]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ standout: true })

        expect(wrapper.classes()).toContain('q-field--standout')
        expect(wrapper.classes()).not.toContain('q-field--standard')
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({ standout: 'bg-primary text-white' })
        const control = wrapper.get('.q-field__control')

        expect(wrapper.classes()).toContain('q-field--standout')
        expect(control.classes()).not.toContain('bg-primary')

        // the supplied classes are applied while focused
        await control.trigger('focusin')

        expect(control.classes()).toContain('bg-primary')
        expect(control.classes()).toContain('text-white')
      })
    })

    describe('[(prop)label-slot]', () => {
      test('type Boolean has effect', () => {
        const slots = { label: () => 'Custom label' }

        const noLabel = mountSelect({}, { slots })
        expect(noLabel.find('.q-field__label').exists()).toBe(false)

        const wrapper = mountSelect({ labelSlot: true }, { slots })

        expect(wrapper.classes()).toContain('q-field--labeled')
        expect(wrapper.get('.q-field__label').text()).toBe('Custom label')
      })
    })

    describe('[(prop)bottom-slots]', () => {
      test('type Boolean has effect', () => {
        const noBottom = mountSelect()
        expect(noBottom.find('.q-field__bottom').exists()).toBe(false)

        const wrapper = mountSelect({ bottomSlots: true })
        expect(wrapper.find('.q-field__bottom').exists()).toBe(true)
      })
    })

    describe('[(prop)hide-bottom-space]', () => {
      test('type Boolean has effect', () => {
        const withSpace = mountSelect({ hint: 'Some hint' })
        expect(withSpace.classes()).toContain('q-field--with-bottom')
        expect(withSpace.get('.q-field__bottom').classes()).toContain(
          'q-field__bottom--animated'
        )

        const wrapper = mountSelect({
          hint: 'Some hint',
          hideBottomSpace: true
        })

        expect(wrapper.classes()).not.toContain('q-field--with-bottom')
        expect(wrapper.get('.q-field__bottom').classes()).toContain(
          'q-field__bottom--stale'
        )
      })
    })

    describe('[(prop)counter]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({
          modelValue: ['a', 'b'],
          multiple: true,
          counter: true
        })

        // it counts the selected options
        expect(wrapper.get('.q-field__counter').text()).toBe('2')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ rounded: true })

        expect(wrapper.classes()).toContain('q-field--rounded')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ square: true })

        expect(wrapper.classes()).toContain('q-field--square')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ dense: true })

        expect(wrapper.classes()).toContain('q-field--dense')
      })
    })

    describe('[(prop)item-aligned]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect({ itemAligned: true })

        expect(wrapper.classes()).toContain('q-field--item-aligned')
        expect(wrapper.classes()).toContain('q-item-type')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSelect({ disable: true })

        expect(wrapper.classes()).toContain('q-field--disabled')
        expect(wrapper.attributes('aria-disabled')).toBe('true')
        // there is nothing left to focus or to open the popup with
        expect(wrapper.find('.q-select__focus-target').exists()).toBe(false)

        wrapper.vm.showPopup()
        await flushPromises()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSelect({ readonly: true })

        expect(wrapper.classes()).toContain('q-field--readonly')
        expect(wrapper.find('.q-select__focus-target').exists()).toBe(false)

        wrapper.vm.showPopup()
        await flushPromises()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)
      })
    })

    describe('[(prop)autofocus]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSelect(
          { autofocus: true },
          { attachTo: document.body }
        )
        const target = wrapper.get('.q-select__focus-target')

        expect(target.attributes('data-autofocus')).toBeDefined()
        expect(document.activeElement).toBe(target.element)

        wrapper.unmount()
      })
    })

    describe('[(prop)for]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ modelValue: 'a', for: 'myFieldsId' })

        expect(wrapper.get('.q-select__focus-target').attributes('id')).toBe(
          'myFieldsId'
        )
        expect(wrapper.attributes('for')).toBe('myFieldsId')
        // it also acts as fallback for the "name" prop
        expect(wrapper.get('select.hidden').attributes('name')).toBe(
          'myFieldsId'
        )
      })
    })

    describe('[(prop)multiple]', () => {
      test('type Boolean has effect', async () => {
        const single = mountSelect({ modelValue: 'a' })
        single.vm.toggleOption('b')
        await flushPromises()

        expect(single.classes()).toContain('q-select--single')
        expect(single.emitted('update:modelValue').at(-1)).toEqual(['b'])

        const wrapper = mountSelect({ modelValue: ['a'], multiple: true })
        wrapper.vm.toggleOption('b')
        await flushPromises()

        expect(wrapper.classes()).toContain('q-select--multiple')
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'b']
        ])

        const portal = await openPopup(wrapper)
        expect(portal.get('[role="listbox"]').attributes()).toHaveProperty(
          'aria-multiselectable',
          'true'
        )
      })
    })

    describe('[(prop)display-value]', () => {
      test('type Number has effect', () => {
        const wrapper = mountSelect({ modelValue: 'a', displayValue: 10 })

        expect(wrapper.get('.q-field__native').text()).toBe('10')
      })

      test('type String has effect', () => {
        const byDefault = mountSelect({ modelValue: 'a' })
        expect(byDefault.get('.q-field__native').text()).toBe('a')

        const wrapper = mountSelect({
          modelValue: 'a',
          displayValue: 'Whatever'
        })

        expect(wrapper.get('.q-field__native').text()).toBe('Whatever')
      })
    })

    describe('[(prop)display-value-html]', () => {
      test('type Boolean has effect', () => {
        const escaped = mountSelect({
          modelValue: 'a',
          displayValue: '<b>Bold</b>'
        })
        expect(escaped.find('.q-field__native b').exists()).toBe(false)
        expect(escaped.get('.q-field__native').text()).toBe('<b>Bold</b>')

        const wrapper = mountSelect({
          modelValue: 'a',
          displayValue: '<b>Bold</b>',
          displayValueHtml: true
        })

        expect(wrapper.get('.q-field__native b').text()).toBe('Bold')
      })
    })

    describe('[(prop)options]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountSelect({ options: [] })

        // with nothing to show there is no popup at all
        wrapper.vm.showPopup()
        await flushPromises()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        await wrapper.setProps({ options: ['x', 'y'] })
        const portal = await openPopup(wrapper)

        expect(getOptionTexts(portal)).toEqual(['x', 'y'])
      })
    })

    describe('[(prop)option-value]', () => {
      const options = [
        { id: 1, label: 'A' },
        { id: 2, label: 'B' }
      ]

      test('type Function has effect', async () => {
        const wrapper = mountSelect({
          modelValue: null,
          options,
          emitValue: true,
          optionValue: opt => opt.id
        })

        wrapper.vm.toggleOption(options[1])
        await flushPromises()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([2])
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({
          modelValue: null,
          options,
          emitValue: true,
          optionValue: 'id'
        })

        wrapper.vm.toggleOption(options[1])
        await flushPromises()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([2])
      })
    })

    describe('[(prop)option-label]', () => {
      const options = [
        { value: 1, text: 'One' },
        { value: 2, text: 'Two' }
      ]

      test('type Function has effect', async () => {
        const wrapper = mountSelect({
          modelValue: options[0],
          options,
          optionLabel: opt => opt.text
        })

        expect(wrapper.get('.q-field__native').text()).toBe('One')

        const portal = await openPopup(wrapper)
        expect(getOptionTexts(portal)).toEqual(['One', 'Two'])
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({
          modelValue: options[0],
          options,
          optionLabel: 'text'
        })

        expect(wrapper.get('.q-field__native').text()).toBe('One')

        const portal = await openPopup(wrapper)
        expect(getOptionTexts(portal)).toEqual(['One', 'Two'])
      })
    })

    describe('[(prop)option-disable]', () => {
      const options = [
        { label: 'A', value: 1, off: false },
        { label: 'B', value: 2, off: true }
      ]

      test('type Function has effect', async () => {
        const wrapper = mountSelect({
          modelValue: null,
          options,
          optionDisable: opt => opt.off
        })

        const portal = await openPopup(wrapper)

        expect(portal.findAll('.q-item')[1].classes()).toContain('disabled')
        expect(wrapper.vm.isOptionDisabled(options[1])).toBe(true)
      })

      test('type String has effect', async () => {
        const wrapper = mountSelect({
          modelValue: null,
          options,
          optionDisable: 'off'
        })

        const portal = await openPopup(wrapper)

        expect(portal.findAll('.q-item')[1].classes()).toContain('disabled')
        expect(wrapper.vm.isOptionDisabled(options[1])).toBe(true)
      })
    })

    describe('[(prop)hide-selected]', () => {
      test('type Boolean has effect', () => {
        const shown = mountSelect({ modelValue: 'a' })
        expect(shown.get('.q-field__native').text()).toBe('a')

        const wrapper = mountSelect({ modelValue: 'a', hideSelected: true })

        expect(wrapper.get('.q-field__native').text()).toBe('')
        // the value is still exposed to assistive technology
        expect(wrapper.get('.q-select__focus-target').element.value).toBe('a')
      })
    })

    describe('[(prop)hide-dropdown-icon]', () => {
      test('type Boolean has effect', () => {
        const shown = mountSelect()
        expect(shown.find('.q-select__dropdown-icon').exists()).toBe(true)

        const wrapper = mountSelect({ hideDropdownIcon: true })
        expect(wrapper.find('.q-select__dropdown-icon').exists()).toBe(false)
      })
    })

    describe('[(prop)dropdown-icon]', () => {
      test('type String has effect', () => {
        const byDefault = mountSelect()
        expect(byDefault.get('.q-select__dropdown-icon').text()).toBe(
          'arrow_drop_down'
        )

        const wrapper = mountSelect({ dropdownIcon: 'expand_more' })
        expect(wrapper.get('.q-select__dropdown-icon').text()).toBe(
          'expand_more'
        )
      })
    })

    describe('[(prop)max-values]', () => {
      async function toggleExtraOption(props) {
        const wrapper = mountSelect({
          modelValue: ['a'],
          multiple: true,
          ...props
        })

        wrapper.vm.toggleOption('b')
        await flushPromises()

        return wrapper
      }

      test('type Number has effect', async () => {
        const unlimited = await toggleExtraOption()
        expect(unlimited.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'b']
        ])

        const wrapper = await toggleExtraOption({ maxValues: 1 })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('add')).toBeUndefined()
      })

      test('type String has effect', async () => {
        const wrapper = await toggleExtraOption({ maxValues: '1' })

        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(wrapper.emitted('add')).toBeUndefined()
      })
    })

    describe('[(prop)options-dense]', () => {
      test('type Boolean has effect', async () => {
        const byDefault = mountSelect()
        const defaultPortal = await openPopup(byDefault)

        expect(defaultPortal.get('.q-item').classes()).not.toContain(
          'q-item--dense'
        )

        const wrapper = mountSelect({ optionsDense: true })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-item').classes()).toContain('q-item--dense')
        // the default virtual scroll item size follows the denser options
        expect(portal.get('.q-virtual-scroll__padding').$style()).toContain(
          '--q-virtual-scroll-item-height: 24px'
        )
      })
    })

    describe('[(prop)options-dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountSelect({ optionsDark: true })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').classes()).toContain('q-menu--dark')
        expect(wrapper.classes()).not.toContain('q-field--dark')
      })

      test('type null has effect', async () => {
        // null means it follows the dark state of the field itself
        const wrapper = mountSelect({ optionsDark: null })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').classes()).not.toContain('q-menu--dark')

        const darkWrapper = mountSelect({ optionsDark: null, dark: true })
        const darkPortal = await openPopup(darkWrapper)

        expect(darkPortal.get('.q-menu').classes()).toContain('q-menu--dark')
      })
    })

    describe('[(prop)options-selected-class]', () => {
      test('type String has effect', async () => {
        const byDefault = mountSelect({ modelValue: 'b', color: 'primary' })
        const defaultPortal = await openPopup(byDefault)

        expect(defaultPortal.findAll('.q-item')[1].classes()).toContain(
          'text-primary'
        )

        const wrapper = mountSelect({
          modelValue: 'b',
          color: 'primary',
          optionsSelectedClass: 'text-deep-orange'
        })
        const portal = await openPopup(wrapper)
        const selected = portal.findAll('.q-item')[1]

        expect(selected.classes()).toContain('text-deep-orange')
        expect(selected.classes()).not.toContain('text-primary')
      })
    })

    describe('[(prop)options-html]', () => {
      const options = [{ label: '<b>Bold</b>', value: 1 }]

      test('type Boolean has effect', async () => {
        const escaped = mountSelect({ modelValue: options[0], options })
        const escapedPortal = await openPopup(escaped)

        expect(escapedPortal.find('.q-item b').exists()).toBe(false)
        expect(escaped.find('.q-field__native b').exists()).toBe(false)

        const wrapper = mountSelect({
          modelValue: options[0],
          options,
          optionsHtml: true
        })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-item b').text()).toBe('Bold')
        // the selection is rendered as HTML as well
        expect(wrapper.get('.q-field__native b').text()).toBe('Bold')
      })
    })

    describe('[(prop)options-cover]', () => {
      test('type Boolean has effect', async () => {
        const byDefault = mountSelect()
        expect(byDefault.getComponent(QMenu).props('cover')).toBe(false)
        expect(byDefault.getComponent(QMenu).props('square')).toBe(true)

        const wrapper = mountSelect({ optionsCover: true })

        expect(wrapper.getComponent(QMenu).props('cover')).toBe(true)
        // a covering menu keeps the rounded shape of the control
        expect(wrapper.getComponent(QMenu).props('square')).toBe(false)

        const portal = await openPopup(wrapper)
        expect(portal.get('.q-menu').classes()).not.toContain('q-menu--square')
      })
    })

    describe('[(prop)menu-shrink]', () => {
      test('type Boolean has effect', () => {
        const byDefault = mountSelect()
        // by default the menu is fit to the width of the control
        expect(byDefault.getComponent(QMenu).props('fit')).toBe(true)

        const wrapper = mountSelect({ menuShrink: true })
        expect(wrapper.getComponent(QMenu).props('fit')).toBe(false)
      })
    })

    describe('[(prop)menu-anchor]', () => {
      // the anchor origin is consumed by the underlying QMenu, which cannot
      // be positioned in a layout-less environment
      test.each(anchorOrigins.map(value => [value]))(
        'value "%s" has effect',
        propVal => {
          const byDefault = mountSelect()
          expect(byDefault.getComponent(QMenu).props('anchor')).toBeUndefined()

          const wrapper = mountSelect({ menuAnchor: propVal })
          expect(wrapper.getComponent(QMenu).props('anchor')).toBe(propVal)
        }
      )
    })

    describe('[(prop)menu-self]', () => {
      test.each(anchorOrigins.map(value => [value]))(
        'value "%s" has effect',
        propVal => {
          const byDefault = mountSelect()
          expect(byDefault.getComponent(QMenu).props('self')).toBeUndefined()

          const wrapper = mountSelect({ menuSelf: propVal })
          expect(wrapper.getComponent(QMenu).props('self')).toBe(propVal)
        }
      )
    })

    describe('[(prop)menu-offset]', () => {
      test('type Array has effect', () => {
        const propVal = [10, 20]

        const byDefault = mountSelect()
        expect(byDefault.getComponent(QMenu).props('offset')).toBeUndefined()

        const wrapper = mountSelect({ menuOffset: propVal })
        expect(wrapper.getComponent(QMenu).props('offset')).toEqual(propVal)
      })
    })

    describe('[(prop)popup-content-class]', () => {
      test('type String has effect', async () => {
        const wrapper = mountSelect({ popupContentClass: 'my-special-class' })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)popup-content-style]', () => {
      async function getMenuColor(propVal) {
        const wrapper = mountSelect({ popupContentStyle: propVal })
        const portal = await openPopup(wrapper)

        return portal.get('.q-menu').$style('background-color')
      }

      test('type String has effect', async () => {
        expect(await getMenuColor('background-color: #ff0000')).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Array has effect', async () => {
        expect(await getMenuColor([{ backgroundColor: '#ff0000' }])).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Object has effect', async () => {
        expect(await getMenuColor({ backgroundColor: '#ff0000' })).toBe(
          'rgb(255, 0, 0)'
        )
      })
    })

    describe('[(prop)popup-no-route-dismiss]', () => {
      test('type Boolean has effect', () => {
        const byDefault = mountSelect()
        expect(byDefault.getComponent(QMenu).props('noRouteDismiss')).toBe(
          false
        )

        const wrapper = mountSelect({ popupNoRouteDismiss: true })
        expect(wrapper.getComponent(QMenu).props('noRouteDismiss')).toBe(true)
      })
    })

    describe('[(prop)use-chips]', () => {
      test('type Boolean has effect', async () => {
        const plain = mountSelect({ modelValue: ['a'], multiple: true })
        expect(plain.find('.q-chip').exists()).toBe(false)
        expect(plain.classes()).toContain('q-select--without-chips')

        const wrapper = mountSelect({
          modelValue: ['a', 'b'],
          multiple: true,
          useChips: true
        })

        expect(wrapper.classes()).toContain('q-select--with-chips')
        expect(
          wrapper.findAll('.q-chip__content').map(el => el.text())
        ).toEqual(['a', 'b'])

        // each chip removes its own value from the model
        await wrapper.get('.q-chip__icon--remove').trigger('click')

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['b']])
      })
    })

    describe('[(prop)use-input]', () => {
      test('type Boolean has effect', () => {
        const readOnlyTarget = mountSelect()
        expect(readOnlyTarget.classes()).toContain('q-select--without-input')
        expect(readOnlyTarget.find('input.q-field__input').exists()).toBe(false)

        const wrapper = mountSelect({ useInput: true })
        const input = wrapper.get('input.q-field__input')

        expect(wrapper.classes()).toContain('q-select--with-input')
        expect(input.attributes('aria-autocomplete')).toBe('list')
        expect(input.attributes('readonly')).toBeUndefined()
      })
    })

    describe('[(prop)maxlength]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({ useInput: true, maxlength: '20' })

        expect(wrapper.get('input').attributes('maxlength')).toBe('20')
      })

      test('type Number has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          maxlength: 20,
          counter: true
        })

        expect(wrapper.get('input').attributes('maxlength')).toBe('20')
        expect(wrapper.get('.q-field__counter').text()).toBe('0 / 20')
      })
    })

    describe('[(prop)fill-input]', () => {
      test('type Boolean has effect', async () => {
        const empty = mountSelect({ modelValue: 'b', useInput: true })
        await flushPromises()

        expect(empty.get('input').element.value).toBe('')

        const wrapper = mountSelect({
          modelValue: 'b',
          useInput: true,
          fillInput: true
        })
        await flushPromises()

        expect(wrapper.get('input').element.value).toBe('b')
      })
    })

    describe('[(prop)new-value-mode]', () => {
      async function typeAndConfirm(props) {
        const wrapper = mountSelect({
          modelValue: ['a'],
          multiple: true,
          useInput: true,
          ...props
        })

        const input = wrapper.get('input')
        input.element.value = 'a'
        await input.trigger('input')
        await flushPromises()

        await input.trigger('keydown', { keyCode: 13 })
        await flushPromises()

        return wrapper
      }

      test('value "add" has effect', async () => {
        const wrapper = await typeAndConfirm({ newValueMode: 'add' })

        // duplicates are accepted
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'a']
        ])
      })

      test('value "add-unique" has effect', async () => {
        const wrapper = await typeAndConfirm({ newValueMode: 'add-unique' })

        // an already selected value is left alone
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()

        const fresh = await typeAndConfirm({
          modelValue: ['b'],
          newValueMode: 'add-unique'
        })

        expect(fresh.emitted('update:modelValue').at(-1)).toEqual([['b', 'a']])
      })

      test('value "toggle" has effect', async () => {
        const wrapper = await typeAndConfirm({ newValueMode: 'toggle' })

        // an already selected value gets removed
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([[]])
      })
    })

    describe('[(prop)map-options]', () => {
      test('type Boolean has effect', () => {
        const raw = mountSelect({ modelValue: 2, options: objectOptions })
        expect(raw.get('.q-field__native').text()).toBe('2')

        const wrapper = mountSelect({
          modelValue: 2,
          options: objectOptions,
          mapOptions: true
        })

        // the model value is looked up in the options to get its label
        expect(wrapper.get('.q-field__native').text()).toBe('B')
      })
    })

    describe('[(prop)disable-tab-selection]', () => {
      async function tabOverFocusedOption(props) {
        const wrapper = mountSelect({ modelValue: null, ...props })
        const target = wrapper.get('.q-select__focus-target')

        // first press opens the menu, second one focuses the first option
        await target.trigger('keydown', { keyCode: 40 })
        await flushPromises()
        await target.trigger('keydown', { keyCode: 40 })
        await flushPromises()

        await target.trigger('keydown', { keyCode: 9 })
        await flushPromises()

        return wrapper
      }

      test('type Boolean has effect', async () => {
        const byDefault = await tabOverFocusedOption()
        expect(byDefault.emitted('update:modelValue').at(-1)).toEqual(['a'])

        const wrapper = await tabOverFocusedOption({
          disableTabSelection: true
        })
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      })
    })

    describe('[(prop)emit-value]', () => {
      test('type Boolean has effect', async () => {
        const whole = mountSelect({
          modelValue: null,
          options: objectOptions
        })
        whole.vm.toggleOption(objectOptions[1])
        await flushPromises()

        expect(whole.emitted('update:modelValue').at(-1)).toEqual([
          objectOptions[1]
        ])

        const wrapper = mountSelect({
          modelValue: null,
          options: objectOptions,
          emitValue: true
        })
        wrapper.vm.toggleOption(objectOptions[1])
        await flushPromises()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([2])
      })
    })

    describe('[(prop)input-debounce]', () => {
      async function typeWithDebounce(inputDebounce) {
        const onFilter = vi.fn((val, update) => {
          update()
        })
        const wrapper = mountSelect({ useInput: true, inputDebounce, onFilter })

        await wrapper.get('.q-field__control').trigger('focusin')

        const input = wrapper.get('input')
        input.element.value = 'b'
        await input.trigger('input')

        return { onFilter, wrapper }
      }

      test('type Number has effect', async () => {
        vi.useFakeTimers()

        try {
          const { onFilter } = await typeWithDebounce(300)

          vi.advanceTimersByTime(299)
          expect(onFilter).not.toHaveBeenCalled()

          vi.advanceTimersByTime(1)
          expect(onFilter).toHaveBeenCalledOnce()
          expect(onFilter.mock.calls[0][0]).toBe('b')
        } finally {
          vi.useRealTimers()
        }
      })

      test('type String has effect', async () => {
        vi.useFakeTimers()

        try {
          const { onFilter } = await typeWithDebounce('300')

          vi.advanceTimersByTime(299)
          expect(onFilter).not.toHaveBeenCalled()

          vi.advanceTimersByTime(1)
          expect(onFilter).toHaveBeenCalledOnce()
        } finally {
          vi.useRealTimers()
        }
      })
    })

    describe('[(prop)input-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputClass: 'my-special-class'
        })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })

      test('type Array has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputClass: ['my-special-class']
        })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })

      test('type Object has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputClass: { 'my-special-class': true }
        })

        expect(wrapper.get('input').classes()).toContain('my-special-class')
      })
    })

    describe('[(prop)input-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputStyle: 'background-color: #ff0000'
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Array has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputStyle: [{ backgroundColor: '#ff0000' }]
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountSelect({
          useInput: true,
          inputStyle: { backgroundColor: '#ff0000' }
        })

        expect(wrapper.get('input').$style('background-color')).toBe(
          'rgb(255, 0, 0)'
        )
      })
    })

    describe('[(prop)tabindex]', () => {
      test('type Number has effect', () => {
        const byDefault = mountSelect()
        expect(
          byDefault.get('.q-select__focus-target').attributes('tabindex')
        ).toBe('0')

        const wrapper = mountSelect({ tabindex: 5 })
        expect(
          wrapper.get('.q-select__focus-target').attributes('tabindex')
        ).toBe('5')
      })

      test('type String has effect', () => {
        const wrapper = mountSelect({ tabindex: '5' })

        expect(
          wrapper.get('.q-select__focus-target').attributes('tabindex')
        ).toBe('5')
      })
    })

    describe('[(prop)autocomplete]', () => {
      test('type String has effect', () => {
        const byDefault = mountSelect()
        expect(byDefault.find('.q-select__autocomplete-input').exists()).toBe(
          false
        )

        // without an editable input a dedicated one is rendered for the
        // browser autofill to work with
        const wrapper = mountSelect({ autocomplete: 'name' })
        expect(
          wrapper
            .get('.q-select__autocomplete-input')
            .attributes('autocomplete')
        ).toBe('name')

        // with use-input it lands on the input itself
        const withInput = mountSelect({ autocomplete: 'name', useInput: true })
        expect(withInput.find('.q-select__autocomplete-input').exists()).toBe(
          false
        )
        expect(withInput.get('input').attributes('autocomplete')).toBe('name')
      })
    })

    describe('[(prop)transition-show]', () => {
      test('type String has effect', async () => {
        const wrapper = mountSelect({ transitionShow: 'flip' })
        const portal = await openPopup(wrapper)

        expect(portal.get('transition-stub').attributes('enterfromclass')).toBe(
          'q-transition--flip-enter-from'
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', async () => {
        const wrapper = mountSelect({ transitionHide: 'flip' })
        const portal = await openPopup(wrapper)

        expect(portal.get('transition-stub').attributes('leavetoclass')).toBe(
          'q-transition--flip-leave-to'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', async () => {
        const wrapper = mountSelect({ transitionDuration: '123' })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').$style()).toContain(
          '--q-transition-duration: 123ms'
        )
      })

      test('type Number has effect', async () => {
        const byDefault = mountSelect()
        const defaultPortal = await openPopup(byDefault)

        expect(defaultPortal.get('.q-menu').$style()).toContain(
          '--q-transition-duration: 300ms'
        )

        const wrapper = mountSelect({ transitionDuration: 123 })
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').$style()).toContain(
          '--q-transition-duration: 123ms'
        )
      })
    })

    describe('[(prop)behavior]', () => {
      async function getPopup(behavior) {
        const wrapper = mountSelect({ behavior })

        wrapper.vm.showPopup()
        await flushPromises()

        return wrapper.findComponent({ name: 'QPortal' })
      }

      test('value "default" has effect', async () => {
        // desktop is detected in this environment, so it resolves to a menu
        const portal = await getPopup('default')

        expect(portal.find('.q-menu').exists()).toBe(true)
        expect(portal.find('.q-select__dialog').exists()).toBe(false)
      })

      test('value "menu" has effect', async () => {
        const portal = await getPopup('menu')

        expect(portal.find('.q-menu').exists()).toBe(true)
        expect(portal.find('.q-select__dialog').exists()).toBe(false)
      })

      test('value "dialog" has effect', async () => {
        const portal = await getPopup('dialog')

        expect(portal.find('.q-menu').exists()).toBe(false)
        expect(portal.find('.q-select__dialog').exists()).toBe(true)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          {},
          { slots: { default: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__control-container').text()).toContain(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)prepend]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          {},
          { slots: { prepend: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__prepend').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)append]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          {},
          { slots: { append: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__append').text()).toContain(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)before]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          {},
          { slots: { before: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__before').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)after]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          {},
          { slots: { after: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__after').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)label]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { labelSlot: true },
          { slots: { label: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__label').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)error]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { error: true },
          { slots: { error: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)hint]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { bottomSlots: true },
          { slots: { hint: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__messages').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)counter]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { bottomSlots: true },
          { slots: { counter: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__counter').text()).toBe(
          'some-slot-content'
        )
      })
    })

    describe('[(slot)loading]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { loading: true },
          { slots: { loading: () => 'some-slot-content' } }
        )

        expect(wrapper.get('.q-field__append').text()).toContain(
          'some-slot-content'
        )
        expect(wrapper.find('.q-spinner').exists()).toBe(false)
      })
    })

    describe('[(slot)selected]', () => {
      test('renders the content', () => {
        const wrapper = mountSelect(
          { modelValue: 'a' },
          { slots: { selected: () => 'some-slot-content' } }
        )

        // it replaces the whole rendering of the selection
        expect(wrapper.get('.q-field__native').text()).toBe('some-slot-content')
      })
    })

    describe('[(slot)before-options]', () => {
      test('renders the content', async () => {
        const wrapper = mountSelect(
          {},
          { slots: { 'before-options': () => 'some-slot-content' } }
        )
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').text()).toBe('some-slot-contentabc')
      })
    })

    describe('[(slot)after-options]', () => {
      test('renders the content', async () => {
        const wrapper = mountSelect(
          {},
          { slots: { 'after-options': () => 'some-slot-content' } }
        )
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').text()).toBe('abcsome-slot-content')
      })
    })

    describe('[(slot)no-option]', () => {
      test('renders the content', async () => {
        let slotScope

        const wrapper = mountSelect(
          { options: [], useInput: true },
          {
            slots: {
              'no-option': scope => {
                slotScope = scope
                return 'some-slot-content'
              }
            }
          }
        )

        // it makes the popup show up even without any option
        wrapper.vm.showPopup()
        await flushPromises()

        const portal = wrapper.findComponent({ name: 'QPortal' })
        expect(portal.get('.q-menu').text()).toBe('some-slot-content')

        expect(slotScope).toStrictEqual({ inputValue: '' })

        const input = wrapper.get('input')
        input.element.value = 'zz'
        await input.trigger('input')
        await flushPromises()

        expect(slotScope).toStrictEqual({ inputValue: 'zz' })
      })
    })

    describe('[(slot)selected-item]', () => {
      test('renders the content', () => {
        const slotScopes = []

        const wrapper = mountSelect(
          { modelValue: ['a', 'b'], multiple: true },
          {
            slots: {
              'selected-item': scope => {
                slotScopes.push(scope)
                return `[${scope.opt}]`
              }
            }
          }
        )

        // it is called once per selected option
        expect(wrapper.get('.q-field__native').text()).toBe('[a][b]')

        expect(slotScopes).toHaveLength(2)
        expect(slotScopes[1]).toStrictEqual({
          index: 1,
          opt: 'b',
          selected: true,
          html: false,
          removeAtIndex: expect.any(Function),
          toggleOption: expect.any(Function),
          tabindex: expect.$any([0, -1])
        })
      })
    })

    describe('[(slot)option]', () => {
      test('renders the content', async () => {
        const slotScopes = []

        const wrapper = mountSelect(
          { modelValue: 'b' },
          {
            slots: {
              option: scope => {
                slotScopes.push(scope)
                return `<${scope.label}>`
              }
            }
          }
        )
        const portal = await openPopup(wrapper)

        expect(portal.get('.q-menu').text()).toBe('<a><b><c>')

        expect(slotScopes.at(-1)).toStrictEqual({
          index: 2,
          opt: 'c',
          html: false,
          label: 'c',
          selected: false,
          focused: false,
          toggleOption: expect.any(Function),
          setOptionIndex: expect.any(Function),
          itemProps: expect.any(Object)
        })

        // the selected option is flagged as such
        expect(slotScopes.find(scope => scope.index === 1).selected).toBe(true)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)virtual-scroll]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({
          options: getOptions(100),
          onVirtualScroll: () => {}
        })

        await openPopup(wrapper)
        await settleVirtualScroll(wrapper, 50)

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('virtualScroll')

        const [details] = eventList.virtualScroll.at(-1)
        expect(details).toStrictEqual({
          index: 50,
          from: expect.any(Number),
          to: expect.any(Number),
          direction: 'increase',
          ref: wrapper.vm
        })
        expect(details.from).toBeLessThanOrEqual(details.index)
        expect(details.to).toBeGreaterThanOrEqual(details.index)
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({ modelValue: null })
        const portal = await openPopup(wrapper)

        await portal.findAll('.q-item')[1].trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('b')
      })
    })

    describe('[(event)focus]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect()

        await wrapper.get('.q-field__control').trigger('focusin')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('focus')
        expect(eventList.focus).toHaveLength(1)

        const [evt] = eventList.focus[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)blur]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect()
        const control = wrapper.get('.q-field__control')

        await control.trigger('focusin')
        await control.trigger('focusout')
        await flushTimers()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('blur')
        expect(eventList.blur).toHaveLength(1)

        const [evt] = eventList.blur[0]
        expect(evt).toBeInstanceOf(Event)
      })
    })

    describe('[(event)clear]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({ modelValue: 'a', clearable: true })

        await wrapper.get('.q-field__focusable-action').trigger('click')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('clear')
        expect(eventList.clear).toHaveLength(1)

        // it carries the value that has been cleared
        const [value] = eventList.clear[0]
        expect(value).toBe('a')
      })
    })

    describe('[(event)input-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({ useInput: true, inputDebounce: 0 })
        const input = wrapper.get('input')

        input.element.value = 'zz'
        await input.trigger('input')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('inputValue')

        const [value] = eventList.inputValue.at(-1)
        expect(value).toBe('zz')
      })
    })

    describe('[(event)remove]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({
          modelValue: ['a', 'b'],
          multiple: true
        })

        wrapper.vm.toggleOption('a')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('remove')
        expect(eventList.remove).toHaveLength(1)

        const [details] = eventList.remove[0]
        expect(details).toStrictEqual({ index: 0, value: 'a' })
      })
    })

    describe('[(event)add]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({ modelValue: ['a'], multiple: true })

        wrapper.vm.toggleOption('c')
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('add')
        expect(eventList.add).toHaveLength(1)

        const [details] = eventList.add[0]
        expect(details).toStrictEqual({ index: 1, value: 'c' })
      })
    })

    describe('[(event)new-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({
          modelValue: [],
          multiple: true,
          useInput: true,
          onNewValue: (val, done) => {
            done(val.toUpperCase(), 'add')
          }
        })

        const input = wrapper.get('input')
        input.element.value = 'zz'
        await input.trigger('input')
        await flushPromises()

        await input.trigger('keydown', { keyCode: 13 })
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('newValue')
        expect(eventList.newValue).toHaveLength(1)

        const [inputValue, doneFn] = eventList.newValue[0]
        expect(inputValue).toBe('zz')
        expect(doneFn).toBeTypeOf('function')

        // the done() callback decides what actually lands in the model
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['ZZ']])
      })
    })

    describe('[(event)filter]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({
          useInput: true,
          inputDebounce: 0,
          onFilter: () => {}
        })

        await wrapper.get('.q-field__control').trigger('focusin')

        const input = wrapper.get('input')
        input.element.value = 'b'
        await input.trigger('input')
        await flushTimers()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('filter')
        expect(eventList.filter).toHaveLength(1)

        const [inputValue, doneFn, abortFn] = eventList.filter[0]
        expect(inputValue).toBe('b')
        expect(doneFn).toBeTypeOf('function')
        expect(abortFn).toBeTypeOf('function')
      })
    })

    describe('[(event)filter-abort]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect({
          useInput: true,
          inputDebounce: 0,
          // never call the update function, so the filtering stays pending
          onFilter: () => {}
        })

        await wrapper.get('.q-field__control').trigger('focusin')

        const input = wrapper.get('input')
        input.element.value = 'b'
        await input.trigger('input')
        await flushTimers()
        await flushPromises()

        expect(wrapper.emitted('filterAbort')).toBeUndefined()

        // a second filtering request abandons the pending one
        input.element.value = 'bc'
        await input.trigger('input')
        await flushTimers()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('filterAbort')
        expect(eventList.filterAbort).toHaveLength(1)
        expect(eventList.filterAbort[0]).toEqual([])
      })
    })

    describe('[(event)popup-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect()

        wrapper.vm.showPopup()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('popupShow')
        expect(eventList.popupShow).toHaveLength(1)

        const [evt] = eventList.popupShow[0]
        expect(evt).$any([expect.any(Event), void 0])
      })
    })

    describe('[(event)popup-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountSelect()

        wrapper.vm.showPopup()
        await flushPromises()

        expect(wrapper.emitted('popupHide')).toBeUndefined()

        wrapper.vm.hidePopup()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('popupHide')
        expect(eventList.popupHide).toHaveLength(1)

        const [evt] = eventList.popupHide[0]
        expect(evt).$any([expect.any(Event), void 0])
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)scrollTo]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ options: getOptions(100) })
        const portal = await openPopup(wrapper)

        expect(getOptionTexts(portal)[0]).toBe('option-0')

        expect(wrapper.vm.scrollTo(50, 'start')).toBeUndefined()
        await nextFrame()
        await nextFrame()
        await flushPromises()

        // the rendered slice follows the requested index
        expect(getOptionTexts(portal)).toContain('option-50')
        expect(getOptionTexts(portal)).not.toContain('option-0')
      })
    })

    describe('[(method)reset]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ options: getOptions(100) })
        const portal = await openPopup(wrapper)

        const getPaddingHeight = () =>
          Number.parseFloat(
            portal.get('.q-virtual-scroll__padding').$style('height')
          )

        // scrolling around makes it remember the sizes of the options it
        // rendered on the way, which jsdom reports as 0px
        await settleVirtualScroll(wrapper, 50)
        await settleVirtualScroll(wrapper, 90)

        const measuredPadding = getPaddingHeight()

        // it throws those measurements away and seeds every size from the
        // default item size again, so the padding grows back
        expect(wrapper.vm.reset()).toBeUndefined()
        await nextFrame()
        await nextFrame()
        await flushPromises()

        expect(getPaddingHeight()).toBeGreaterThan(measuredPadding)
        expect(getOptionTexts(portal)).toContain('option-90')
      })
    })

    describe('[(method)refresh]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ options: getOptions(100) })
        const portal = await openPopup(wrapper)

        await settleVirtualScroll(wrapper, 50)
        expect(getOptionTexts(portal)).not.toContain('option-0')

        expect(wrapper.vm.refresh(0)).toBeUndefined()
        await nextFrame()
        await nextFrame()
        await flushPromises()

        expect(getOptionTexts(portal)[0]).toBe('option-0')
      })
    })

    describe('[(method)resetValidation]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({
          modelValue: 'abcd',
          rules: [maxThreeChars]
        })

        wrapper.vm.validate()
        await flushPromises()

        expect(wrapper.classes()).toContain('q-field--error')

        expect(wrapper.vm.resetValidation()).toBeUndefined()
        await flushPromises()

        expect(wrapper.classes()).not.toContain('q-field--error')
      })
    })

    describe('[(method)validate]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({
          modelValue: 'ab',
          rules: [maxThreeChars]
        })

        expect(wrapper.vm.validate()).toBe(true)
        expect(wrapper.vm.validate('abcd')).toBe(false)

        // async rules make it return a Promise instead
        const asyncWrapper = mountSelect({
          modelValue: 'ab',
          rules: [() => Promise.resolve('Nope')]
        })

        const result = asyncWrapper.vm.validate()
        expect(result).toBeInstanceOf(Promise)

        await expect(result).resolves.toBe(false)
        await flushPromises()

        expect(asyncWrapper.get('.q-field__messages').text()).toBe('Nope')
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({}, { attachTo: document.body })

        expect(wrapper.vm.focus()).toBeUndefined()
        expect(document.activeElement).toBe(
          wrapper.get('.q-select__focus-target').element
        )

        wrapper.unmount()
      })
    })

    describe('[(method)blur]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({}, { attachTo: document.body })
        const target = wrapper.get('.q-select__focus-target').element

        wrapper.vm.focus()
        expect(document.activeElement).toBe(target)

        expect(wrapper.vm.blur()).toBeUndefined()
        expect(document.activeElement).not.toBe(target)

        wrapper.unmount()
      })
    })

    describe('[(method)showPopup]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect()

        expect(wrapper.findComponent({ name: 'QPortal' }).exists()).toBe(false)

        expect(wrapper.vm.showPopup()).toBeUndefined()
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' }).find('.q-menu').exists()
        ).toBe(true)
        expect(
          wrapper.get('.q-select__focus-target').attributes('aria-expanded')
        ).toBe('true')
      })
    })

    describe('[(method)hidePopup]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect()

        wrapper.vm.showPopup()
        await flushPromises()

        expect(wrapper.vm.hidePopup()).toBeUndefined()
        await flushPromises()

        expect(
          wrapper.findComponent({ name: 'QPortal' }).find('.q-menu').exists()
        ).toBe(false)
        expect(
          wrapper.get('.q-select__focus-target').attributes('aria-expanded')
        ).toBe('false')
      })
    })

    describe('[(method)removeAtIndex]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({
          modelValue: ['a', 'b', 'c'],
          multiple: true
        })

        expect(wrapper.vm.removeAtIndex(1)).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('remove').at(-1)).toEqual([
          { index: 1, value: 'b' }
        ])
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'c']
        ])

        // an out of range index is a no-op
        expect(wrapper.vm.removeAtIndex(10)).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      })
    })

    describe('[(method)add]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ modelValue: ['a'], multiple: true })

        expect(wrapper.vm.add('c')).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('add').at(-1)).toEqual([
          { index: 1, value: 'c' }
        ])
        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'c']
        ])

        // the second parameter skips an already selected option
        expect(wrapper.vm.add('a', true)).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      })
    })

    describe('[(method)toggleOption]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ modelValue: ['a'], multiple: true })

        expect(wrapper.vm.toggleOption('b')).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([
          ['a', 'b']
        ])

        expect(wrapper.vm.toggleOption('a')).toBeUndefined()
        await flushPromises()

        expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([[]])
      })
    })

    describe('[(method)getOptionIndex]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect({ modelValue: 'b' })

        // nothing is focused while the menu is closed
        expect(wrapper.vm.getOptionIndex()).toBe(-1)

        await openPopup(wrapper)

        // opening it focuses the currently selected option
        expect(wrapper.vm.getOptionIndex()).toBe(1)
      })
    })

    describe('[(method)setOptionIndex]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect()
        const portal = await openPopup(wrapper)

        expect(wrapper.vm.setOptionIndex(2)).toBeUndefined()
        await flushPromises()

        expect(wrapper.vm.getOptionIndex()).toBe(2)
        expect(portal.findAll('.q-item')[2].classes()).toContain(
          'q-manual-focusable--focused'
        )

        // an index outside of the list resets the focused option
        expect(wrapper.vm.setOptionIndex(10)).toBeUndefined()
        expect(wrapper.vm.getOptionIndex()).toBe(-1)
      })
    })

    describe('[(method)moveOptionSelection]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect()

        await openPopup(wrapper)
        expect(wrapper.vm.getOptionIndex()).toBe(-1)

        expect(wrapper.vm.moveOptionSelection(1)).toBeUndefined()
        expect(wrapper.vm.getOptionIndex()).toBe(0)

        expect(wrapper.vm.moveOptionSelection(2)).toBeUndefined()
        expect(wrapper.vm.getOptionIndex()).toBe(2)

        // it wraps around the ends of the list
        expect(wrapper.vm.moveOptionSelection(-1)).toBeUndefined()
        expect(wrapper.vm.getOptionIndex()).toBe(1)
      })
    })

    describe('[(method)filter]', () => {
      test('should be callable', async () => {
        const onFilter = vi.fn((val, update) => {
          update()
        })
        const wrapper = mountSelect({ useInput: true, onFilter })

        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.vm.filter('zz')).toBeUndefined()
        await flushPromises()

        expect(onFilter).toHaveBeenCalledOnce()
        expect(onFilter.mock.calls[0][0]).toBe('zz')

        // it opens the popup once the filtering is done
        expect(
          wrapper.findComponent({ name: 'QPortal' }).find('.q-menu').exists()
        ).toBe(true)
      })
    })

    describe('[(method)updateMenuPosition]', () => {
      test('should be callable', async () => {
        const wrapper = mountSelect()
        const menu = wrapper.getComponent(QMenu)
        const spy = vi.spyOn(menu.vm, 'updatePosition')

        await openPopup(wrapper)
        spy.mockClear()

        expect(wrapper.vm.updateMenuPosition()).toBeUndefined()

        expect(spy).toHaveBeenCalledOnce()

        spy.mockRestore()
      })
    })

    describe('[(method)updateInputValue]', () => {
      test('should be callable', async () => {
        const onFilter = vi.fn((val, update) => {
          update()
        })
        const wrapper = mountSelect({
          useInput: true,
          inputDebounce: 0,
          onFilter
        })

        await wrapper.get('.q-field__control').trigger('focusin')

        expect(wrapper.vm.updateInputValue('zz')).toBeUndefined()
        await flushPromises()

        expect(wrapper.get('input').element.value).toBe('zz')
        expect(wrapper.emitted('inputValue').at(-1)).toEqual(['zz'])
        expect(onFilter.mock.calls.at(-1)[0]).toBe('zz')

        // the second parameter skips the filtering
        expect(wrapper.vm.updateInputValue('yy', true)).toBeUndefined()
        await flushPromises()

        expect(wrapper.get('input').element.value).toBe('yy')
        expect(onFilter).toHaveBeenCalledOnce()
      })
    })

    describe('[(method)isOptionSelected]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({
          modelValue: [objectOptions[1]],
          options: objectOptions,
          multiple: true
        })

        expect(wrapper.vm.isOptionSelected(objectOptions[1])).toBe(true)
        expect(wrapper.vm.isOptionSelected(objectOptions[0])).toBe(false)

        // the comparison is done on the option value, not on the reference
        expect(wrapper.vm.isOptionSelected({ label: 'Other', value: 2 })).toBe(
          true
        )
      })
    })

    describe('[(method)getEmittingOptionValue]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({ options: objectOptions })

        // without emit-value the whole option is what gets emitted
        expect(wrapper.vm.getEmittingOptionValue(objectOptions[1])).toBe(
          objectOptions[1]
        )

        const emitValue = mountSelect({
          options: objectOptions,
          emitValue: true
        })

        expect(emitValue.vm.getEmittingOptionValue(objectOptions[1])).toBe(2)
      })
    })

    describe('[(method)getOptionValue]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({ options: objectOptions })

        expect(wrapper.vm.getOptionValue(objectOptions[1])).toBe(2)
        // a primitive option is its own value
        expect(wrapper.vm.getOptionValue('a')).toBe('a')

        const custom = mountSelect({ optionValue: 'id' })
        expect(custom.vm.getOptionValue({ id: 7, value: 1 })).toBe(7)
      })
    })

    describe('[(method)getOptionLabel]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect({ options: objectOptions })

        expect(wrapper.vm.getOptionLabel(objectOptions[1])).toBe('B')
        // a primitive option is its own label
        expect(wrapper.vm.getOptionLabel('a')).toBe('a')

        const custom = mountSelect({ optionLabel: opt => opt.text })
        expect(custom.vm.getOptionLabel({ text: 'Seven' })).toBe('Seven')
      })
    })

    describe('[(method)isOptionDisabled]', () => {
      test('should be callable', () => {
        const wrapper = mountSelect()

        expect(wrapper.vm.isOptionDisabled({ disable: true })).toBe(true)
        expect(wrapper.vm.isOptionDisabled({ disable: false })).toBe(false)
        // it must be strictly true, anything else counts as enabled
        expect(wrapper.vm.isOptionDisabled({ disable: 'yes' })).toBe(false)
        expect(wrapper.vm.isOptionDisabled('a')).toBe(false)

        const custom = mountSelect({ optionDisable: 'off' })
        expect(custom.vm.isOptionDisabled({ off: true })).toBe(true)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)hasError]', () => {
      test('should be exposed', async () => {
        const wrapper = mountSelect()
        expect(wrapper.vm.hasError).toBe(false)

        const withError = mountSelect({ error: true })
        expect(withError.vm.hasError).toBe(true)

        // a failed rule flags it as well
        const withRules = mountSelect({
          modelValue: 'abcd',
          rules: [maxThreeChars]
        })

        withRules.vm.validate()
        await flushPromises()

        expect(withRules.vm.hasError).toBe(true)
      })
    })
  })
})
