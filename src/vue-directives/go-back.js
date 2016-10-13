import Platform from '../platform'

let data = {}

export default {
  bind (el, { value }, vnode) {
    let ctx = { value }

    if (Platform.is.cordova) {
      ctx.goBack = () => {
        window.history.go(-1)
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
