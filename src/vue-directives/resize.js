import Utils from '../utils'

/*
  v-window-resize
  directive

  args: <none>|window
  if no args it returns element width, otherwise window width

*/

export default {
  bind: function (el, binding, vnode) {
    // debugger
    let ctx = {
      element: el,
      context: vnode.context,
      action: binding.expression,
      hookEvent: Utils.debounce((event) => {
        let arg = binding.arg
        let width
        // console.log('event resize')

        if (arg) {
          if (arg === 'window') {
            width = Utils.dom.viewport().width
          }
        }
        else {
          width = Utils.dom.width(ctx.element)
        }
        ctx.context[ctx.action](width)
      }, 300)
    }
    // console.log('resize bind')
    window.addEventListener('resize', ctx.hookEvent)
    Utils.store.add('windowresize', el, ctx)
  },

  unbind: function (el, binding, vnode) {
    // console.log('resize unbind')
    window.removeEventListener('resize', Utils.store.get('windowresize', el).hookEvent)
    Utils.store.remove('windowresize', el)
  }
}
