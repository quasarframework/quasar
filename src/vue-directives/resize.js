import Utils from '../utils'

/*
  v-window-resize
  directive

  args: id|tag|<none>
  id = search if click is outside node with passed id - example: v-click-outside:id.myElementId
  tag = search if click is outside node with passed selector - example: v-click-outside:tag.my-tag-element or v-click-outside:tag.div.layout
  if no args is passed check if click is outside of element or its childs

*/

export default {
  bind: function (el, binding, vnode) {
    // debugger
    let ctx = {
      element: el,
      context: vnode.context,
      action: binding.expression,
      hookEvent: Utils.debounce((event) => {
        // debugger

        let arg = binding.arg
        let width
        console.log('event resize')

        // check if event.target is different from element itself
        if (arg) {
          // v-ckick-outside:id.elementId
          if (arg === 'window') {
            width = Utils.dom.width(window)
          }
        }
          // v-ckick-outside - not self
        else {
          width = Utils.dom.width(ctx.element)
        }
        // event.stopImmediatePropagation()
        ctx.context[ctx.action](width)
      }, 300)
    }
    console.log('resize bind')
    window.addEventListener('resize', ctx.hookEvent)
    Utils.store.add('windowresize', el, ctx)
  },

  unbind: function (el, binding, vnode) {
    console.log('resize unbind')
    window.removeEventListener('resize', Utils.store.get('windowresize', el).hookEvent)
    Utils.store.remove('windowresize', el)
  }
}
