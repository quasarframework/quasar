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

export class Caret {
  constructor (el) {
    this.el = el
  }

  get selection () {
    var sel = document.getSelection()
    if (!this.el) {
      return sel
    }
    // only when the selection in element
    if (isChildOf(sel.anchorNode, this.el) && isChildOf(sel.focusNode, this.el)) {
      return sel
    }
  }

  get range () {
    const sel = this.selection

    if (!sel) {
      return null
    }

    return sel.rangeCount
      ? sel.getRangeAt(0)
      : null
  }

  get parent () {
    const range = this.range
    if (!range) {
      return null
    }

    const node = range.startContainer
    return node.nodeType === document.ELEMENT_NODE
      ? node
      : node.parentNode
  }

  get blockParent () {
    const parent = this.parent
    if (!parent) {
      return null
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
      sel.selectAllChildren(this.element)
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

  is (name) {
    if (['BLOCKQUOTE', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'IMG'].includes(name)) {
      console.log('HIIIT')
      return this.hasParent(name)
    }
    return document.queryCommandState(name)
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

  apply (cmd, param) {
    if (cmd === 'formatBlock' && ['BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'IMG'].includes(param)) {
      if (this.is(param)) {
        this.apply('outdent')
        return
      }
    }
    document.execCommand(cmd, false, param)
  }
}
