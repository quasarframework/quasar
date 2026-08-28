import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import QPopupEdit from './QPopupEdit.js'

let activeWrapper, lastScope

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  activeWrapper?.unmount()
  activeWrapper = void 0
  lastScope = void 0
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

/**
 * QPopupEdit renders a QMenu through a portal, so it is mounted inside
 * of an anchor and the resulting node is looked up in the document.
 */
function mountPopupEdit(props, slotFn) {
  props = { modelValue: 'any-value', ...props }

  activeWrapper = mount(
    defineComponent({
      props: { editProps: Object },
      setup(componentProps) {
        return () =>
          h('div', { class: 'my-anchor' }, [
            h(QPopupEdit, componentProps.editProps, {
              default: scope => {
                lastScope = scope
                return slotFn !== void 0
                  ? slotFn(scope)
                  : h('div', { class: 'my-content' }, 'Content')
              }
            })
          ])
      }
    }),
    {
      props: { editProps: props },
      attachTo: document.body
    }
  )

  return activeWrapper
}

function getPopup() {
  return document.querySelector('.q-popup-edit')
}

function getPopupEdit(wrapper) {
  return wrapper.findComponent(QPopupEdit)
}

function getMenu(wrapper) {
  return wrapper.findComponent({ name: 'QMenu' })
}

function getMenuProp(props, propName) {
  return getMenu(mountPopupEdit(props)).props(propName)
}

function getAnchor(wrapper) {
  return wrapper.get('.my-anchor')
}

function getButtons() {
  return [...document.querySelectorAll('.q-popup-edit__buttons .q-btn')]
}

async function settle() {
  await flushPromises()
  await vi.runAllTimersAsync()
}

async function showPopup(wrapper) {
  getPopupEdit(wrapper).vm.show()
  await settle()
}

async function hidePopup(wrapper) {
  getPopupEdit(wrapper).vm.hide()
  await settle()
}

/**
 * The anchor becomes a real fixed-positioned 100x50 box at (100, 100),
 * which means:
 *   top: 100, center: 125, bottom: 150
 *   left: 100, middle: 150, right: 200
 */
function setAnchorRect(wrapper) {
  Object.assign(getAnchor(wrapper).element.style, {
    position: 'fixed',
    top: '100px',
    left: '100px',
    width: '100px',
    height: '50px'
  })
}

/**
 * Mounts a popup with deterministic real geometry: the anchor is the box
 * described above and the popup a real 50x20 box (its own padding gets
 * turned off through the style attr, which falls through to the underlying
 * QMenu element, so the slot content alone defines its size). The position
 * engine measures everything through the actual layout engine; everything
 * sits far from the viewport edges, so nothing gets clamped.
 */
async function mountPositionedPopupEdit(props) {
  const wrapper = mountPopupEdit({ style: 'padding: 0', ...props }, () =>
    h('div', { style: { width: '50px', height: '20px' } })
  )
  setAnchorRect(wrapper)

  await showPopup(wrapper)

  return wrapper
}

describe('[QPopupEdit API]', () => {
  describe('[Props]', () => {
    describe('[(prop)model-value]', () => {
      test('type Any has effect', async () => {
        const propVal = { deep: ['value'] }
        const wrapper = mountPopupEdit({ modelValue: propVal })

        await showPopup(wrapper)

        // the scope starts off as a clone of the model
        expect(lastScope.initialValue).toStrictEqual(propVal)
        expect(lastScope.value).toStrictEqual(propVal)
        expect(lastScope.value).not.toBe(propVal)
      })
    })

    describe('[(prop)title]', () => {
      test('type String has effect', async () => {
        const propVal = 'Calories'
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        expect(getPopup().querySelector('.q-dialog__title')).toBeNull()

        await wrapper.setProps({
          editProps: { modelValue: 'any-value', title: propVal }
        })

        expect(getPopup().querySelector('.q-dialog__title').textContent).toBe(
          propVal
        )
      })
    })

    describe('[(prop)buttons]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ buttons: true })

        await showPopup(wrapper)

        const buttons = getButtons()
        expect(buttons).toHaveLength(2)

        lastScope.value = 'new-value'
        await flushPromises()

        // the second one is the "set" button
        buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await settle()

        expect(getPopupEdit(wrapper).emitted('save')).toStrictEqual([
          ['new-value', 'any-value']
        ])
        expect(getPopup()).toBeNull()
      })

      test('has no buttons without it', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        expect(getButtons()).toHaveLength(0)
      })
    })

    describe('[(prop)label-set]', () => {
      test('type String has effect', async () => {
        const propVal = 'OK'
        const wrapper = mountPopupEdit({ buttons: true })

        await showPopup(wrapper)

        expect(getButtons()[1].textContent).toBe('Set')

        await wrapper.setProps({
          editProps: {
            modelValue: 'any-value',
            buttons: true,
            labelSet: propVal
          }
        })

        expect(getButtons()[1].textContent).toBe(propVal)
      })
    })

    describe('[(prop)label-cancel]', () => {
      test('type String has effect', async () => {
        const propVal = 'Nope'
        const wrapper = mountPopupEdit({ buttons: true })

        await showPopup(wrapper)

        expect(getButtons()[0].textContent).toBe('Cancel')

        await wrapper.setProps({
          editProps: {
            modelValue: 'any-value',
            buttons: true,
            labelCancel: propVal
          }
        })

        expect(getButtons()[0].textContent).toBe(propVal)
      })
    })

    describe('[(prop)auto-save]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ autoSave: true })

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        // closing without an explicit "set" keeps the new value
        await hidePopup(wrapper)

        const popupEdit = getPopupEdit(wrapper)
        expect(popupEdit.emitted('save')).toStrictEqual([
          ['new-value', 'any-value']
        ])
        expect(popupEdit.emitted('update:modelValue')).toStrictEqual([
          ['new-value']
        ])
        expect(popupEdit.emitted('cancel')).toBeUndefined()
      })

      test('discards the changes without it', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        await hidePopup(wrapper)

        const popupEdit = getPopupEdit(wrapper)
        expect(popupEdit.emitted('save')).toBeUndefined()
        expect(popupEdit.emitted('cancel')).toStrictEqual([
          ['new-value', 'any-value']
        ])
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'accent'
        const wrapper = mountPopupEdit({ buttons: true })

        await showPopup(wrapper)

        // it defaults to "primary"
        expect(getButtons()[0].classList).toContain('text-primary')

        await wrapper.setProps({
          editProps: { modelValue: 'any-value', buttons: true, color: propVal }
        })

        expect(
          getButtons().every(btn => btn.classList.contains(`text-${propVal}`))
        ).toBe(true)
      })
    })

    describe('[(prop)validate]', () => {
      test('type Function has effect', async () => {
        const propVal = value => value !== 'bad-value'
        const wrapper = mountPopupEdit({ validate: propVal })

        await showPopup(wrapper)

        lastScope.value = 'bad-value'
        await flushPromises()

        getPopupEdit(wrapper).vm.set()
        await settle()

        // an invalid value neither saves nor closes
        expect(getPopupEdit(wrapper).emitted('save')).toBeUndefined()
        expect(getPopup()).not.toBeNull()

        lastScope.value = 'good-value'
        await flushPromises()

        getPopupEdit(wrapper).vm.set()
        await settle()

        expect(getPopupEdit(wrapper).emitted('save')).toStrictEqual([
          ['good-value', 'any-value']
        ])
        expect(getPopup()).toBeNull()
      })

      test('is handed over to the default slot', async () => {
        const propVal = () => true
        const wrapper = mountPopupEdit({ validate: propVal })

        await showPopup(wrapper)

        expect(lastScope.validate).toBe(propVal)
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ disable: true })

        await getAnchor(wrapper).trigger('click')
        await settle()

        // nothing is rendered at all, so there is nothing to open
        expect(getPopup()).toBeNull()

        await showPopup(wrapper)

        expect(getPopup()).toBeNull()
      })
    })

    describe('[(prop)fit]', () => {
      test('type Boolean has effect', async () => {
        await mountPositionedPopupEdit({ cover: false, fit: true })

        // the popup is never narrower than its anchor
        const rect = getPopup().getBoundingClientRect()
        expect(rect.width).toBe(100)
        expect(rect.height).toBe(20)
      })
    })

    describe('[(prop)cover]', () => {
      test('type Boolean has effect', async () => {
        // it covers the anchor by default
        const wrapper = await mountPositionedPopupEdit()

        let rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(100)
        expect(rect.left).toBe(100)
        expect(rect.width).toBe(100)
        expect(rect.height).toBe(50)

        await hidePopup(wrapper)
        await wrapper.setProps({
          editProps: { modelValue: 'any-value', cover: false }
        })
        await showPopup(wrapper)

        // without it, the popup hangs below the anchor,
        // no longer sized to it
        rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(150)
        expect(rect.left).toBe(100)
        expect(rect.width).toBeLessThan(100)
      })
    })

    describe('[(prop)anchor]', () => {
      const anchorPositionList = [
        ['top left', '100px', '100px'],
        ['top middle', '100px', '150px'],
        ['top right', '100px', '200px'],
        ['top start', '100px', '100px'],
        ['top end', '100px', '200px'],
        ['center left', '125px', '100px'],
        ['center middle', '125px', '150px'],
        ['center right', '125px', '200px'],
        ['center start', '125px', '100px'],
        ['center end', '125px', '200px'],
        ['bottom left', '150px', '100px'],
        ['bottom middle', '150px', '150px'],
        ['bottom right', '150px', '200px'],
        ['bottom start', '150px', '100px'],
        ['bottom end', '150px', '200px']
      ]

      /**
       * The popup (50x20) attaches its own "top start" corner
       * to the requested anchor point.
       */
      async function testAnchor(propVal) {
        const [, top, left] = anchorPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedPopupEdit({ cover: false, anchor: propVal })

        const rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(Number.parseInt(top, 10))
        expect(rect.left).toBe(Number.parseInt(left, 10))
      }

      test('value "top left" has effect', async () => {
        await testAnchor('top left')
      })

      test('value "top middle" has effect', async () => {
        await testAnchor('top middle')
      })

      test('value "top right" has effect', async () => {
        await testAnchor('top right')
      })

      test('value "top start" has effect', async () => {
        await testAnchor('top start')
      })

      test('value "top end" has effect', async () => {
        await testAnchor('top end')
      })

      test('value "center left" has effect', async () => {
        await testAnchor('center left')
      })

      test('value "center middle" has effect', async () => {
        await testAnchor('center middle')
      })

      test('value "center right" has effect', async () => {
        await testAnchor('center right')
      })

      test('value "center start" has effect', async () => {
        await testAnchor('center start')
      })

      test('value "center end" has effect', async () => {
        await testAnchor('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testAnchor('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testAnchor('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testAnchor('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testAnchor('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testAnchor('bottom end')
      })
    })

    describe('[(prop)self]', () => {
      const selfPositionList = [
        ['top left', '150px', '100px'],
        ['top middle', '150px', '75px'],
        ['top right', '150px', '50px'],
        ['top start', '150px', '100px'],
        ['top end', '150px', '50px'],
        ['center left', '140px', '100px'],
        ['center middle', '140px', '75px'],
        ['center right', '140px', '50px'],
        ['center start', '140px', '100px'],
        ['center end', '140px', '50px'],
        ['bottom left', '130px', '100px'],
        ['bottom middle', '130px', '75px'],
        ['bottom right', '130px', '50px'],
        ['bottom start', '130px', '100px'],
        ['bottom end', '130px', '50px']
      ]

      /**
       * The requested corner of the popup (50x20) gets attached
       * to the default "bottom start" point of the anchor.
       */
      async function testSelf(propVal) {
        const [, top, left] = selfPositionList.find(
          ([value]) => value === propVal
        )

        await mountPositionedPopupEdit({ cover: false, self: propVal })

        const rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(Number.parseInt(top, 10))
        expect(rect.left).toBe(Number.parseInt(left, 10))
      }

      test('value "top left" has effect', async () => {
        await testSelf('top left')
      })

      test('value "top middle" has effect', async () => {
        await testSelf('top middle')
      })

      test('value "top right" has effect', async () => {
        await testSelf('top right')
      })

      test('value "top start" has effect', async () => {
        await testSelf('top start')
      })

      test('value "top end" has effect', async () => {
        await testSelf('top end')
      })

      test('value "center left" has effect', async () => {
        await testSelf('center left')
      })

      test('value "center middle" has effect', async () => {
        await testSelf('center middle')
      })

      test('value "center right" has effect', async () => {
        await testSelf('center right')
      })

      test('value "center start" has effect', async () => {
        await testSelf('center start')
      })

      test('value "center end" has effect', async () => {
        await testSelf('center end')
      })

      test('value "bottom left" has effect', async () => {
        await testSelf('bottom left')
      })

      test('value "bottom middle" has effect', async () => {
        await testSelf('bottom middle')
      })

      test('value "bottom right" has effect', async () => {
        await testSelf('bottom right')
      })

      test('value "bottom start" has effect', async () => {
        await testSelf('bottom start')
      })

      test('value "bottom end" has effect', async () => {
        await testSelf('bottom end')
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', async () => {
        await mountPositionedPopupEdit({ cover: false, offset: [20, 30] })

        // the anchor is inflated by the offset, so the default
        // "bottom start" attaching point moves accordingly
        const rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(180)
        expect(rect.left).toBe(80)
      })
    })

    describe('[(prop)touch-position]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ cover: false, touchPosition: true })
        setAnchorRect(wrapper)

        getPopupEdit(wrapper).vm.show(
          new MouseEvent('click', { clientX: 200, clientY: 300 })
        )
        await settle()

        // the popup latches onto the pointer instead of onto the anchor
        const rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(300)
        expect(rect.left).toBe(200)
      })
    })

    describe('[(prop)persistent]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ persistent: true })

        await showPopup(wrapper)

        window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27 }))
        window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 27 }))
        await settle()

        expect(getPopup()).not.toBeNull()
      })
    })

    describe('[(prop)separate-close-popup]', () => {
      test('type Boolean has effect', async () => {
        // the flag is handed over to the underlying QMenu, which is what
        // decides where the "close popups" chain stops
        const wrapper = mountPopupEdit({ separateClosePopup: true })

        await showPopup(wrapper)

        expect(
          wrapper.findComponent({ name: 'QMenu' }).props('separateClosePopup')
        ).toBe(true)
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mountPopupEdit({ square: true })

        await showPopup(wrapper)

        expect(getPopup().classList).toContain('q-menu--square')

        await wrapper.setProps({ editProps: { modelValue: 'any-value' } })

        expect(getPopup().classList).not.toContain('q-menu--square')
      })
    })

    describe('[(prop)max-height]', () => {
      test('type String has effect', async () => {
        const propVal = '16px'
        await mountPositionedPopupEdit({ cover: false, maxHeight: propVal })

        expect(getPopup().style.maxHeight).toBe(propVal)
      })
    })

    describe('[(prop)max-width]', () => {
      test('type String has effect', async () => {
        const propVal = '16px'
        await mountPositionedPopupEdit({ cover: false, maxWidth: propVal })

        expect(getPopup().style.maxWidth).toBe(propVal)
      })
    })

    describe('[(prop)hover]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ hover: true }, 'hover')).toBe(true)
      })
    })

    describe('[(prop)hover-delay]', () => {
      test('type Number has effect', () => {
        expect(getMenuProp({ hoverDelay: 300 }, 'hoverDelay')).toBe(300)
      })
    })

    describe('[(prop)hover-hide-delay]', () => {
      test('type Number has effect', () => {
        expect(getMenuProp({ hoverHideDelay: 300 }, 'hoverHideDelay')).toBe(300)
      })
    })

    describe('[(prop)transition-show]', () => {
      test('type String has effect', () => {
        expect(getMenuProp({ transitionShow: 'scale' }, 'transitionShow')).toBe(
          'scale'
        )
      })
    })

    describe('[(prop)transition-hide]', () => {
      test('type String has effect', () => {
        expect(getMenuProp({ transitionHide: 'scale' }, 'transitionHide')).toBe(
          'scale'
        )
      })
    })

    describe('[(prop)transition-duration]', () => {
      test('type String has effect', () => {
        expect(
          getMenuProp({ transitionDuration: '500' }, 'transitionDuration')
        ).toBe('500')
      })

      test('type Number has effect', () => {
        expect(
          getMenuProp({ transitionDuration: 500 }, 'transitionDuration')
        ).toBe(500)
      })
    })

    describe('[(prop)target]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ target: false }, 'target')).toBe(false)
      })

      test('type String has effect', () => {
        const target = document.createElement('div')
        target.className = 'my-target'
        document.body.append(target)

        expect(getMenuProp({ target: '.my-target' }, 'target')).toBe(
          '.my-target'
        )

        target.remove()
      })

      test('type Element has effect', () => {
        const target = document.createElement('div')
        document.body.append(target)

        expect(getMenuProp({ target }, 'target')).toBe(target)

        target.remove()
      })
    })

    describe('[(prop)no-parent-event]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ noParentEvent: true }, 'noParentEvent')).toBe(true)
      })
    })

    describe('[(prop)context-menu]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ contextMenu: true }, 'contextMenu')).toBe(true)
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ dark: true }, 'dark')).toBe(true)
      })

      test('type null has effect', () => {
        expect(getMenuProp({ dark: null }, 'dark')).toBeNull()
      })
    })

    describe('[(prop)no-esc-dismiss]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ noEscDismiss: true }, 'noEscDismiss')).toBe(true)
      })
    })

    describe('[(prop)no-route-dismiss]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ noRouteDismiss: true }, 'noRouteDismiss')).toBe(
          true
        )
      })
    })

    describe('[(prop)auto-close]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ autoClose: true }, 'autoClose')).toBe(true)
      })
    })

    describe('[(prop)no-refocus]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ noRefocus: true }, 'noRefocus')).toBe(true)
      })
    })

    describe('[(prop)no-focus]', () => {
      test('type Boolean has effect', () => {
        expect(getMenuProp({ noFocus: true }, 'noFocus')).toBe(true)
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', async () => {
        const slotContent = 'some-slot-content'
        const wrapper = mountPopupEdit({}, () =>
          h('div', { class: 'my-content' }, slotContent)
        )

        await showPopup(wrapper)

        expect(getPopup().querySelector('.my-content').textContent).toBe(
          slotContent
        )

        const slotScope = lastScope

        expect(slotScope).toStrictEqual({
          initialValue: expect.anything(),
          value: expect.anything(),
          validate: expect.any(Function),
          set: expect.any(Function),
          cancel: expect.any(Function),
          updatePosition: expect.any(Function)
        })
      })
    })
  })

  describe('[Events]', () => {
    describe('[(event)update:model-value]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        getPopupEdit(wrapper).vm.set()
        await settle()

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('update:modelValue')
        expect(eventList['update:modelValue']).toHaveLength(1)

        const [value] = eventList['update:modelValue'][0]
        expect(value).toBe('new-value')
      })

      test('is not emitting for an unchanged value', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        getPopupEdit(wrapper).vm.set()
        await settle()

        expect(
          getPopupEdit(wrapper).emitted('update:modelValue')
        ).toBeUndefined()
      })
    })

    describe('[(event)before-show]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        getPopupEdit(wrapper).vm.show()
        await flushPromises()

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeShow')
        expect(eventList.beforeShow).toHaveLength(1)

        expect(eventList.beforeShow[0]).toHaveLength(0)
        // it fires before the popup is done showing
        expect(eventList.show).toBeUndefined()
      })
    })

    describe('[(event)show]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('show')
        expect(eventList.show).toHaveLength(1)

        expect(eventList.show[0]).toHaveLength(0)
      })
    })

    describe('[(event)before-hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        getPopupEdit(wrapper).vm.hide()
        await flushPromises()

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('beforeHide')
        expect(eventList.beforeHide).toHaveLength(1)

        expect(eventList.beforeHide[0]).toHaveLength(0)
        expect(eventList.hide).toBeUndefined()
      })
    })

    describe('[(event)hide]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)
        await hidePopup(wrapper)

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('hide')
        expect(eventList.hide).toHaveLength(1)

        expect(eventList.hide[0]).toHaveLength(0)
      })
    })

    describe('[(event)save]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        getPopupEdit(wrapper).vm.set()
        await settle()

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('save')
        expect(eventList.save).toHaveLength(1)

        const [value, initialValue] = eventList.save[0]
        expect(value).toBe('new-value')
        expect(initialValue).toBe('any-value')
      })
    })

    describe('[(event)cancel]', () => {
      test('is emitting', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        getPopupEdit(wrapper).vm.cancel()
        await settle()

        const eventList = getPopupEdit(wrapper).emitted()
        expect(eventList).toHaveProperty('cancel')
        expect(eventList.cancel).toHaveLength(1)

        const [value, initialValue] = eventList.cancel[0]
        expect(value).toBe('new-value')
        expect(initialValue).toBe('any-value')

        expect(eventList.save).toBeUndefined()
      })
    })

    describe('[(event)escape-key]', () => {
      test('is emitting', () => {
        const onEscapeKey = vi.fn()
        const wrapper = mountPopupEdit({ onEscapeKey })

        getMenu(wrapper).vm.$emit('escapeKey')

        expect(onEscapeKey).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('[Methods]', () => {
    describe('[(method)set]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        expect(getPopupEdit(wrapper).vm.set()).toBeUndefined()
        await settle()

        expect(getPopupEdit(wrapper).emitted('save')).toHaveLength(1)
        expect(getPopup()).toBeNull()
      })
    })

    describe('[(method)cancel]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        lastScope.value = 'new-value'
        await flushPromises()

        expect(getPopupEdit(wrapper).vm.cancel()).toBeUndefined()
        await settle()

        expect(getPopupEdit(wrapper).emitted('cancel')).toHaveLength(1)
        expect(getPopup()).toBeNull()
      })
    })

    describe('[(method)show]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopupEdit()

        expect(
          getPopupEdit(wrapper).vm.show(new Event('click'))
        ).toBeUndefined()
        await settle()

        expect(getPopup()).not.toBeNull()
      })
    })

    describe('[(method)hide]', () => {
      test('should be callable', async () => {
        const wrapper = mountPopupEdit()

        await showPopup(wrapper)

        expect(
          getPopupEdit(wrapper).vm.hide(new Event('click'))
        ).toBeUndefined()
        await settle()

        expect(getPopup()).toBeNull()
      })
    })

    describe('[(method)updatePosition]', () => {
      test('should be callable', async () => {
        const wrapper = await mountPositionedPopupEdit({ cover: false })

        // an anchor move needs no call at all: the browser tracks it
        Object.assign(getAnchor(wrapper).element.style, {
          top: '200px',
          left: '300px'
        })

        let rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(250)
        expect(rect.left).toBe(300)

        // the method stays callable (re-checks the placement decision)
        expect(getPopupEdit(wrapper).vm.updatePosition()).toBeUndefined()
        await settle()

        rect = getPopup().getBoundingClientRect()
        expect(rect.top).toBe(250)
        expect(rect.left).toBe(300)
      })
    })
  })
})
