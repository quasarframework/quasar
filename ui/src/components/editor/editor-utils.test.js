import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, getCurrentInstance, h, ref } from 'vue'

import QBtn from '../btn/QBtn.js'
import QBtnDropdown from '../btn-dropdown/QBtnDropdown.js'
import { getFonts, getLinkEditor, getToolbar } from './editor-utils.js'

/**
 * The link editor drives the real execCommand of the browser; a passthrough
 * spy keeps the calls observable. The caret handed in by createEVm() is a
 * stub, so no selection gets restored and the commands act on nothing.
 */
let execCommand
let wrapper

beforeEach(() => {
  execCommand = vi.spyOn(document, 'execCommand')
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  vi.restoreAllMocks()
})

/**
 * Builds the "editor vm" the utils are handed by QEditor. Only the pieces
 * they actually reach for are provided.
 */
function createEVm($q, { props = {}, buttons = [], ...overrides } = {}) {
  return {
    $q,
    props: {
      toolbarColor: void 0,
      toolbarTextColor: void 0,
      toolbarToggleColor: void 0,
      toolbarPush: false,
      ...props
    },
    slots: {},
    emit: vi.fn(),

    caret: {
      is: vi.fn(() => false),
      can: vi.fn(() => true),
      restore: vi.fn()
    },

    isViewingSource: ref(false),
    editLinkUrl: ref('https://quasar.dev'),
    toolbarTabStop: ref(null),
    toolbarBackgroundClass: computed(() => ' bg-grey-3'),
    buttonProps: computed(() => ({ type: 'a', flat: true, dense: true })),
    contentRef: ref(null),
    buttons: computed(() => buttons),
    runCmd: vi.fn(),

    ...overrides
  }
}

/**
 * Renders whatever the util returns; $q is only reachable from inside a
 * component, so the "editor vm" is assembled there too.
 */
function mountUtil(render, options) {
  let eVm

  wrapper = mount(
    defineComponent({
      setup() {
        const {
          proxy: { $q }
        } = getCurrentInstance()

        eVm = createEVm($q, options)

        return () => h('div', render(eVm))
      }
    }),
    { attachTo: document.body }
  )

  return { eVm }
}

const boldBtn = { cmd: 'bold', icon: 'format_bold', tip: 'Bold' }

describe('[editorUtils API]', () => {
  describe('[Functions]', () => {
    describe('[(function)getToolbar]', () => {
      test('has correct return value', () => {
        mountUtil(getToolbar, { buttons: [[boldBtn]] })

        expect(wrapper.findAll('.q-editor__toolbar-group')).toHaveLength(1)
        expect(wrapper.findAllComponents(QBtn)).toHaveLength(1)
      })

      test('builds nothing before the caret exists', () => {
        const eVm = createEVm({}, { buttons: [[boldBtn]] })
        eVm.caret = void 0

        expect(getToolbar(eVm)).toBeUndefined()
      })

      test('renders one group per button group', () => {
        mountUtil(getToolbar, {
          buttons: [
            [boldBtn, { cmd: 'italic', icon: 'format_italic' }],
            [boldBtn]
          ]
        })

        expect(wrapper.findAll('.q-editor__toolbar-group')).toHaveLength(2)
        expect(wrapper.findAllComponents(QBtn)).toHaveLength(3)
      })

      test('passes the button definition down to QBtn', () => {
        mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, label: 'B' }]],
          props: { toolbarColor: 'primary', toolbarTextColor: 'white' }
        })

        const btn = wrapper.findComponent(QBtn)

        expect(btn.props()).toMatchObject({
          icon: 'format_bold',
          label: 'B',
          color: 'primary',
          textColor: 'white',
          size: 'sm',
          dense: true,
          flat: true
        })
      })

      test('drops a null icon instead of forwarding it', () => {
        mountUtil(getToolbar, { buttons: [[{ ...boldBtn, icon: null }]] })

        expect(wrapper.findComponent(QBtn).props('icon')).toBeUndefined()
      })

      test('labels an icon-only button for assistive technology', () => {
        mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, label: null }]]
        })

        expect(wrapper.get('.q-btn').attributes('aria-label')).toBe('Bold')
      })

      test.each([
        ['is toggled through the caret', {}, true, 'accent'],
        ['is not toggled', {}, false, 'primary'],
        [
          'is toggled through its own resolver',
          { toggled: () => true },
          false,
          'accent'
        ]
      ])(
        'colors a toggle button that %s',
        async (_, extra, caretIs, expected) => {
          const { eVm } = mountUtil(getToolbar, {
            buttons: [[{ ...boldBtn, type: 'toggle', ...extra }]],
            props: { toolbarColor: 'primary', toolbarToggleColor: 'accent' }
          })

          // the toolbar is rebuilt on every render, so the caret is re-asked
          eVm.caret.is.mockReturnValue(caretIs)
          wrapper.vm.$forceUpdate()
          await wrapper.vm.$nextTick()

          expect(wrapper.findComponent(QBtn).props('color')).toBe(expected)
        }
      )

      test('keeps the text color of a toggled button while pushed', () => {
        mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, type: 'toggle', toggled: () => true }]],
          props: { toolbarPush: true, toolbarTextColor: 'white' }
        })

        expect(wrapper.findComponent(QBtn).props('textColor')).toBe('white')
      })

      test.each([
        ['a boolean', true, true],
        ['a resolver', () => true, true],
        ['nothing at all', void 0, false]
      ])('disables a button through %s', (_, disable, expected) => {
        mountUtil(getToolbar, { buttons: [[{ ...boldBtn, disable }]] })

        expect(wrapper.findComponent(QBtn).props('disable')).toBe(expected)
      })

      test('hands the editor vm to the disable resolver', () => {
        const disable = vi.fn(() => false)
        const { eVm } = mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, disable }]]
        })

        expect(disable).toHaveBeenCalledWith(eVm)
      })

      test('runs the command behind a button', async () => {
        const { eVm } = mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, param: 'x' }]]
        })

        await wrapper.get('.q-btn').trigger('click')

        expect(eVm.runCmd).toHaveBeenCalledExactlyOnceWith('bold', 'x')
      })

      test('prefers the handler of a button over its command', async () => {
        const handler = vi.fn()
        const { eVm } = mountUtil(getToolbar, {
          buttons: [[{ ...boldBtn, handler }]]
        })

        await wrapper.get('.q-btn').trigger('click')

        expect(eVm.runCmd).not.toHaveBeenCalled()
        expect(handler).toHaveBeenCalledExactlyOnceWith(
          expect.any(Object),
          eVm,
          eVm.caret
        )
      })

      test('renders a slot button through the editor slots', () => {
        mountUtil(getToolbar, {
          buttons: [[{ type: 'slot', slot: 'mySlot' }]],
          slots: { mySlot: () => h('div', { class: 'my-slot' }, 'Custom') }
        })

        expect(wrapper.get('.my-slot').text()).toBe('Custom')
        expect(wrapper.findComponent(QBtn).exists()).toBe(false)
      })

      test('renders a dropdown button', () => {
        mountUtil(getToolbar, {
          buttons: [
            [
              {
                type: 'dropdown',
                label: 'Size',
                icon: 'format_size',
                options: [boldBtn]
              }
            ]
          ]
        })

        expect(wrapper.findComponent(QBtnDropdown).props()).toMatchObject({
          label: 'Size',
          icon: 'format_size',
          noCaps: true,
          noWrap: true
        })
      })

      test('narrows the toolbar down to the source toggle while viewing source', () => {
        mountUtil(getToolbar, {
          isViewingSource: ref(true),
          buttons: [
            [boldBtn, { cmd: 'viewsource', icon: 'code' }],
            [{ cmd: 'italic', icon: 'format_italic' }]
          ]
        })

        // the group without a viewsource button is dropped entirely, and the
        // remaining group keeps only that button
        expect(wrapper.findAll('.q-editor__toolbar-group')).toHaveLength(1)

        const buttons = wrapper.findAllComponents(QBtn)
        expect(buttons).toHaveLength(1)
        expect(buttons[0].props('icon')).toBe('code')
      })
    })

    describe('[(function)getFonts]', () => {
      test('has correct return value', () => {
        const fonts = getFonts('def', 'Default Font', 'font_download', {
          arial: 'Arial'
        })

        expect(fonts).toStrictEqual({
          default_font: {
            cmd: 'fontName',
            param: 'def',
            icon: 'font_download',
            tip: 'Default Font'
          },
          arial: {
            cmd: 'fontName',
            param: 'Arial',
            icon: 'font_download',
            tip: 'Arial',
            htmlTip: '<font face="Arial">Arial</font>'
          }
        })
      })

      test.each([
        ['no fonts at all', void 0],
        ['an empty list', {}]
      ])('builds nothing out of %s', (_, fonts) => {
        expect(getFonts('def', 'Default', 'icon', fonts)).toStrictEqual({})
      })

      test('builds one entry per alias', () => {
        const fonts = getFonts('def', 'Default', 'icon', {
          arial: 'Arial',
          times: 'Times New Roman'
        })

        expect(Object.keys(fonts)).toStrictEqual([
          'default_font',
          'arial',
          'times'
        ])
        expect(fonts.times.param).toBe('Times New Roman')
        expect(fonts.times.htmlTip).toBe(
          '<font face="Times New Roman">Times New Roman</font>'
        )
      })
    })

    describe('[(function)getLinkEditor]', () => {
      test('has correct return value', () => {
        const { eVm } = mountUtil(getLinkEditor)

        expect(wrapper.get('.q-editor__link-input').element.value).toBe(
          'https://quasar.dev'
        )
        expect(wrapper.text()).toContain(eVm.$q.lang.editor.url)
        expect(wrapper.findAllComponents(QBtn)).toHaveLength(2)
      })

      test('builds nothing before the caret exists', () => {
        const eVm = createEVm({})
        eVm.caret = void 0

        expect(getLinkEditor(eVm)).toBeUndefined()
      })

      test('paints itself with the toolbar color', () => {
        mountUtil(getLinkEditor, {
          props: { toolbarColor: 'primary', toolbarTextColor: 'white' }
        })

        expect(wrapper.get('.q-mx-xs').classes()).toContain('text-primary')
      })

      test('falls back to the toolbar text color', () => {
        mountUtil(getLinkEditor, { props: { toolbarTextColor: 'white' } })

        expect(wrapper.get('.q-mx-xs').classes()).toContain('text-white')
      })

      test.each([
        [
          'the update button',
          async () => {
            await wrapper.findAllComponents(QBtn)[1].trigger('click')
          }
        ],
        [
          'the ENTER key',
          async () => {
            await wrapper
              .get('.q-editor__link-input')
              .trigger('keydown', { keyCode: 13 })
          }
        ]
      ])('applies an edited link through %s', async (_, apply) => {
        const { eVm } = mountUtil(getLinkEditor)
        const input = wrapper.get('.q-editor__link-input')

        await input.setValue('https://vuejs.org')
        await apply()

        expect(eVm.caret.restore).toHaveBeenCalled()
        expect(execCommand).toHaveBeenCalledExactlyOnceWith(
          'createLink',
          false,
          'https://vuejs.org'
        )
        expect(eVm.editLinkUrl.value).toBeNull()
      })

      test('leaves an untouched link alone', async () => {
        const { eVm } = mountUtil(getLinkEditor)

        await wrapper.findAllComponents(QBtn)[1].trigger('click')

        expect(execCommand).not.toHaveBeenCalled()
        expect(eVm.editLinkUrl.value).toBeNull()
      })

      test('turns an emptied link into a blank one', async () => {
        mountUtil(getLinkEditor)

        await wrapper.get('.q-editor__link-input').setValue('')
        await wrapper.findAllComponents(QBtn)[1].trigger('click')

        expect(execCommand).toHaveBeenCalledExactlyOnceWith(
          'createLink',
          false,
          ' '
        )
      })

      test('removes the link through the remove button', async () => {
        const { eVm } = mountUtil(getLinkEditor)

        await wrapper.findAllComponents(QBtn)[0].trigger('click')

        expect(eVm.caret.restore).toHaveBeenCalledOnce()
        expect(execCommand).toHaveBeenCalledExactlyOnceWith('unlink')
        expect(eVm.editLinkUrl.value).toBeNull()
      })

      test.each([
        ['a link that was never set', 'https://', true],
        ['an empty link', '', true],
        ['an existing link', 'https://quasar.dev', false]
      ])('handles ESCAPE over %s', async (_, editLinkUrl, unlinked) => {
        const { eVm } = mountUtil(getLinkEditor, {
          editLinkUrl: ref(editLinkUrl)
        })

        await wrapper
          .get('.q-editor__link-input')
          .trigger('keydown', { keyCode: 27 })

        expect(eVm.caret.restore).toHaveBeenCalledOnce()
        expect(execCommand.mock.calls).toStrictEqual(
          unlinked ? [['unlink']] : []
        )
        expect(eVm.editLinkUrl.value).toBeNull()
      })

      test('ignores any other key', async () => {
        const { eVm } = mountUtil(getLinkEditor)

        await wrapper
          .get('.q-editor__link-input')
          .trigger('keydown', { keyCode: 65 })

        expect(eVm.caret.restore).not.toHaveBeenCalled()
        expect(execCommand).not.toHaveBeenCalled()
        expect(eVm.editLinkUrl.value).toBe('https://quasar.dev')
      })

      test('stays out of the way of an IME composition', async () => {
        const { eVm } = mountUtil(getLinkEditor)

        await wrapper
          .get('.q-editor__link-input')
          .trigger('keydown', { keyCode: 13, isComposing: true })

        expect(execCommand).not.toHaveBeenCalled()
        expect(eVm.editLinkUrl.value).toBe('https://quasar.dev')
      })
    })
  })
})
