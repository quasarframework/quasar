export default function (onInput) {
  return function onComposition (e) {
    if (e.type === 'compositionend' || e.type === 'change') {
      if (e.target.qComposing !== true) return
      e.target.qComposing = false
      onInput(e)
    }
    else if (e.type === 'compositionstart') {
      e.target.qComposing = true
    }
  }
}
