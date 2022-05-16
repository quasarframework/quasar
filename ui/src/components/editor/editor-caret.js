import { noop } from '../../utils/event.js'

function getBlockElement (el, parent) {
  if (parent && el === parent) {
    return null
  }

  const nodeName = el.nodeName.toLowerCase()

  if (['div', 'li', 'ul', 'ol', 'blockquote'].includes(nodeName) === true) {
    return el
  }

  const
    style = window.getComputedStyle
      ? window.getComputedStyle(el)
      : el.currentStyle,
    display = style.display

  if (display === 'block' || display === 'table') {
    return el
  }

  return getBlockElement(el.parentNode)
}

function isChildOf (el, parent, orSame) {
  return !el || el === document.body
    ? false
    : (orSame === true && el === parent) || (parent === document ? document.body : parent).contains(el.parentNode)
}

function createRange (node, chars, range) {
  if (!range) {
    range = document.createRange()
    range.selectNode(node)
    range.setStart(node, 0)
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count)
  }
  else if (chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length
      }
      else {
        range.setEnd(node, chars.count)
        chars.count = 0
      }
    }
    else {
      for (let lp = 0; chars.count !== 0 && lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range)
      }
    }
  }

  return range
}

const urlRegex = /^https?:\/\//

export class Caret {
  constructor (el, vm) {
    this.el = el
    this.vm = vm
    this._range = null
  }

  get selection () {
    if (this.el) {
      const sel = document.getSelection()

      // only when the selection in element
      if (isChildOf(sel.anchorNode, this.el, true) && isChildOf(sel.focusNode, this.el, true)) {
        return sel
      }
    }

    return null
  }

  get hasSelection () {
    return this.selection !== null
      ? this.selection.toString().length > 0
      : false
  }

  get range () {
    const sel = this.selection

    if (sel !== null && sel.rangeCount) {
      return sel.getRangeAt(0)
    }

    return this._range
  }

  get parent () {
    const range = this.range

    if (range !== null) {
      const node = range.startContainer

      return node.nodeType === document.ELEMENT_NODE
        ? node
        : node.parentNode
    }

    return null
  }

  get blockParent () {
    const parent = this.parent

    if (parent !== null) {
      return getBlockElement(parent, this.el)
    }

    return null
  }

  save (range = this.range) {
    if (range !== null) {
      this._range = range
    }
  }

  restore (range = this._range) {
    const
      r = document.createRange(),
      sel = document.getSelection()

    if (range !== null) {
      r.setStart(range.startContainer, range.startOffset)
      r.setEnd(range.endContainer, range.endOffset)
      sel.removeAllRanges()
      sel.addRange(r)
    }
    else {
      sel.selectAllChildren(this.el)
      sel.collapseToEnd()
    }
  }

  savePosition () {
    let charCount = -1, node
    const
      selection = document.getSelection(),
      parentEl = this.el.parentNode

    if (selection.focusNode && isChildOf(selection.focusNode, parentEl)) {
      node = selection.focusNode
      charCount = selection.focusOffset

      while (node && node !== parentEl) {
        if (node !== this.el && node.previousSibling) {
          node = node.previousSibling
          charCount += node.textContent.length
        }
        else {
          node = node.parentNode
        }
      }
    }

    this.savedPos = charCount
  }

  restorePosition (length = 0) {
    if (this.savedPos > 0 && this.savedPos < length) {
      const
        selection = window.getSelection(),
        range = createRange(this.el, { count: this.savedPos })

      if (range) {
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  hasParent (name, spanLevel) {
    const el = spanLevel
      ? this.parent
      : this.blockParent

    return el !== null
      ? el.nodeName.toLowerCase() === name.toLowerCase()
      : false
  }

  hasParents (list, recursive, el = this.parent) {
    if (el === null) {
      return false
    }

    if (list.includes(el.nodeName.toLowerCase()) === true) {
      return true
    }

    return recursive === true
      ? this.hasParents(list, recursive, el.parentNode)
      : false
  }

  is (cmd, param) {
    if (this.selection === null) {
      return false
    }

    switch (cmd) {
      case 'formatBlock':
        if (param === 'DIV' && this.parent === this.el) {
          return true
        }
        return this.hasParent(param, param === 'PRE')
      case 'link':
        return this.hasParent('A', true)
      case 'fontSize':
        return document.queryCommandValue(cmd) === param
      case 'fontName':
        const res = document.queryCommandValue(cmd)
        return res === `"${param}"` || res === param
      case 'fullscreen':
        return this.vm.inFullscreen
      case 'viewsource':
        return this.vm.isViewingSource
      case void 0:
        return false
      default:
        const state = document.queryCommandState(cmd)
        return param !== void 0 ? state === param : state
    }
  }

  getParentAttribute (attrib) {
    if (this.parent !== null) {
      return this.parent.getAttribute(attrib)
    }

    return null
  }

  can (name) {
    if (name === 'outdent') {
      return this.hasParents(['blockquote', 'li'], true)
    }

    if (name === 'indent') {
      return this.hasParents(['li'], true)
    }

    if (name === 'link') {
      return this.selection !== null || this.is('link')
    }
  }

  apply (cmd, param, done = noop) {
    if (cmd === 'formatBlock') {
      if (['BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(param) && this.is(cmd, param)) {
        cmd = 'outdent'
        param = null
      }

      if (param === 'PRE' && this.is(cmd, 'PRE')) {
        param = 'P'
      }
    }
    else if (cmd === 'print') {
      done()

      const win = window.open()

      win.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Print - ${document.title}</title>
          </head>
          <body>
            <div>${this.el.innerHTML}</div>
          </body>
        </html>
      `)
      win.print()
      win.close()

      return
    }
    else if (cmd === 'link') {
      const link = this.getParentAttribute('href')

      if (link === null) {
        const selection = this.selectWord(this.selection)
        const url = selection ? selection.toString() : ''

        if (!url.length) {
          if (!this.range || !this.range.cloneContents().querySelector('img')) {
            return
          }
        }

        this.vm.editLinkUrl = urlRegex.test(url) ? url : 'https://'
        document.execCommand('createLink', false, this.vm.editLinkUrl)

        this.save(selection.getRangeAt(0))
      }
      else {
        this.vm.editLinkUrl = link

        this.range.selectNodeContents(this.parent)
        this.save()
      }

      return
    }
    else if (cmd === 'fullscreen') {
      this.vm.toggleFullscreen()
      done()

      return
    }
    else if (cmd === 'viewsource') {
      this.vm.isViewingSource = this.vm.isViewingSource === false
      this.vm.__setContent(this.vm.value)
      done()

      return
    }

    document.execCommand(cmd, false, param)

    done()
  }

  selectWord (sel) {
    if (sel === null || sel.isCollapsed !== true || /* IE 11 */ sel.modify === void 0) {
      return sel
    }

    // Detect if selection is backwards
    const range = document.createRange()
    range.setStart(sel.anchorNode, sel.anchorOffset)
    range.setEnd(sel.focusNode, sel.focusOffset)
    const direction = range.collapsed ? ['backward', 'forward'] : ['forward', 'backward']
    range.detach()

    // modify() works on the focus of the selection
    const
      endNode = sel.focusNode,
      endOffset = sel.focusOffset
    sel.collapse(sel.anchorNode, sel.anchorOffset)
    sel.modify('move', direction[0], 'character')
    sel.modify('move', direction[1], 'word')
    sel.extend(endNode, endOffset)
    sel.modify('extend', direction[1], 'character')
    sel.modify('extend', direction[0], 'word')

    return sel
  }
}
