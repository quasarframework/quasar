import { debounce } from '../utils/debounce'
import { add, get, remove } from '../utils/store'
import { getScrollPosition, setScrollPosition, getScrollTarget } from '../utils/scroll'

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
    add('backtotop', el, ctx)
  },
  inserted (el, binding) {
    let ctx = get('backtotop', el)
    ctx.scrollTarget = getScrollTarget(el)
    ctx.animate = binding.modifiers.animate
    updateBinding(el, binding, ctx)
    ctx.scrollTarget.addEventListener('scroll', ctx.update)
    window.addEventListener('resize', ctx.update)
    el.addEventListener('click', ctx.goToTop)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding, get('backtotop', el))
    }
  },
  unbind (el) {
    let ctx = get('backtotop', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.update)
    window.removeEventListener('resize', ctx.update)
    el.removeEventListener('click', ctx.goToTop)
    remove('backtotop', el)
  }
}
