import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { h } from 'vue'

import { getRouter } from 'testing/runtime/router.js'
import QExpansionItem from './QExpansionItem.js'

let activeWrapper

afterEach(() => {
  activeWrapper?.unmount()
  activeWrapper = void 0
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function mountExpansionItem(props = {}, options = {}) {
  activeWrapper = mount(QExpansionItem, {
    props: { label: 'Header', ...props },
    ...options
  })

  return activeWrapper
}

function getHeader(wrapper) {
  return wrapper.get('.q-item')
}

function getToggleIcon(wrapper) {
  return wrapper.get('.q-expansion-item__toggle-icon')
}

function getContent(wrapper) {
  return wrapper.get('.q-expansion-item__content')
}

function isExpanded(wrapper) {
  return wrapper.classes().includes('q-expansion-item--expanded')
}

describe('[QExpansionItem API]', () => {
  describe('[Props]', () => {
    describe('[(prop)to]', () => {
      test('type String has effect', async () => {
        const router = await getRouter('/target')
        const wrapper = mountExpansionItem(
          { to: '/target' },
          { global: { plugins: [router] } }
        )

        const header = getHeader(wrapper)
        expect(header.element.tagName).toBe('A')
        expect(header.attributes('href')).toBe('/target')
      })

      test('type Object has effect', async () => {
        const router = await getRouter('/target')
        const wrapper = mountExpansionItem(
          { to: { path: '/target' } },
          { global: { plugins: [router] } }
        )

        expect(getHeader(wrapper).attributes('href')).toBe('/target')
      })

      test('navigates instead of toggling on header click', async () => {
        const router = await getRouter('/target')
        const wrapper = mountExpansionItem(
          { to: '/target' },
          { global: { plugins: [router] } }
        )

        await getHeader(wrapper).trigger('click')
        await flushPromises()

        expect(router.currentRoute.value.path).toBe('/target')
        expect(isExpanded(wrapper)).toBe(false)
      })
    })

    describe('[(prop)exact]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter({ '/parent': 'child' })
        await router.push('/parent/child')
        const options = { global: { plugins: [router] } }

        const loose = mountExpansionItem({ to: '/parent' }, options)
        expect(getHeader(loose).classes()).toContain('q-router-link--active')
        loose.unmount()

        const wrapper = mountExpansionItem(
          { to: '/parent', exact: true },
          options
        )

        expect(getHeader(wrapper).classes()).not.toContain(
          'q-router-link--active'
        )
      })
    })

    describe('[(prop)replace]', () => {
      test('type Boolean has effect', async () => {
        const router = await getRouter('/target')
        await router.push('/')
        const replaceSpy = vi.spyOn(router, 'replace')

        const wrapper = mountExpansionItem(
          { to: '/target', replace: true },
          { global: { plugins: [router] } }
        )

        await getHeader(wrapper).trigger('click')
        await flushPromises()

        expect(replaceSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('[(prop)active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-active-class'
        const router = await getRouter({ '/parent': 'child' })
        await router.push('/parent/child')

        const wrapper = mountExpansionItem(
          { to: '/parent', activeClass: propVal },
          { global: { plugins: [router] } }
        )

        expect(getHeader(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)exact-active-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-exact-active-class'
        const router = await getRouter('/target')
        await router.push('/target')

        const wrapper = mountExpansionItem(
          { to: '/target', exactActiveClass: propVal },
          { global: { plugins: [router] } }
        )

        expect(getHeader(wrapper).classes()).toContain(propVal)
      })
    })

    describe('[(prop)href]', () => {
      test('type String has effect', () => {
        const propVal = 'https://quasar.dev'
        const wrapper = mountExpansionItem({ href: propVal })

        const header = getHeader(wrapper)
        expect(header.element.tagName).toBe('A')
        expect(header.attributes('href')).toBe(propVal)
      })
    })

    describe('[(prop)target]', () => {
      test('type String has effect', () => {
        const wrapper = mountExpansionItem({
          href: 'https://quasar.dev',
          target: '_blank'
        })

        expect(getHeader(wrapper).attributes('target')).toBe('_blank')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountExpansionItem({ disable: true })

        expect(getHeader(wrapper).classes()).toContain('disabled')
        // the toggle icon goes away altogether
        expect(wrapper.find('.q-expansion-item__toggle-icon').exists()).toBe(
          false
        )

        await getHeader(wrapper).trigger('click')

        expect(isExpanded(wrapper)).toBe(false)
      })
    })

    describe('[(prop)model-value]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountExpansionItem({ modelValue: false })

        expect(isExpanded(wrapper)).toBe(false)

        await wrapper.setProps({ modelValue: true })

        expect(isExpanded(wrapper)).toBe(true)
      })

      test('type null has effect', () => {
        // null hands the control back to the component itself
        const wrapper = mountExpansionItem({
          modelValue: null,
          defaultOpened: true
        })

        expect(isExpanded(wrapper)).toBe(true)
      })
    })

    describe('[(prop)icon]', () => {
      test('type String has effect', () => {
        expect(
          mountExpansionItem().find('.q-item__section--avatar').exists()
        ).toBe(false)

        const wrapper = mountExpansionItem({ icon: 'map' })

        expect(wrapper.get('.q-item__section--avatar .q-icon').text()).toBe(
          'map'
        )
      })
    })

    describe('[(prop)expand-icon]', () => {
      test('type String has effect', () => {
        const wrapper = mountExpansionItem({ expandIcon: 'alarm_on' })

        expect(getToggleIcon(wrapper).text()).toBe('alarm_on')
      })
    })

    describe('[(prop)expanded-icon]', () => {
      test('type String has effect', async () => {
        const wrapper = mountExpansionItem({
          expandIcon: 'star',
          expandedIcon: 'alarm_on'
        })

        expect(getToggleIcon(wrapper).text()).toBe('star')

        await wrapper.setProps({ modelValue: true })

        expect(getToggleIcon(wrapper).text()).toBe('alarm_on')
        // the icon is swapped instead of being rotated
        expect(getToggleIcon(wrapper).classes()).not.toContain(
          'q-expansion-item__toggle-icon--rotated'
        )
      })

      test('rotates the expand icon without it', () => {
        const wrapper = mountExpansionItem({ modelValue: true })

        expect(getToggleIcon(wrapper).classes()).toContain(
          'q-expansion-item__toggle-icon--rotated'
        )
      })
    })

    describe('[(prop)expand-icon-class]', () => {
      test('type String has effect', () => {
        const propVal = 'my-icon-class'
        const wrapper = mountExpansionItem({ expandIconClass: propVal })

        expect(
          getToggleIcon(wrapper).element.parentElement.classList
        ).toContain(propVal)
      })

      test('type Array has effect', () => {
        const wrapper = mountExpansionItem({
          expandIconClass: ['my-icon-class']
        })

        expect(
          getToggleIcon(wrapper).element.parentElement.classList
        ).toContain('my-icon-class')
      })

      test('type Object has effect', () => {
        const wrapper = mountExpansionItem({
          expandIconClass: { 'my-icon-class': true, unused: false }
        })

        const classList = getToggleIcon(wrapper).element.parentElement.classList
        expect(classList).toContain('my-icon-class')
        expect(classList).not.toContain('unused')
      })
    })

    describe('[(prop)toggle-aria-label]', () => {
      test('type String has effect', () => {
        const propVal = 'Toggle the details'
        const wrapper = mountExpansionItem({ toggleAriaLabel: propVal })

        expect(getHeader(wrapper).attributes('aria-label')).toBe(propVal)
      })

      test('falls back to the language pack', () => {
        const wrapper = mountExpansionItem()

        expect(getHeader(wrapper).attributes('aria-label')).toBeTypeOf('string')
        expect(getHeader(wrapper).attributes('aria-expanded')).toBe('false')
      })
    })

    describe('[(prop)label]', () => {
      test('type String has effect', () => {
        const wrapper = mountExpansionItem({ label: 'My label' })

        expect(wrapper.get('.q-item__label').text()).toBe('My label')
      })
    })

    describe('[(prop)label-lines]', () => {
      test('type Number has effect', () => {
        const wrapper = mountExpansionItem({ labelLines: 2 })

        const label = wrapper.get('.q-item__label')
        expect(label.element.style.getPropertyValue('-webkit-line-clamp')).toBe(
          '2'
        )
        expect(label.element.style.display).toBe('-webkit-box')
      })

      test('type String has effect', () => {
        const wrapper = mountExpansionItem({ labelLines: '1' })

        expect(wrapper.get('.q-item__label').classes()).toContain('ellipsis')
      })
    })

    describe('[(prop)caption]', () => {
      test('type String has effect', () => {
        expect(
          mountExpansionItem().find('.q-item__label--caption').exists()
        ).toBe(false)

        const wrapper = mountExpansionItem({ caption: 'My caption' })

        expect(wrapper.get('.q-item__label--caption').text()).toBe('My caption')
      })
    })

    describe('[(prop)caption-lines]', () => {
      test('type Number has effect', () => {
        const wrapper = mountExpansionItem({
          caption: 'My caption',
          captionLines: 2
        })

        expect(
          wrapper
            .get('.q-item__label--caption')
            .element.style.getPropertyValue('-webkit-line-clamp')
        ).toBe('2')
      })

      test('type String has effect', () => {
        const wrapper = mountExpansionItem({
          caption: 'My caption',
          captionLines: '1'
        })

        expect(wrapper.get('.q-item__label--caption').classes()).toContain(
          'ellipsis'
        )
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        expect(getHeader(mountExpansionItem()).classes()).not.toContain(
          'q-item--dark'
        )

        const wrapper = mountExpansionItem({ dark: true })

        expect(getHeader(wrapper).classes()).toContain('q-item--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mountExpansionItem({ dark: null })

        await wrapper.vm.$q.dark.set(true)
        expect(getHeader(wrapper).classes()).toContain('q-item--dark')

        await wrapper.vm.$q.dark.set(false)
        expect(getHeader(wrapper).classes()).not.toContain('q-item--dark')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', () => {
        expect(getHeader(mountExpansionItem()).classes()).not.toContain(
          'q-item--dense'
        )

        const wrapper = mountExpansionItem({ dense: true })

        expect(getHeader(wrapper).classes()).toContain('q-item--dense')
      })
    })

    describe('[(prop)duration]', () => {
      test('type Number has effect', async () => {
        const wrapper = mountExpansionItem({ duration: 25 })

        wrapper.vm.show()
        await flushPromises()

        expect(isExpanded(wrapper)).toBe(true)
      })
    })

    describe('[(prop)header-inset-level]', () => {
      test('type Number has effect', () => {
        const wrapper = mountExpansionItem({ headerInsetLevel: 2 })

        // 16px of base padding plus 56px per level
        expect(getHeader(wrapper).element.style.paddingLeft).toBe('128px')
      })
    })

    describe('[(prop)content-inset-level]', () => {
      test('type Number has effect', () => {
        expect(getContent(mountExpansionItem()).attributes('style')).toBe(
          'display: none;'
        )

        const wrapper = mountExpansionItem({ contentInsetLevel: 2 })

        expect(getContent(wrapper).element.style.paddingLeft).toBe('112px')
      })
    })

    describe('[(prop)expand-separator]', () => {
      test('type Boolean has effect', () => {
        expect(
          mountExpansionItem().find('.q-expansion-item__border').exists()
        ).toBe(false)

        const wrapper = mountExpansionItem({ expandSeparator: true })

        expect(wrapper.findAll('.q-expansion-item__border')).toHaveLength(2)
      })
    })

    describe('[(prop)default-opened]', () => {
      test('type Boolean has effect', () => {
        expect(isExpanded(mountExpansionItem())).toBe(false)

        const wrapper = mountExpansionItem({ defaultOpened: true })

        expect(isExpanded(wrapper)).toBe(true)
      })
    })

    describe('[(prop)hide-expand-icon]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountExpansionItem({ hideExpandIcon: true })

        expect(wrapper.find('.q-expansion-item__toggle-icon').exists()).toBe(
          false
        )
      })
    })

    describe('[(prop)expand-icon-toggle]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountExpansionItem({ expandIconToggle: true })

        expect(getHeader(wrapper).classes()).not.toContain('q-item--clickable')

        await getHeader(wrapper).trigger('click')
        expect(isExpanded(wrapper)).toBe(false)

        await getToggleIcon(wrapper).trigger('click')
        expect(isExpanded(wrapper)).toBe(true)
      })
    })

    describe('[(prop)switch-toggle-side]', () => {
      test('type Boolean has effect', () => {
        const plain = mountExpansionItem()
        const sections = plain.findAll('.q-item__section')
        expect(sections.at(-1).classes()).toContain('q-item__section--side')
        plain.unmount()

        const wrapper = mountExpansionItem({ switchToggleSide: true })
        const switched = wrapper.findAll('.q-item__section')

        // the toggle moves to the front and becomes the avatar section
        expect(switched[0].classes()).toContain('q-item__section--avatar')
        expect(
          switched[0].find('.q-expansion-item__toggle-icon').exists()
        ).toBe(true)
      })
    })

    describe('[(prop)dense-toggle]', () => {
      test('type Boolean has effect', () => {
        const plain = mountExpansionItem()
        const plainIcon = getToggleIcon(plain).text()
        plain.unmount()

        const wrapper = mountExpansionItem({ denseToggle: true })

        expect(getToggleIcon(wrapper).text()).not.toBe(plainIcon)
      })

      test('aligns the toggle when the side is switched', () => {
        const wrapper = mountExpansionItem({
          denseToggle: true,
          switchToggleSide: true
        })

        expect(
          getToggleIcon(wrapper).element.parentElement.classList
        ).toContain('items-end')
      })
    })

    describe('[(prop)group]', () => {
      test('type String has effect', async () => {
        const first = mount(QExpansionItem, {
          props: { label: 'First', group: 'my-group', defaultOpened: true }
        })
        const second = mount(QExpansionItem, {
          props: { label: 'Second', group: 'my-group' }
        })

        try {
          expect(isExpanded(first)).toBe(true)

          second.vm.show()
          await flushPromises()

          // only one item of a group stays open
          expect(isExpanded(second)).toBe(true)
          expect(isExpanded(first)).toBe(false)
        } finally {
          first.unmount()
          second.unmount()
        }
      })

      test('leaves the items of other groups alone', async () => {
        const first = mount(QExpansionItem, {
          props: { label: 'First', group: 'group-a', defaultOpened: true }
        })
        const second = mount(QExpansionItem, {
          props: { label: 'Second', group: 'group-b' }
        })

        try {
          second.vm.show()
          await flushPromises()

          expect(isExpanded(first)).toBe(true)
        } finally {
          first.unmount()
          second.unmount()
        }
      })
    })

    describe('[(prop)popup]', () => {
      test('type Boolean has effect', () => {
        expect(mountExpansionItem().classes()).toContain(
          'q-expansion-item--standard'
        )

        const wrapper = mountExpansionItem({ popup: true })

        expect(wrapper.classes()).toContain('q-expansion-item--popup')
      })
    })

    describe('[(prop)header-style]', () => {
      test('type String has effect', () => {
        const wrapper = mountExpansionItem({ headerStyle: 'color: red' })

        expect(getHeader(wrapper).element.style.color).toBe('red')
      })

      test('type Array has effect', () => {
        const wrapper = mountExpansionItem({
          headerStyle: [{ color: 'red' }, { fontWeight: 'bold' }]
        })

        const style = getHeader(wrapper).element.style
        expect(style.color).toBe('red')
        expect(style.fontWeight).toBe('bold')
      })

      test('type Object has effect', () => {
        const wrapper = mountExpansionItem({ headerStyle: { color: 'red' } })

        expect(getHeader(wrapper).element.style.color).toBe('red')
      })
    })

    describe('[(prop)header-class]', () => {
      test('type String has effect', () => {
        const wrapper = mountExpansionItem({ headerClass: 'my-header' })

        expect(getHeader(wrapper).classes()).toContain('my-header')
      })

      test('type Array has effect', () => {
        const wrapper = mountExpansionItem({
          headerClass: ['my-header', 'other']
        })

        expect(getHeader(wrapper).classes()).toEqual(
          expect.arrayContaining(['my-header', 'other'])
        )
      })

      test('type Object has effect', () => {
        const wrapper = mountExpansionItem({
          headerClass: { 'my-header': true, unused: false }
        })

        const classes = getHeader(wrapper).classes()
        expect(classes).toContain('my-header')
        expect(classes).not.toContain('unused')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountExpansionItem(
          {},
          { slots: { default: () => slotContent } }
        )

        expect(getContent(wrapper).text()).toBe(slotContent)
      })

      test('is hidden while collapsed', () => {
        const wrapper = mountExpansionItem(
          {},
          { slots: { default: () => 'content' } }
        )

        expect(getContent(wrapper).element.style.display).toBe('none')
      })
    })

    describe('[(slot)header]', () => {
      test('renders the content', () => {
        const slotContent = 'some-header-content'
        const wrapper = mountExpansionItem(
          {},
          { slots: { header: () => slotContent } }
        )

        expect(getHeader(wrapper).text()).toContain(slotContent)
        // it replaces the generated label
        expect(wrapper.find('.q-item__label').exists()).toBe(false)
      })

      test('receives the expansion controls', async () => {
        const slot = vi.fn(() => 'header')
        const wrapper = mountExpansionItem({}, { slots: { header: slot } })

        expect(slot.mock.calls[0][0]).toStrictEqual({
          expanded: false,
          detailsId: expect.any(String),
          toggle: expect.any(Function),
          show: expect.any(Function),
          hide: expect.any(Function)
        })

        slot.mock.calls[0][0].show()
        await flushPromises()

        expect(isExpanded(wrapper)).toBe(true)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        // the model is only emitted when a listener is actually attached
        const wrapper = mountExpansionItem({
          modelValue: false,
          'onUpdate:modelValue': () => {}
        })

        await getHeader(wrapper).trigger('click')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[true]])
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountExpansionItem()

        wrapper.vm.show()
        await flushPromises()

        expect(wrapper.emitted('show')).toHaveLength(1)
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountExpansionItem()

        wrapper.vm.show()
        await flushPromises()

        expect(wrapper.emitted('beforeShow')).toHaveLength(1)
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountExpansionItem({ defaultOpened: true })

        wrapper.vm.hide()
        await flushPromises()

        expect(wrapper.emitted('hide')).toHaveLength(1)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountExpansionItem({ defaultOpened: true })

        wrapper.vm.hide()
        await flushPromises()

        expect(wrapper.emitted('beforeHide')).toHaveLength(1)
      })
    })

    describe('[(event)after-show]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()
        // the slide transition has to run for real for this one
        const wrapper = mountExpansionItem(
          { duration: 10 },
          { global: { stubs: { transition: false } } }
        )

        wrapper.vm.show()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(wrapper.emitted('afterShow')).toHaveLength(1)
      })
    })

    describe('[(event)after-hide]', () => {
      test('is emitting', async () => {
        vi.useFakeTimers()
        const wrapper = mountExpansionItem(
          { defaultOpened: true, duration: 10 },
          { global: { stubs: { transition: false } } }
        )

        wrapper.vm.hide()
        await flushPromises()
        await vi.runAllTimersAsync()

        expect(wrapper.emitted('afterHide')).toHaveLength(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountExpansionItem()

        expect(wrapper.vm.show()).toBeUndefined()
        await flushPromises()

        expect(isExpanded(wrapper)).toBe(true)
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountExpansionItem({ defaultOpened: true })

        expect(wrapper.vm.hide()).toBeUndefined()
        await flushPromises()

        expect(isExpanded(wrapper)).toBe(false)
      })
    })

    describe('[(method)toggle]', () => {
      test('should be callable', async () => {
        const wrapper = mountExpansionItem()

        expect(wrapper.vm.toggle()).toBeUndefined()
        await flushPromises()
        expect(isExpanded(wrapper)).toBe(true)

        wrapper.vm.toggle()
        await flushPromises()
        expect(isExpanded(wrapper)).toBe(false)
      })
    })
  })
})
