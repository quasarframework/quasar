import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { nextTick } from 'vue'

import langEn from '../../../lang/en-US.js'

import Platform from '../../plugins/platform/Platform.js'
import QTooltip from '../tooltip/QTooltip.js'
import QEditor from './QEditor.js'

/**
 * The contenteditable engine behind QEditor runs on the real execCommand
 * and queryCommand* implementations of the browser; a passthrough spy on
 * execCommand merely keeps the calls observable.
 */
let execCommand
const activeWrappers = []

beforeEach(() => {
  execCommand = vi.spyOn(document, 'execCommand')
})

afterEach(() => {
  while (activeWrappers.length !== 0) {
    activeWrappers.pop().unmount()
  }

  document.getSelection().removeAllRanges()
  vi.restoreAllMocks()
})

function mountEditor(props, options) {
  props ||= {}
  options ||= {}

  const wrapper = mount(QEditor, {
    props: {
      modelValue: '<p>Hello</p>',
      ...props
    },
    ...options
  })

  activeWrappers.push(wrapper)
  return wrapper
}

function getContent(wrapper) {
  return wrapper.get('.q-editor__content')
}

function getToolbar(wrapper) {
  return wrapper.get('.q-editor__toolbar')
}

function getToolbarButtons(wrapper) {
  return wrapper.findAll('.q-editor__toolbar .q-btn')
}

// the toolbar refresh is timer based
function flushToolbar() {
  return new Promise(resolve => {
    setTimeout(resolve, 2)
  })
}

// the dropdown only reports itself shown/hidden after its transition
function flushDropdown() {
  return new Promise(resolve => {
    setTimeout(resolve, 350)
  })
}

/**
 * The toggled state of a toolbar button is only computed while there is a
 * selection inside of the content element.
 */
function selectContent(wrapper) {
  const range = document.createRange()
  range.selectNodeContents(getContent(wrapper).element)

  const selection = document.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

// the CTRL shortcuts are wired on the content element
function pressCtrlKey(wrapper, keyCode) {
  getContent(wrapper).element.dispatchEvent(
    new KeyboardEvent('keydown', {
      keyCode,
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    })
  )
}

// dropdowns are declared as an object token holding the options
const fontDropdown = {
  label: 'Font',
  fixedLabel: true,
  options: ['default_font', 'arial']
}

describe('[QEditor API]', () => {
  describe('[Props]', () => {
    describe('[(prop)fullscreen]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor({
          fullscreen: false,
          'onUpdate:fullscreen': () => {}
        })

        expect(wrapper.classes()).not.toContain('fullscreen')

        await wrapper.setProps({ fullscreen: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['fullscreen', 'column'])
        )
        expect(wrapper.element.style.height).toBe('100%')
      })
    })

    describe('[(prop)no-route-fullscreen-exit]', () => {
      test('type Boolean has effect', async () => {
        // the flag is only consulted on a route change, so what can be
        // checked without a router is that it does not alter the rest
        const wrapper = mountEditor({ noRouteFullscreenExit: true })

        expect(wrapper.classes()).not.toContain('fullscreen')

        wrapper.vm.setFullscreen()
        await nextTick()

        expect(wrapper.classes()).toContain('fullscreen')
      })
    })

    describe('[(prop)model-value]', () => {
      test('type String has effect', async () => {
        const propVal = '<p>Some content</p>'
        const wrapper = mountEditor({ modelValue: propVal })
        await flushPromises()

        expect(getContent(wrapper).element.innerHTML).toBe(propVal)

        await wrapper.setProps({ modelValue: '<p>Other</p>' })

        expect(getContent(wrapper).element.innerHTML).toBe('<p>Other</p>')
      })
    })

    describe('[(prop)readonly]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()
        await flushToolbar()

        expect(getContent(wrapper).attributes('contenteditable')).toBe('true')

        await wrapper.setProps({ readonly: true })

        expect(getContent(wrapper).attributes('contenteditable')).toBe('false')
        // unlike "disable", it does not dim the whole editor
        expect(wrapper.classes()).not.toContain('disabled')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()

        expect(wrapper.classes()).not.toContain('q-editor--square')

        await wrapper.setProps({ square: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-editor--square', 'no-border-radius'])
        )
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()

        expect(wrapper.classes()).not.toContain('q-editor--flat')

        await wrapper.setProps({ flat: true })

        expect(wrapper.classes()).toContain('q-editor--flat')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()

        expect(wrapper.classes()).not.toContain('q-editor--dense')

        await wrapper.setProps({ dense: true })

        expect(wrapper.classes()).toContain('q-editor--dense')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()

        expect(wrapper.classes()).not.toContain('q-editor--dark')

        await wrapper.setProps({ dark: true })

        expect(wrapper.classes()).toEqual(
          expect.arrayContaining(['q-editor--dark', 'q-dark'])
        )
      })

      test('type null has effect', async () => {
        const wrapper = mountEditor({ dark: null })

        wrapper.vm.$q.dark.set(false)
        await nextTick()

        expect(wrapper.classes()).not.toContain('q-editor--dark')

        wrapper.vm.$q.dark.set(true)
        await nextTick()

        expect(wrapper.classes()).toContain('q-editor--dark')

        wrapper.vm.$q.dark.set(false)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor()
        await flushToolbar()

        await wrapper.setProps({ disable: true })

        expect(wrapper.classes()).toContain('disabled')
        expect(getContent(wrapper).attributes('aria-disabled')).toBe('true')
        expect(getContent(wrapper).attributes('contenteditable')).toBe('false')
      })
    })

    describe('[(prop)min-height]', () => {
      test('type String has effect', async () => {
        const propVal = '20rem'
        const wrapper = mountEditor()

        // it defaults to 10rem
        expect(getContent(wrapper).$style('minHeight')).toBe('10rem')

        await wrapper.setProps({ minHeight: propVal })

        expect(getContent(wrapper).$style('minHeight')).toBe(propVal)
      })
    })

    describe('[(prop)max-height]', () => {
      test('type String has effect', async () => {
        const propVal = '20rem'
        const wrapper = mountEditor()

        expect(getContent(wrapper).$style('maxHeight')).toBe('')
        expect(getContent(wrapper).classes()).not.toContain('overflow-auto')

        await wrapper.setProps({ maxHeight: propVal })

        expect(getContent(wrapper).$style('maxHeight')).toBe(propVal)
        // it also becomes scrollable
        expect(getContent(wrapper).classes()).toContain('overflow-auto')
      })
    })

    describe('[(prop)height]', () => {
      test('type String has effect', async () => {
        const propVal = '20rem'
        const wrapper = mountEditor()

        expect(getContent(wrapper).$style('height')).toBe('')

        await wrapper.setProps({ height: propVal })

        expect(getContent(wrapper).$style('height')).toBe(propVal)
      })
    })

    describe('[(prop)definitions]', () => {
      test('type Object has effect', async () => {
        const propVal = {
          save: { tip: 'Save your work', icon: 'save', label: 'Save' }
        }
        const wrapper = mountEditor({ toolbar: [['save']] })
        await flushToolbar()

        // an unknown token renders no button of its own
        expect(getToolbarButtons(wrapper)).toHaveLength(0)

        await wrapper.setProps({ definitions: propVal })
        await flushToolbar()

        const buttons = getToolbarButtons(wrapper)
        expect(buttons).toHaveLength(1)
        expect(buttons[0].text()).toContain('Save')
      })
    })

    describe('[(prop)fonts]', () => {
      test('type Object has effect', async () => {
        const propVal = { arial: 'Arial' }
        const wrapper = mountEditor(
          { toolbar: [[fontDropdown]] },
          { attachTo: document.body }
        )
        await flushToolbar()

        const dropdown = wrapper.findComponent({ name: 'QBtnDropdown' })

        // without the prop the font tokens resolve to nothing
        dropdown.vm.show()
        await flushPromises()
        await flushDropdown()

        expect(document.querySelectorAll('.q-menu .q-item')).toHaveLength(0)

        dropdown.vm.hide()
        await flushPromises()
        await flushDropdown()

        await wrapper.setProps({ fonts: propVal })
        await flushToolbar()

        dropdown.vm.show()
        await flushPromises()
        await flushDropdown()

        // the default font, plus one entry per alias
        const items = [...document.querySelectorAll('.q-menu .q-item')]
        expect(items).toHaveLength(2)
        expect(items.at(-1).textContent).toContain('Arial')
      })
    })

    describe('[(prop)toolbar]', () => {
      test('type Array has effect', async () => {
        const wrapper = mountEditor({ toolbar: [['bold']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)).toHaveLength(1)

        await wrapper.setProps({ toolbar: [['bold', 'italic'], ['undo']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)).toHaveLength(3)
        // each array is rendered as a group of its own
        expect(
          wrapper.findAll('.q-editor__toolbar .q-editor__toolbar-group')
        ).toHaveLength(2)
      })

      test('hides the toolbar when empty', async () => {
        const wrapper = mountEditor({ toolbar: [] })
        await flushToolbar()

        expect(wrapper.find('.q-editor__toolbar').exists()).toBe(false)
      })

      test('ignores holes in a group (#16940)', async () => {
        // a stray comma in the definition creates an array hole,
        // e.g. :toolbar="[ [ 'bold', , 'italic' ] ]"
        const sparseGroup = ['bold', 'italic']
        sparseGroup.length = 3

        const wrapper = mountEditor({ toolbar: [sparseGroup, ['viewsource']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)).toHaveLength(3)

        // entering source view scans the groups with find(), which,
        // unlike the render path, visits holes
        await getToolbarButtons(wrapper)[2].trigger('click')
        await flushToolbar()

        expect(getToolbarButtons(wrapper)).toHaveLength(1)
      })

      test('only accepts non-empty groups', () => {
        const { validator, default: getDefault } = QEditor.props.toolbar

        expect(validator(getDefault())).toBe(true)
        expect(validator([['bold']])).toBe(true)
        expect(validator([[]])).toBe(false)
      })
    })

    describe('[(prop)toolbar-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountEditor({ toolbar: [['bold']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).not.toContain(
          `text-${propVal}`
        )

        await wrapper.setProps({ toolbarColor: propVal })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)toolbar-text-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'primary'
        const wrapper = mountEditor({
          toolbar: [['bold']],
          toolbarTextColor: propVal
        })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          `text-${propVal}`
        )
      })
    })

    describe('[(prop)toolbar-toggle-color]', () => {
      test('type String has effect', async () => {
        const propVal = 'accent'

        // an active command is what gets the toggle color; selecting the
        // bold content makes the real queryCommandState report it as active
        const wrapper = mountEditor(
          {
            modelValue: '<b>Hello</b>',
            toolbar: [['bold']],
            toolbarToggleColor: propVal
          },
          { attachTo: document.body }
        )
        await flushToolbar()

        // an untoggled button carries no color of its own
        expect(getToolbarButtons(wrapper)[0].classes()).not.toContain(
          `text-${propVal}`
        )

        selectContent(wrapper)
        wrapper.vm.refreshToolbar()
        await flushToolbar()
        await nextTick()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          `text-${propVal}`
        )
      })

      test('defaults to primary', async () => {
        const wrapper = mountEditor(
          { modelValue: '<b>Hello</b>', toolbar: [['bold']] },
          { attachTo: document.body }
        )
        selectContent(wrapper)
        wrapper.vm.refreshToolbar()
        await flushToolbar()
        await nextTick()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          'text-primary'
        )
      })
    })

    describe('[(prop)toolbar-bg]', () => {
      test('type String has effect', async () => {
        const propVal = 'grey-3'
        const wrapper = mountEditor()
        await flushToolbar()

        expect(getToolbar(wrapper).classes()).not.toContain(`bg-${propVal}`)

        await wrapper.setProps({ toolbarBg: propVal })
        await flushToolbar()

        expect(getToolbar(wrapper).classes()).toContain(`bg-${propVal}`)
      })
    })

    describe('[(prop)toolbar-outline]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor({ toolbar: [['bold']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain('q-btn--flat')

        await wrapper.setProps({ toolbarOutline: true })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          'q-btn--outline'
        )
        expect(getToolbarButtons(wrapper)[0].classes()).not.toContain(
          'q-btn--flat'
        )
      })
    })

    describe('[(prop)toolbar-push]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor({ toolbar: [['bold']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).not.toContain(
          'q-btn--push'
        )

        await wrapper.setProps({ toolbarPush: true })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain('q-btn--push')
      })
    })

    describe('[(prop)toolbar-rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountEditor({ toolbar: [['bold']] })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).not.toContain(
          'q-btn--rounded'
        )

        await wrapper.setProps({ toolbarRounded: true })
        await flushToolbar()

        expect(getToolbarButtons(wrapper)[0].classes()).toContain(
          'q-btn--rounded'
        )
      })
    })

    describe('[(prop)paragraph-tag]', () => {
      function testParagraphTag(propVal) {
        mountEditor({ paragraphTag: propVal })

        // it configures the contenteditable engine on creation
        expect(execCommand).toHaveBeenCalledWith(
          'defaultParagraphSeparator',
          false,
          propVal
        )
      }

      test('value "div" has effect', () => {
        testParagraphTag('div')
      })

      test('value "p" has effect', () => {
        testParagraphTag('p')
      })

      test('only accepts the documented values', () => {
        const { validator, default: defaultValue } = QEditor.props.paragraphTag

        expect(validator(defaultValue)).toBe(true)
        expect(validator('p')).toBe(true)
        expect(validator('span')).toBe(false)
      })
    })

    describe('[(prop)content-style]', () => {
      test('type Object has effect', async () => {
        const propVal = { color: 'red' }
        const wrapper = mountEditor()

        expect(getContent(wrapper).$style('color')).toBe('')

        await wrapper.setProps({ contentStyle: propVal })

        expect(getContent(wrapper).$style('color')).toBe('red')
        // it does not drop the height constraints
        expect(getContent(wrapper).$style('minHeight')).toBe('10rem')
      })
    })

    describe('[(prop)content-class]', () => {
      test('type String has effect', async () => {
        const propVal = 'my-class'
        const wrapper = mountEditor()

        expect(getContent(wrapper).classes()).not.toContain(propVal)

        await wrapper.setProps({ contentClass: propVal })

        expect(getContent(wrapper).classes()).toContain(propVal)
      })

      test('type Array has effect', () => {
        const propVal = ['my-class', 'my-other-class']
        const wrapper = mountEditor({ contentClass: propVal })

        expect(getContent(wrapper).classes()).toEqual(
          expect.arrayContaining(propVal)
        )
      })

      test('type Object has effect', () => {
        const propVal = { 'my-class': true, unused: false }
        const wrapper = mountEditor({ contentClass: propVal })

        expect(getContent(wrapper).classes()).toContain('my-class')
        expect(getContent(wrapper).classes()).not.toContain('unused')
      })
    })

    describe('[(prop)placeholder]', () => {
      test('type String has effect', async () => {
        const propVal = 'Write something...'
        const wrapper = mountEditor()

        expect(
          getContent(wrapper).attributes('aria-placeholder')
        ).toBeUndefined()

        await wrapper.setProps({ placeholder: propVal })

        expect(getContent(wrapper).attributes('aria-placeholder')).toBe(propVal)
      })

      test('shows over the empty content', () => {
        const propVal = 'Write something...'
        const wrapper = mountEditor({ modelValue: '', placeholder: propVal })

        const style = window.getComputedStyle(
          getContent(wrapper).element,
          ':before'
        )

        expect(style.content).toBe(`"${propVal}"`)
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor()

        wrapper.vm.setFullscreen()
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('fullscreen')
        expect(eventList.fullscreen).toHaveLength(1)

        const [state] = eventList.fullscreen[0]
        expect(state).toBe(true)
      })
    })

    describe('[(event)update:fullscreen]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor({ 'onUpdate:fullscreen': () => {} })

        wrapper.vm.setFullscreen()
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:fullscreen')
        expect(eventList['update:fullscreen']).toHaveLength(1)

        const [state] = eventList['update:fullscreen'][0]
        expect(state).toBe(true)
      })
    })

    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        // the content is a contenteditable, so it reports its own HTML
        getContent(wrapper).element.innerHTML = '<p>Edited</p>'
        await getContent(wrapper).trigger('input')

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('<p>Edited</p>')
      })
    })

    describe('[(event)dropdown-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor({
          toolbar: [[fontDropdown]],
          fonts: { arial: 'Arial' }
        })
        await flushToolbar()

        wrapper.findComponent({ name: 'QBtnDropdown' }).vm.show()
        await flushPromises()
        await flushDropdown()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('dropdownShow')
        expect(eventList.dropdownShow).toHaveLength(1)
      })
    })

    describe('[(event)dropdown-before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor({
          toolbar: [[fontDropdown]],
          fonts: { arial: 'Arial' }
        })
        await flushToolbar()

        wrapper.findComponent({ name: 'QBtnDropdown' }).vm.show()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('dropdownBeforeShow')
        expect(eventList.dropdownBeforeShow).toHaveLength(1)
      })
    })

    describe('[(event)dropdown-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor({
          toolbar: [[fontDropdown]],
          fonts: { arial: 'Arial' }
        })
        await flushToolbar()

        const dropdown = wrapper.findComponent({ name: 'QBtnDropdown' })
        dropdown.vm.show()
        await flushPromises()
        await flushDropdown()

        dropdown.vm.hide()
        await flushPromises()
        await flushDropdown()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('dropdownHide')
        expect(eventList.dropdownHide).toHaveLength(1)
      })
    })

    describe('[(event)dropdown-before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor({
          toolbar: [[fontDropdown]],
          fonts: { arial: 'Arial' }
        })
        await flushToolbar()

        const dropdown = wrapper.findComponent({ name: 'QBtnDropdown' })
        dropdown.vm.show()
        await flushPromises()
        await flushDropdown()

        dropdown.vm.hide()
        await flushPromises()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('dropdownBeforeHide')
        expect(eventList.dropdownBeforeHide).toHaveLength(1)
      })
    })

    describe('[(event)link-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        // the link editor opens as soon as an URL is being edited
        wrapper.vm.caret.eVm.editLinkUrl.value = 'https://quasar.dev'
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('linkShow')
        expect(eventList.linkShow).toHaveLength(1)

        expect(wrapper.findAll('.q-editor__toolbar')).toHaveLength(2)
      })
    })

    describe('[(event)link-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        wrapper.vm.caret.eVm.editLinkUrl.value = 'https://quasar.dev'
        await nextTick()

        wrapper.vm.caret.eVm.editLinkUrl.value = null
        await nextTick()

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('linkHide')
        expect(eventList.linkHide).toHaveLength(1)

        expect(wrapper.findAll('.q-editor__toolbar')).toHaveLength(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)toggleFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor()

        expect(wrapper.vm.toggleFullscreen()).toBeUndefined()
        await nextTick()

        expect(wrapper.classes()).toContain('fullscreen')

        wrapper.vm.toggleFullscreen()
        await nextTick()

        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(method)setFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor()

        expect(wrapper.vm.setFullscreen()).toBeUndefined()
        await nextTick()

        expect(wrapper.classes()).toContain('fullscreen')
        expect(wrapper.emitted('fullscreen')).toStrictEqual([[true]])

        // calling it again keeps it there
        wrapper.vm.setFullscreen()
        await nextTick()

        expect(wrapper.classes()).toContain('fullscreen')
        expect(wrapper.emitted('fullscreen')).toHaveLength(1)
      })
    })

    describe('[(method)exitFullscreen]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor()

        wrapper.vm.setFullscreen()
        await nextTick()

        expect(wrapper.vm.exitFullscreen()).toBeUndefined()
        await nextTick()

        expect(wrapper.classes()).not.toContain('fullscreen')
      })
    })

    describe('[(method)runCmd]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        expect(wrapper.vm.runCmd('bold')).toBeUndefined()

        expect(execCommand).toHaveBeenCalledWith('bold', false, void 0)
      })

      test('passes the param along', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        wrapper.vm.runCmd('formatBlock', 'H1')

        expect(execCommand).toHaveBeenCalledWith('formatBlock', false, 'H1')
      })
    })

    describe('[(method)refreshToolbar]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        wrapper.vm.caret.eVm.editLinkUrl.value = 'https://quasar.dev'
        await nextTick()
        expect(wrapper.findAll('.q-editor__toolbar')).toHaveLength(2)

        // it closes the link editor and repaints the toolbar
        expect(wrapper.vm.refreshToolbar()).toBeUndefined()
        await flushToolbar()
        await nextTick()

        expect(wrapper.findAll('.q-editor__toolbar')).toHaveLength(1)
      })
    })

    describe('[(method)focus]', () => {
      test('should be callable', async () => {
        const wrapper = mountEditor({}, { attachTo: document.body })
        await flushPromises()

        expect(wrapper.vm.focus()).toBeUndefined()
        await flushPromises()

        expect(getContent(wrapper).element).toBe(document.activeElement)
      })
    })

    describe('[(method)getContentEl]', () => {
      test('should be callable', () => {
        const wrapper = mountEditor()

        expect(wrapper.vm.getContentEl()).toBeInstanceOf(Element)
        expect(wrapper.vm.getContentEl()).toBe(getContent(wrapper).element)
      })
    })
  })

  describe('[Computed props]', () => {
    describe('[(computedProp)caret]', () => {
      test('should be exposed', async () => {
        const wrapper = mountEditor()
        await flushPromises()

        // it only becomes available once the content element exists
        expect(wrapper.vm.caret).toBeDefined()
        expect(wrapper.vm.caret.el).toBe(getContent(wrapper).element)
        expect(wrapper.vm.caret.can('link')).toBeTypeOf('boolean')
      })
    })
  })

  describe('[Generic]', () => {
    test.each([
      ['an only-icons dropdown', 'only-icons', '.q-menu .q-btn'],
      ['a list dropdown', void 0, '.q-menu .q-item']
    ])(
      'keeps the link editor open when the command comes from %s',
      async (_, list, optionSelector) => {
        const wrapper = mountEditor(
          {
            toolbar: [
              [
                {
                  label: 'Link',
                  fixedLabel: true,
                  fixedIcon: true,
                  list,
                  options: ['link']
                }
              ]
            ]
          },
          { attachTo: document.body }
        )
        await flushToolbar()

        getContent(wrapper).element.focus()
        selectContent(wrapper)
        // the click is what a real selection ends with, and it refreshes
        // the toolbar so the link command reports itself as available
        await getContent(wrapper).trigger('click')
        await flushToolbar()

        const dropdown = wrapper.findComponent({ name: 'QBtnDropdown' })
        dropdown.vm.show()
        await flushPromises()
        await flushDropdown()

        document
          .querySelector(optionSelector)
          .dispatchEvent(new MouseEvent('click', { bubbles: true }))

        // the menu lives in a portal, so the focus it hands back on close
        // used to read as "focus left the editor" and closed the editor
        // again one tick after it had opened
        await flushDropdown()
        await flushToolbar()

        expect(wrapper.find('.q-editor__link-input').exists()).toBe(true)
      }
    )

    test('toolbar tooltips render on mobile platforms too', async () => {
      // hybrids (iPad with a mouse) parse as mobile but can hover,
      // and QTooltip handles each pointer type on its own now
      const original = {
        mobile: Platform.is.mobile,
        desktop: Platform.is.desktop
      }
      Object.assign(Platform.is, { mobile: true, desktop: false })

      try {
        const wrapper = mountEditor({
          toolbar: [['save']],
          definitions: {
            save: { tip: 'Save your work', icon: 'save', handler: () => {} }
          }
        })
        await flushToolbar()

        expect(wrapper.findComponent(QTooltip).exists()).toBe(true)
      } finally {
        Object.assign(Platform.is, original)
      }
    })
  })

  describe('[Accessibility]', () => {
    test('toolbar toggles expose their state, not just a color', async () => {
      const wrapper = mountEditor({ toolbar: [['bold']] })
      await flushToolbar()

      // "bold" is a toggle command: its pressed state must be programmatic
      expect(getToolbarButtons(wrapper)[0].attributes('aria-pressed')).toBe(
        'false'
      )
    })

    test('plain toolbar commands are not marked as toggles', async () => {
      const wrapper = mountEditor({ toolbar: [['undo']] })
      await flushToolbar()

      expect(
        getToolbarButtons(wrapper)[0].attributes('aria-pressed')
      ).toBeUndefined()
    })

    test('content region is a multiline textbox', () => {
      const wrapper = mountEditor()
      const content = getContent(wrapper)

      expect(content.attributes('role')).toBe('textbox')
      expect(content.attributes('aria-multiline')).toBe('true')
      expect(content.attributes('aria-readonly')).toBeUndefined()
    })

    test('readonly content region is announced as such', () => {
      const wrapper = mountEditor({ readonly: true })

      expect(getContent(wrapper).attributes('aria-readonly')).toBe('true')
    })

    test('fall-through attributes land on the textbox, class/style on the root', () => {
      const wrapper = mountEditor(
        {},
        {
          attrs: {
            'aria-label': 'Post body',
            class: 'my-editor',
            style: 'margin: 7px'
          }
        }
      )
      const content = getContent(wrapper)

      expect(content.attributes('aria-label')).toBe('Post body')
      expect(wrapper.attributes('aria-label')).toBeUndefined()
      expect(wrapper.classes()).toContain('my-editor')
      expect(wrapper.attributes('style')).toContain('margin: 7px')
    })

    test('icon-only toolbar buttons use their tooltip as aria-label', async () => {
      const wrapper = mountEditor({
        toolbar: [['bold', 'italic', 'underline']]
      })
      await flushToolbar()

      expect(
        getToolbarButtons(wrapper).map(btn => btn.attributes('aria-label'))
      ).toEqual([
        langEn.editor.bold,
        langEn.editor.italic,
        langEn.editor.underline
      ])
    })

    test('toolbar buttons with a visible label do not get an aria-label', async () => {
      const wrapper = mountEditor({
        toolbar: [['save']],
        definitions: {
          save: { tip: 'Save your work', label: 'Save', handler: () => {} }
        }
      })
      await flushToolbar()

      const btn = getToolbarButtons(wrapper)[0]
      expect(btn.text()).toContain('Save')
      expect(btn.attributes('aria-label')).toBeUndefined()
    })

    test('toolbar is a labelled single Tab stop (roving tabindex)', async () => {
      const wrapper = mountEditor({
        toolbar: [
          ['bold', 'italic'],
          ['undo', 'redo']
        ]
      })
      await flushToolbar()

      const toolbar = getToolbar(wrapper)
      expect(toolbar.attributes('role')).toBe('toolbar')
      expect(toolbar.attributes('aria-label')).toBe(langEn.editor.toolbar)

      expect(
        getToolbarButtons(wrapper).map(btn => btn.attributes('tabindex'))
      ).toEqual(['0', '-1', '-1', '-1'])
    })

    test('arrow keys move focus between toolbar controls', async () => {
      const wrapper = mountEditor(
        { toolbar: [['bold', 'italic'], [fontDropdown]] },
        { attachTo: document.body }
      )
      await flushToolbar()

      const [boldEl, italicEl, dropdownEl] = getToolbarButtons(wrapper).map(
        btn => btn.element
      )

      function pressKey(keyCode, shiftKey = false) {
        document.activeElement.dispatchEvent(
          new KeyboardEvent('keydown', { keyCode, shiftKey, bubbles: true })
        )
      }

      boldEl.focus()

      pressKey(39) // ArrowRight
      expect(document.activeElement).toBe(italicEl)

      pressKey(39) // ArrowRight
      expect(document.activeElement).toBe(dropdownEl)

      // wraps around past the last control
      pressKey(39) // ArrowRight
      expect(document.activeElement).toBe(boldEl)

      pressKey(37) // ArrowLeft
      expect(document.activeElement).toBe(dropdownEl)

      pressKey(36) // Home
      expect(document.activeElement).toBe(boldEl)

      pressKey(35) // End
      expect(document.activeElement).toBe(dropdownEl)
    })

    test('the last focused control keeps the Tab stop', async () => {
      const wrapper = mountEditor(
        { toolbar: [['bold', 'italic', 'underline']] },
        { attachTo: document.body }
      )
      await flushToolbar()

      getToolbarButtons(wrapper)[1].element.focus()
      await flushToolbar()
      await nextTick()

      expect(
        getToolbarButtons(wrapper).map(btn => btn.attributes('tabindex'))
      ).toEqual(['-1', '0', '-1'])
    })

    test('icon-only dropdowns are named after their active option', async () => {
      const wrapper = mountEditor(
        {
          modelValue: '<div style="text-align: center">Hello</div>',
          toolbar: [
            [
              {
                icon: 'format_align_left',
                fixedLabel: true,
                fixedIcon: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
              }
            ]
          ]
        },
        { attachTo: document.body }
      )

      selectContent(wrapper)
      wrapper.vm.refreshToolbar()
      await flushToolbar()
      await nextTick()

      expect(
        wrapper
          .get('.q-editor__toolbar .q-btn-dropdown')
          .attributes('aria-label')
      ).toBe(langEn.editor.center)
    })

    test('CTRL shortcuts run the command of the matching toolbar button', async () => {
      const wrapper = mountEditor({ toolbar: [['bold']] })
      await flushPromises()

      pressCtrlKey(wrapper, 66) // CTRL + B

      expect(execCommand).toHaveBeenCalledWith('bold', false, void 0)
    })

    test('a cancelled keydown keeps the CTRL shortcut from running', async () => {
      const wrapper = mountEditor({
        toolbar: [['bold']],
        onKeydown: e => {
          e.preventDefault()
        }
      })
      await flushPromises()

      pressCtrlKey(wrapper, 66) // CTRL + B

      expect(wrapper.emitted('keydown')).toHaveLength(1)
      // the editor's own setup calls are the only ones left
      expect(execCommand).not.toHaveBeenCalledWith('bold', false, void 0)
    })
  })
})
