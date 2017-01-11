import Utils from '../utils'

function updateBinding (el, { value, modifiers }, ctx) {
  if (!value) {
    ctx.update()
    return
  }

  if (typeof value === 'number') {
    ctx.offset = value
    ctx.update()
    return
  }

  if (value && Object(value) !== value) {
    console.error('v-back-to-top requires an object {offset, duration} as parameter', el)
    return
  }

  if (value.offset) {
    if (typeof value.offset !== 'number') {
      console.error('v-back-to-top requires a number as offset', el)
      return
    }
    ctx.offset = value.offset
  }
  if (value.duration) {
    if (typeof value.duration !== 'number') {
      console.error('v-back-to-top requires a number as duration', el)
      return
    }
    ctx.duration = value.duration
  }

  ctx.update()
}

export default {
  bind (el) {
    let ctx = {
      offset: 200,
      duration: 300,
      update: Utils.debounce(() => {
        const trigger = Utils.dom.getScrollPosition(ctx.scrollTarget) > ctx.offset
        if (ctx.visible !== trigger) {
          ctx.visible = trigger
          el.classList[trigger ? 'remove' : 'add']('hidden')
        }
      }, 25),
      goToTop () {
        Utils.dom.setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0)
      }
    }
    el.classList.add('hidden')
    Utils.store.add('backtotop', el, ctx)
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('backtotop', el)
    ctx.scrollTarget = Utils.dom.getScrollTarget(el)
    ctx.animate = binding.modifiers.animate
    updateBinding(el, binding, ctx)
    ctx.scrollTarget.addEventListener('scroll', ctx.update)
    window.addEventListener('resize', ctx.update)
    el.addEventListener('click', ctx.goToTop)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding, Utils.store.get('backtotop', el))
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('backtotop', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.update)
    window.removeEventListener('resize', ctx.update)
    el.removeEventListener('click', ctx.goToTop)
    Utils.store.remove('backtotop', el)
  }
}
