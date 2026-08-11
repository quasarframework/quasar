import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'

import editorCaret from './editor-caret.js'

const Caret = editorCaret

/**
 * The suite runs in a real browser, so execCommand and the queryCommand*
 * family (which the contenteditable engine behind the caret is built on
 * top of) are exercised for real; passthrough spies merely keep the calls
 * observable.
 */
let execCommand
let queryCommandValue

const nodes = []

beforeEach(() => {
  execCommand = vi.spyOn(document, 'execCommand')
  queryCommandValue = vi.spyOn(document, 'queryCommandValue')
})

afterEach(() => {
  nodes.splice(0).forEach(node => node.remove())
  document.getSelection().removeAllRanges()

  vi.restoreAllMocks()
})

function createEVm(overrides = {}) {
  return {
    props: { modelValue: '<p>Hello</p>' },
    inFullscreen: ref(false),
    isViewingSource: ref(false),
    editLinkUrl: ref(null),
    toggleFullscreen: vi.fn(),
    setContent: vi.fn(),
    ...overrides
  }
}

/** Builds the contenteditable root the caret works against. */
function createCaret({ html = 'Hello world', eVm = createEVm() } = {}) {
  const el = document.createElement('div')

  el.contentEditable = 'true'
  el.innerHTML = html

  document.body.append(el)
  nodes.push(el)

  return { caret: new Caret(el, eVm), el, eVm }
}

/** Places the document selection over (part of) a node. */
function select(node, start = 0, end = null) {
  const sel = document.getSelection()
  const range = document.createRange()

  range.setStart(node, start)
  range.setEnd(
    node,
    end !== null
      ? end
      : node.nodeType === Node.TEXT_NODE
        ? node.textContent.length
        : node.childNodes.length
  )

  sel.removeAllRanges()
  sel.addRange(range)

  return sel
}

describe('[editorCaret API]', () => {
  describe('[Classes]', () => {
    describe('[(class)default]', () => {
      test('can be instantiated', () => {
        const { caret, el, eVm } = createCaret()

        expect(caret).toBeInstanceOf(Caret)
        expect(caret.el).toBe(el)
        expect(caret.eVm).toBe(eVm)
        expect(caret._range).toBeNull()
      })

      test('only reports a selection that lives inside the element', () => {
        const { caret, el } = createCaret()
        const outside = document.createElement('div')

        outside.textContent = 'Elsewhere'
        document.body.append(outside)
        nodes.push(outside)

        expect(caret.selection).toBeNull()

        select(outside.firstChild)
        expect(caret.selection).toBeNull()

        select(el.firstChild)
        expect(caret.selection).toBe(document.getSelection())
      })

      test('has no selection without an element', () => {
        const caret = new Caret(null, createEVm())

        expect(caret.selection).toBeNull()
        expect(caret.hasSelection).toBe(false)
      })

      test.each([
        ['some text is selected', 0, 5, true],
        ['the selection is collapsed', 3, 3, false]
      ])('reports a selection when %s', (_, start, end, expected) => {
        const { caret, el } = createCaret()

        select(el.firstChild, start, end)

        expect(caret.hasSelection).toBe(expected)
      })

      test('falls back to the saved range when nothing is selected', () => {
        const { caret, el } = createCaret()

        expect(caret.range).toBeNull()

        select(el.firstChild, 0, 5)
        const live = caret.range

        expect(live).toBeInstanceOf(Range)

        caret.save()
        document.getSelection().removeAllRanges()

        expect(caret.range).toBe(caret._range)
        expect(caret.range.toString()).toBe('Hello')
      })

      test('keeps the previous range when asked to save nothing', () => {
        const { caret, el } = createCaret()

        select(el.firstChild, 0, 5)
        caret.save()

        const saved = caret._range
        caret.save(null)

        expect(caret._range).toBe(saved)
      })

      test('restores a saved range onto the document selection', () => {
        const { caret, el } = createCaret()

        select(el.firstChild, 0, 5)
        caret.save()
        document.getSelection().removeAllRanges()

        caret.restore()

        expect(document.getSelection().toString()).toBe('Hello')
      })

      test('collapses to the end when there is nothing to restore', () => {
        const { caret } = createCaret()

        caret.restore(null)

        const sel = document.getSelection()

        expect(sel.isCollapsed).toBe(true)
        expect(sel.rangeCount).toBe(1)
      })

      test.each([
        ['a text node', el => el.firstChild],
        ['an element node', el => el]
      ])('resolves the parent element out of %s', (_, getNode) => {
        const { caret, el } = createCaret()

        select(getNode(el), 0, 0)

        expect(caret.parent).toBe(el)
      })

      test('has no parent without a range', () => {
        const { caret } = createCaret()

        expect(caret.parent).toBeNull()
        expect(caret.blockParent).toBeNull()
      })

      test.each([
        ['a listed block tag', '<blockquote>Quoted</blockquote>', 'BLOCKQUOTE'],
        ['a computed block display', '<p>Text</p>', 'P']
      ])('walks up to the block parent through %s', (_, html, nodeName) => {
        const { caret, el } = createCaret({ html })

        select(el.firstChild.firstChild, 0, 0)

        expect(caret.blockParent.nodeName).toBe(nodeName)
      })

      test.each([
        ['at span level', true, 'b'],
        ['at block level', false, 'div']
      ])('checks the parent tag %s', (_, spanLevel, expected) => {
        const { caret, el } = createCaret({ html: '<b>bold</b>' })

        select(el.firstChild.firstChild, 0, 0)

        expect(caret.hasParent(expected, spanLevel)).toBe(true)
        expect(caret.hasParent('h1', spanLevel)).toBe(false)
      })

      test('is case insensitive about the parent tag', () => {
        const { caret, el } = createCaret({ html: '<b>bold</b>' })

        select(el.firstChild.firstChild, 0, 0)

        expect(caret.hasParent('B', true)).toBe(true)
      })

      test.each([
        ['a direct match', ['b'], false, true],
        ['no match at all', ['h1'], false, false],
        ['an ancestor match while recursing', ['div'], true, true],
        ['an ancestor match without recursing', ['div'], false, false]
      ])(
        'looks for a list of parents with %s',
        (_, list, recursive, expected) => {
          const { caret, el } = createCaret({ html: '<b>bold</b>' })

          select(el.firstChild.firstChild, 0, 0)

          expect(caret.hasParents(list, recursive)).toBe(expected)
        }
      )

      test('finds no parents without a selection', () => {
        const { caret } = createCaret()

        expect(caret.hasParents(['div'], true)).toBe(false)
      })

      test('reads an attribute off the parent', () => {
        const { caret, el } = createCaret({
          html: '<a href="https://quasar.dev">link</a>'
        })

        expect(caret.getParentAttribute('href')).toBeNull()

        select(el.firstChild.firstChild, 0, 0)

        expect(caret.getParentAttribute('href')).toBe('https://quasar.dev')
        expect(caret.getParentAttribute('target')).toBeNull()
      })

      test('answers nothing about a command without a selection', () => {
        const { caret } = createCaret()

        expect(caret.is('bold')).toBe(false)
      })

      test.each([
        ['the root itself', '', 'DIV', true],
        ['a nested block', '<blockquote>Quoted</blockquote>', 'DIV', false],
        [
          'the matching block',
          '<blockquote>Quoted</blockquote>',
          'BLOCKQUOTE',
          true
        ]
      ])('resolves formatBlock against %s', (_, html, param, expected) => {
        const { caret, el } = createCaret({ html: html || 'Hello' })

        select(
          html === '' ? el : el.firstChild.firstChild,
          0,
          html === '' ? 0 : 0
        )

        expect(caret.is('formatBlock', param)).toBe(expected)
      })

      test('resolves link through the closest anchor', () => {
        const { caret, el } = createCaret({ html: '<a href="#">link</a>' })

        select(el.firstChild.firstChild, 0, 0)

        expect(caret.is('link')).toBe(true)
      })

      test('resolves fontSize through the queried value', () => {
        const { caret, el } = createCaret({
          html: '<font size="4">Hello</font>'
        })

        select(el.firstChild.firstChild, 0, 1)

        expect(caret.is('fontSize', '4')).toBe(true)
        expect(caret.is('fontSize', '5')).toBe(false)
        expect(queryCommandValue).toHaveBeenCalledWith('fontSize')
      })

      test.each([
        // the browser quotes a multi-word family name, a single-word one
        // stays bare, which drives both shapes the caret has to accept
        ['a quoted value', 'Comic Sans MS'],
        ['a bare value', 'Arial']
      ])('resolves fontName through %s', (_, value) => {
        const { caret, el } = createCaret({
          html: `<font face="${value}">Hello</font>`
        })

        select(el.firstChild.firstChild, 0, 1)

        expect(caret.is('fontName', value)).toBe(true)
        expect(caret.is('fontName', 'Georgia')).toBe(false)
      })

      test.each([
        ['fullscreen', 'inFullscreen'],
        ['viewsource', 'isViewingSource']
      ])('resolves %s off the editor state', (cmd, key) => {
        const eVm = createEVm()
        const { caret, el } = createCaret({ eVm })

        select(el.firstChild, 0, 1)

        expect(caret.is(cmd)).toBe(false)

        eVm[key].value = true

        expect(caret.is(cmd)).toBe(true)
      })

      test('resolves an unnamed command as false', () => {
        const { caret, el } = createCaret()

        select(el.firstChild, 0, 1)

        expect(caret.is(void 0)).toBe(false)
      })

      test.each([
        ['without an expected value', void 0, true, true],
        ['against a matching value', false, false, true],
        ['against a differing value', true, false, false]
      ])('resolves any other command %s', (_, param, state, expected) => {
        // bold content drives the real queryCommandState to the wanted state
        const { caret, el } = createCaret({
          html: state ? '<b>bold</b>' : 'Hello world'
        })

        select(state ? el.firstChild.firstChild : el.firstChild, 0, 1)

        expect(caret.is('bold', param)).toBe(expected)
      })

      test.each([
        [
          'outdent inside a blockquote',
          'outdent',
          '<blockquote>Q</blockquote>',
          true
        ],
        [
          'outdent inside a list item',
          'outdent',
          '<ul><li>Item</li></ul>',
          true
        ],
        ['outdent outside of both', 'outdent', '<p>Text</p>', false],
        ['indent inside a list item', 'indent', '<ul><li>Item</li></ul>', true],
        ['indent outside a list', 'indent', '<blockquote>Q</blockquote>', false]
      ])('tells whether it can %s', (_, name, html, expected) => {
        const { caret, el } = createCaret({ html })

        select(el.querySelector('li, blockquote, p').firstChild, 0, 0)

        expect(caret.can(name)).toBe(expected)
      })

      test('can link whenever there is a selection', () => {
        const { caret, el } = createCaret()

        expect(caret.can('link')).toBe(false)

        select(el.firstChild, 0, 1)

        expect(caret.can('link')).toBe(true)
      })

      test('says nothing about an unknown ability', () => {
        const { caret } = createCaret()

        expect(caret.can('whatever')).toBeUndefined()
      })

      test('applies a plain command and reports back', () => {
        const { caret, el } = createCaret()
        const done = vi.fn()

        select(el.firstChild, 0, 5)
        caret.apply('bold', void 0, done)

        expect(execCommand).toHaveBeenCalledExactlyOnceWith(
          'bold',
          false,
          void 0
        )
        expect(done).toHaveBeenCalledOnce()
        // the command really ran against the selection
        expect(el.innerHTML).toBe('<b>Hello</b> world')
      })

      test.each([
        ['H1', 'outdent', null, '<h1>Hello</h1>'],
        ['BLOCKQUOTE', 'outdent', null, '<blockquote>Hello</blockquote>'],
        ['PRE', 'formatBlock', 'P', '<pre>Hello</pre>']
      ])(
        'toggles formatBlock %s off when already applied',
        (param, cmd, arg, html) => {
          // the content already carries the block, so is() resolves for real
          const { caret, el } = createCaret({ html })
          const is = vi.spyOn(caret, 'is')

          select(el.firstChild.firstChild, 0, 1)
          caret.apply('formatBlock', param)

          expect(execCommand).toHaveBeenCalledExactlyOnceWith(cmd, false, arg)
          expect(is).toHaveBeenCalled()
        }
      )

      test('leaves formatBlock alone when it is not applied yet', () => {
        const { caret, el } = createCaret()

        select(el.firstChild, 0, 1)
        caret.apply('formatBlock', 'H1')

        expect(execCommand).toHaveBeenCalledExactlyOnceWith(
          'formatBlock',
          false,
          'H1'
        )
      })

      test('prints the content in a separate window', () => {
        // window.open stays mocked: a real popup plus its blocking print
        // dialog cannot be driven from a headless test
        const { caret } = createCaret({ html: '<p>Printed</p>' })
        const done = vi.fn()
        const win = {
          document: { write: vi.fn() },
          print: vi.fn(),
          close: vi.fn()
        }
        const open = vi.spyOn(window, 'open').mockReturnValue(win)

        caret.apply('print', void 0, done)

        expect(done).toHaveBeenCalledOnce()
        expect(open).toHaveBeenCalledOnce()
        expect(win.document.write.mock.calls[0][0]).toContain('<p>Printed</p>')
        expect(win.print).toHaveBeenCalledOnce()
        expect(win.close).toHaveBeenCalledOnce()
        expect(execCommand).not.toHaveBeenCalled()
      })

      test('delegates fullscreen to the editor', () => {
        const eVm = createEVm()
        const { caret } = createCaret({ eVm })
        const done = vi.fn()

        caret.apply('fullscreen', void 0, done)

        expect(eVm.toggleFullscreen).toHaveBeenCalledOnce()
        expect(done).toHaveBeenCalledOnce()
        expect(execCommand).not.toHaveBeenCalled()
      })

      test('toggles the source view and re-applies the model', () => {
        const eVm = createEVm()
        const { caret } = createCaret({ eVm })
        const done = vi.fn()

        caret.apply('viewsource', void 0, done)

        expect(eVm.isViewingSource.value).toBe(true)
        expect(eVm.setContent).toHaveBeenCalledExactlyOnceWith(
          eVm.props.modelValue
        )
        expect(done).toHaveBeenCalledOnce()
        expect(execCommand).not.toHaveBeenCalled()
      })

      test('picks up an existing link for editing', () => {
        const eVm = createEVm()
        const { caret, el } = createCaret({
          html: '<a href="https://quasar.dev">link</a>',
          eVm
        })

        select(el.firstChild.firstChild, 0, 1)
        caret.apply('link')

        expect(eVm.editLinkUrl.value).toBe('https://quasar.dev')
        expect(caret._range).not.toBeNull()
        expect(execCommand).not.toHaveBeenCalled()
      })

      test.each([
        ['a plain word', 'Hello world', 'https://'],
        ['an URL', 'https://quasar.dev is nice', 'https://quasar.dev']
      ])('creates a link out of the selected %s', (_, html, expected) => {
        const eVm = createEVm()
        const { caret, el } = createCaret({ html, eVm })

        // a non-collapsed selection is taken as-is, no word expansion needed
        select(el.firstChild, 0, html.indexOf(' '))
        caret.apply('link')

        expect(eVm.editLinkUrl.value).toBe(expected)
        expect(execCommand).toHaveBeenCalledExactlyOnceWith(
          'createLink',
          false,
          expected
        )
        // the anchor was really created around the selection
        expect(el.querySelector('a')?.getAttribute('href')).toBe(expected)
      })

      test('refuses to link an empty selection without an image', () => {
        const eVm = createEVm()
        const { caret, el } = createCaret({ eVm })

        select(el.firstChild, 2, 2)
        // selectWord is pinned to the collapsed selection: a real word
        // expansion would grab the surrounding word and defeat the case
        vi.spyOn(caret, 'selectWord').mockImplementation(sel => sel)

        caret.apply('link')

        expect(eVm.editLinkUrl.value).toBeNull()
        expect(execCommand).not.toHaveBeenCalled()
      })

      test.each([
        ['null', null],
        ['a non-collapsed selection', { isCollapsed: false }]
      ])('leaves %s alone while selecting a word', (_, sel) => {
        const { caret } = createCaret()

        expect(caret.selectWord(sel)).toBe(sel)
      })

      test.each([
        ['forwards', false, ['forward', 'backward']],
        ['backwards', true, ['backward', 'forward']]
      ])(
        'expands a collapsed selection %s',
        (_, backwards, [first, second]) => {
          const { caret, el } = createCaret()
          const node = el.firstChild
          const anchorOffset = backwards ? 5 : 2
          const focusOffset = backwards ? 2 : 5
          // a synthetic selection: a real collapsed Selection always has
          // anchor === focus, so the backwards branch is unreachable through
          // the document selection, and the exact modify() sequence is the
          // observable contract here
          const sel = {
            isCollapsed: true,
            anchorNode: node,
            anchorOffset,
            focusNode: node,
            focusOffset,
            collapse: vi.fn(),
            modify: vi.fn(),
            extend: vi.fn()
          }

          expect(caret.selectWord(sel)).toBe(sel)

          expect(sel.collapse).toHaveBeenCalledExactlyOnceWith(
            node,
            anchorOffset
          )
          expect(sel.extend).toHaveBeenCalledExactlyOnceWith(node, focusOffset)
          expect(sel.modify.mock.calls).toStrictEqual([
            ['move', first, 'character'],
            ['move', second, 'word'],
            ['extend', second, 'character'],
            ['extend', first, 'word']
          ])
        }
      )

      test('remembers the caret position across a content update', () => {
        const { caret, el } = createCaret({ html: 'Hello world' })

        select(el.firstChild, 5, 5)
        caret.savePosition()

        expect(caret.savedPos).toBe(5)

        document.getSelection().removeAllRanges()
        caret.restorePosition(el.textContent.length)

        const sel = document.getSelection()

        expect(sel.rangeCount).toBe(1)
        expect(sel.isCollapsed).toBe(true)
      })

      test('counts the text of the preceding siblings', () => {
        const { caret, el } = createCaret({
          html: '<i>12345</i><b>bold</b>'
        })

        select(el.querySelector('b').firstChild, 2, 2)
        caret.savePosition()

        // 2 inside <b> plus the 5 characters of the <i> before it
        expect(caret.savedPos).toBe(7)
      })

      test('has no position to save outside of the element', () => {
        // the lookup is done against the parent of the element, so the
        // "outside" node has to live outside of that parent too
        const container = document.createElement('div')
        const el = document.createElement('div')
        const outside = document.createElement('div')

        el.textContent = 'Hello world'
        container.append(el)
        outside.textContent = 'Elsewhere'
        document.body.append(container, outside)
        nodes.push(container, outside)

        const caret = new Caret(el, createEVm())

        select(outside.firstChild, 0, 0)
        caret.savePosition()

        expect(caret.savedPos).toBe(-1)
      })

      test.each([
        ['the position was never saved', -1, 10],
        ['the position is at the very start', 0, 10],
        ['the content got shorter', 8, 5]
      ])('does not restore a position when %s', (_, savedPos, length) => {
        const { caret } = createCaret()

        caret.savedPos = savedPos
        caret.restorePosition(length)

        expect(document.getSelection().rangeCount).toBe(0)
      })
    })
  })
})
