import Platform from '../platform'

let data = {}

export default {
  bind (el, { value }, vnode) {
    let ctx = { value, position: window.history.length - 1 }

    if (Platform.is.cordova) {
      ctx.goBack = () => {
        vnode.context.$router.go(ctx.position - window.history.length)
      }
    }
    else {
      ctx.goBack = () => {
        vnode.context.$router.replace(ctx.value)
      }
    }

    data[el] = ctx
    el.addEventListener('click', ctx.goBack)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      data[el].value = binding.value
    }
  },
  unbind (el) {
    el.removeEventListener('click', data[el].goBack)
    delete data[el]
  }
}
