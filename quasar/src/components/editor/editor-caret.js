function getBlockElement (el, parent) {
  if (parent && el === parent) {
    return null
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

function isChildOf (el, parent) {
  if (!el) {
    return false
  }
  while ((el = el.parentNode)) {
    if (el === document.body) {
      return false
    }
    if (el === parent) {
      return true
    }
  }
  return false
}

const urlRegex = /^https?:\/\//

export class Caret {
  constructor (el, vm) {
    this.el = el
    this.vm = vm
  }

  get selection () {
    if (!this.el) {
      return
    }
    const sel = document.getSelection()
    // only when the selection in element
    if (isChildOf(sel.anchorNode, this.el) && isChildOf(sel.focusNode, this.el)) {
      return sel
    }
  }

  get hasSelection () {
    return this.selection
      ? this.selection.toString().length > 0
      : null
  }

  get range () {
    const sel = this.selection

    if (!sel) {
      return
    }

    return sel.rangeCount
      ? sel.getRangeAt(0)
      : null
  }

  get parent () {
    const range = this.range
    if (!range) {
      return
    }

    const node = range.startContainer
    return node.nodeType === document.ELEMENT_NODE
      ? node
      : node.parentNode
  }

  get blockParent () {
    const parent = this.parent
    if (!parent) {
      return
    }
    return getBlockElement(parent, this.el)
  }

  save (range = this.range) {
    this._range = range
  }

  restore (range = this._range) {
    const
      r = document.createRange(),
      sel = document.getSelection()

    if (range) {
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

  hasParent (name, spanLevel) {
    const el = spanLevel
      ? this.parent
      : this.blockParent

    return el
      ? el.nodeName.toLowerCase() === name.toLowerCase()
      : false
  }

  hasParents (list) {
    const el = this.parent
    return el
      ? list.includes(el.nodeName.toLowerCase())
      : false
  }

  is (cmd, param) {
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
      case void 0:
        return false
      default:
        const state = document.queryCommandState(cmd)
        return param ? state === param : state
    }
  }

  getParentAttribute (attrib) {
    if (this.parent) {
      return this.parent.getAttribute(attrib)
    }
  }

  can (name) {
    if (name === 'outdent') {
      return this.hasParents(['blockquote', 'li'])
    }
    if (name === 'indent') {
      const parentName = this.parent ? this.parent.nodeName.toLowerCase() : false
      if (parentName === 'blockquote') {
        return false
      }
      if (parentName === 'li') {
        const previousEl = this.parent.previousSibling
        return previousEl && previousEl.nodeName.toLowerCase() === 'li'
      }
      return false
    }
  }

  apply (cmd, param, done = () => {}) {
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
      if (!link) {
        const selection = this.selectWord(this.selection)
        const url = selection ? selection.toString() : ''
        if (!url.length) {
          return
        }
        this.vm.editLinkUrl = urlRegex.test(url) ? url : ''
        document.execCommand('createLink', false, this.vm.editLinkUrl === '' ? ' ' : this.vm.editLinkUrl)
      }
      else {
        this.vm.editLinkUrl = link
      }
      this.range.selectNodeContents(this.parent)
      this.save()
      return
    }
    else if (cmd === 'fullscreen') {
      this.vm.toggleFullscreen()
      done()
      return
    }

    document.execCommand(cmd, false, param)
    done()
  }

  selectWord (sel) {
    if (!sel.isCollapsed) {
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
