import Platform from '../plugins/Platform.js'

export function clearSelection () {
  if (window.getSelection !== void 0) {
    const selection = window.getSelection()
    if (selection.empty !== void 0) {
      selection.empty()
    }
    else if (selection.removeAllRanges !== void 0) {
      selection.removeAllRanges()
      Platform.is.mobile !== true && selection.addRange(document.createRange())
    }
  }
  else if (document.selection !== void 0) {
    document.selection.empty()
  }
}
