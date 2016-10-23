export default {
  bind (el, binding) {
    el.setAttribute('quasar-tooltip', binding.value)
    el.classList.add('quasar-tooltip')

    if (binding.modifiers.inline) {
      el.classList.add('flex', 'inline')
    }
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      el.setAttribute('quasar-tooltip', binding.value)
    }
  },
  unbind (el) {
    el.removeAttribute('quasar-tooltip')
  }
}
