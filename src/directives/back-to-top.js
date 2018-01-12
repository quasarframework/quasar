import { debounce } from '../utils/debounce'
import { getScrollPosition, setScrollPosition, getScrollTarget } from '../utils/scroll'

function updateBinding (el, { value, modifiers }) {
  const ctx = el.__qbacktotop

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
  name: 'back-to-top',
  bind (el) {
    let ctx = {
      offset: 200,
      duration: 300,
      update: debounce(() => {
        const trigger = getScrollPosition(ctx.scrollTarget) > ctx.offset
        if (ctx.visible !== trigger) {
          ctx.visible = trigger
          el.classList[trigger ? 'remove' : 'add']('hidden')
        }
      }, 25),
      goToTop () {
        setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0)
      }
    }
    el.classList.add('hidden')
    el.__qbacktotop = ctx
  },
  inserted (el, binding) {
    let ctx = el.__qbacktotop
    ctx.scrollTarget = getScrollTarget(el)
    ctx.animate = binding.modifiers.animate
    updateBinding(el, binding)
    ctx.scrollTarget.addEventListener('scroll', ctx.update)
    window.addEventListener('resize', ctx.update)
    el.addEventListener('click', ctx.goToTop)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding)
    }
  },
  unbind (el) {
    let ctx = el.__qbacktotop
    ctx.scrollTarget.removeEventListener('scroll', ctx.update)
    window.removeEventListener('resize', ctx.update)
    el.removeEventListener('click', ctx.goToTop)
    delete el.__qbacktotop
  }
}
