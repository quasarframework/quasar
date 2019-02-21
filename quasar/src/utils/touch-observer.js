export function setObserver (el, evt, ctx, fn) {
  const target = evt.target
  ctx.touchTargetObserver = new MutationObserver(() => {
    el.contains(target) === false && ctx.end(evt)
  })
  ctx.touchTargetObserver.observe(el, { childList: true, subtree: true })
}

export function removeObserver (ctx) {
  if (ctx.touchTargetObserver !== void 0) {
    ctx.touchTargetObserver.disconnect()
    ctx.touchTargetObserver = void 0
  }
}
