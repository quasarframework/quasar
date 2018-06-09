import { debounce } from '../utils/debounce'
import { getScrollPosition, setScrollPosition, getScrollTarget } from '../utils/scroll'
import { listenOpts } from '../utils/event'

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
    const ctx = {
      offset: 200,
      duration: 300,
      updateNow: () => {
        const trigger = getScrollPosition(ctx.scrollTarget) <= ctx.offset

        if (trigger !== el.classList.contains('hidden')) {
          el.classList[trigger ? 'add' : 'remove']('hidden')
        }
      },
      goToTop () {
        setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0)
      },
      goToTopKey (evt) {
        if (evt.keyCode === 13) {
          setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0)
        }
      }
    }
    ctx.update = debounce(ctx.updateNow, 25)
    el.classList.add('hidden')
    el.__qbacktotop = ctx
  },
  inserted (el, binding) {
    const ctx = el.__qbacktotop
    ctx.scrollTarget = getScrollTarget(el)
    ctx.animate = binding.modifiers.animate
    updateBinding(el, binding)
    ctx.scrollTarget.addEventListener('scroll', ctx.update, listenOpts.passive)
    window.addEventListener('resize', ctx.update, listenOpts.passive)
    el.addEventListener('click', ctx.goToTop)
    el.addEventListener('keyup', ctx.goToTopKey)
  },
  update (el, binding) {
    if (JSON.stringify(binding.oldValue) !== JSON.stringify(binding.value)) {
      updateBinding(el, binding)
    }
    else {
      setTimeout(() => {
        el.__qbacktotop && el.__qbacktotop.updateNow()
      }, 0)
    }
  },
  unbind (el) {
    const ctx = el.__qbacktotop
    if (!ctx) { return }
    ctx.scrollTarget.removeEventListener('scroll', ctx.update, listenOpts.passive)
    window.removeEventListener('resize', ctx.update, listenOpts.passive)
    el.removeEventListener('click', ctx.goToTop)
    el.removeEventListener('keyup', ctx.goToTopKey)
    delete el.__qbacktotop
  }
}
