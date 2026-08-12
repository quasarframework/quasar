import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QIcon from './QIcon.js'

describe('[QIcon API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { size: '16px' }
        })

        expect(wrapper.attributes('style')).toContain('font-size: 16px')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { tag: 'span' }
        })

        expect(wrapper.element.tagName).toBe('SPAN')
      })
    })

    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { name: 'map' }
        })

        expect(wrapper.classes()).toContain('material-icons')
        expect(wrapper.text()).toBe('map')
        expect(wrapper.attributes('aria-hidden')).toBe('true')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { color: 'primary' }
        })

        expect(wrapper.classes()).toContain('text-primary')
      })
    })

    describe('[(prop)left]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIcon, {
          props: { left: true }
        })

        expect(wrapper.classes()).toContain('on-left')
      })
    })

    describe('[(prop)right]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIcon, {
          props: { right: true }
        })

        expect(wrapper.classes()).toContain('on-right')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Custom icon content'
        const wrapper = mount(QIcon, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toContain(slotContent)
      })

      test('renders the content alongside the icon', () => {
        const slotContent = 'Custom icon content'
        const wrapper = mount(QIcon, {
          props: { name: 'map' },
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.classes()).toContain('material-icons')
        expect(wrapper.text()).toContain('map')
        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })

  describe('[Generic]', () => {
    test('maps class-based webfont name forms to their font classes', () => {
      // the rendered classes are the public contract that makes each
      // icon font display its glyph
      const cases = [
        ['mdi-close', 'mdi mdi-close'],
        ['fa-solid fa-house', 'fa-solid fa-house'],
        ['fas fa-heart', 'fas fa-heart'],
        ['la la-cog', 'la la-cog'],
        ['las la-atom', 'las la-atom'],
        ['eva-close', 'eva eva-close'],
        ['bi-x', 'bootstrap-icons bi-x'],
        ['ti-menu', 'themify-icon ti-menu'],
        // platform defaults to "md" outside iOS
        ['ion-heart', 'ionicons ion-md-heart'],
        // explicit-platform names pass through untouched
        ['ion-md-heart', 'ionicons ion-md-heart'],
        ['ion-ios-heart', 'ionicons ion-ios-heart'],
        ['ion-logo-github', 'ionicons ion-logo-github']
      ]

      for (const [name, expected] of cases) {
        const wrapper = mount(QIcon, { props: { name } })
        for (const cls of expected.split(' ')) {
          expect(wrapper.classes(), `name: ${name}`).toContain(cls)
        }
      }
    })

    test('renders img: and svguse: sources', () => {
      const img = mount(QIcon, {
        props: { name: 'img:https://cdn.example/x.png' }
      })
      expect(img.get('img').attributes('src')).toBe('https://cdn.example/x.png')

      const use = mount(QIcon, {
        props: { name: 'svguse:#my-symbol|0 0 32 32' }
      })
      expect(use.get('svg').attributes('viewBox')).toBe('0 0 32 32')
      // the xlink:href namespaced attribute surfaces under its localName
      expect(use.get('use').attributes('href')).toBe('#my-symbol')
    })

    test('resolves names through $q.iconMapFn', async () => {
      const wrapper = mount(QIcon, { props: { name: 'app:close' } })

      // iconMapFn state is shared plugin state -- always restore it
      try {
        // without a mapFn an unknown name is a material ligature
        expect(wrapper.classes()).toContain('material-icons')

        wrapper.vm.$q.iconMapFn = name => {
          if (name.startsWith('app:')) {
            // remap form: handled as if "name" was this value
            return { icon: 'mdi-' + name.slice(4) }
          }
          if (name.startsWith('appcls:')) {
            // direct form: explicit classes + ligature content
            return { cls: 'my-font', content: 'glyph' }
          }
          // declining (void) falls through to default handling
        }
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).toContain('mdi')
        expect(wrapper.classes()).toContain('mdi-close')

        await wrapper.setProps({ name: 'appcls:anything' })
        expect(wrapper.classes()).toContain('my-font')
        expect(wrapper.text()).toBe('glyph')

        await wrapper.setProps({ name: 'mdi-menu' })
        expect(wrapper.classes()).toContain('mdi-menu')

        // swapping to a NEW function remaps already-rendered icons
        // (mutating state behind the same function is documented as
        // not picked up -- results are cached per function)
        await wrapper.setProps({ name: 'app:close' })
        wrapper.vm.$q.iconMapFn = name =>
          name.startsWith('app:') ? { icon: 'eva-' + name.slice(4) } : void 0
        await wrapper.vm.$nextTick()

        expect(wrapper.classes()).toContain('eva')
        expect(wrapper.classes()).toContain('eva-close')
      } finally {
        wrapper.vm.$q.iconMapFn = null
      }
    })

    test('maps material prefix variants and falls back to ligature', () => {
      const outlined = mount(QIcon, { props: { name: 'o_home' } })
      expect(outlined.classes()).toContain('material-icons-outlined')
      expect(outlined.text()).toBe('home')

      const symbols = mount(QIcon, { props: { name: 'sym_o_home' } })
      expect(symbols.classes()).toContain('material-symbols-outlined')
      expect(symbols.text()).toBe('home')

      // a "sym_" name outside the three known variants is a regular
      // material-icons ligature name
      const unknownSym = mount(QIcon, { props: { name: 'sym_x' } })
      expect(unknownSym.classes()).toContain('material-icons')
      expect(unknownSym.text()).toBe('sym_x')
    })
  })

  describe('[Accessibility]', () => {
    test('keeps the ligature text out of the accessibility tree', () => {
      // an interactive icon (e.g. a clearable field's action) overrides
      // aria-hidden and carries its own accessible name
      const wrapper = mount(QIcon, {
        props: { name: 'cancel' },
        attrs: {
          'aria-hidden': 'false',
          role: 'button',
          'aria-label': 'Clear'
        }
      })

      expect(wrapper.attributes('aria-hidden')).toBe('false')

      // the glyph text lives in an aria-hidden wrapper, so the
      // aria-label stays the control's only accessible text
      const ligature = wrapper.get('span[aria-hidden="true"]')
      expect(ligature.text()).toBe('cancel')
    })

    test('renders class-based webfont icons without a ligature wrapper', () => {
      // class-based sets draw their glyph via the font's ::before rule
      // and carry no text content at all -- nothing can surface in the
      // accessibility tree, so no wrapper element is needed
      const wrapper = mount(QIcon, {
        props: { name: 'mdi-close' }
      })

      expect(wrapper.classes()).toContain('mdi')
      expect(wrapper.find('span').exists()).toBe(false)
      expect(wrapper.text()).toBe('')
    })
  })
})
