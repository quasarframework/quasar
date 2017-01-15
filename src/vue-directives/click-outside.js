import Utils from '../utils'

/*
  v-click-outside
  directive

  args: id|selector|<none>
  id = search if click is outside node with passed id - example: v-click-outside:id.myElementId
  selector = search if click is outside node with passed selector - example: v-click-outside:selector.my-tag-element or v-click-outside:selector.div.layout
  if no args is passed check if click is outside of element or its childs

*/

export default {
  bind: function (el, binding, vnode) {
    // debugger
    let ctx = {
      element: el,
      context: vnode.context,
      action: binding.expression,
      hookEvent (event) {
        // debugger

        let arg = binding.arg
        let modifiers = binding.modifiers
        let selector = Object.keys(modifiers).join('.')
        // console.log('emitting event')

        // check if event.target is different from element itself
        if (arg) {
          // v-ckick-outside:id.elementId
          if (arg === 'id') {
            if (!Utils.dom.isParentId(event.target, selector)) {
              ctx.context[ctx.action]()
            }
          }
          // v-ckick-outside:tag.div
          else if (arg === 'selector') {
            if (!Utils.dom.isClosest(event.target, selector)) {
              ctx.context[ctx.action]()
            }
          }
        }
          // v-ckick-outside - not self
        else {
          if (!Utils.dom.isSelfOrChild(event.target, ctx.element)) {
            ctx.context[ctx.action]()
          }
        }
        // event.stopImmediatePropagation()
      }
    }
    // console.log('click-outside bind')
    document.body.addEventListener('click', ctx.hookEvent)
    Utils.store.add('clickoutside', el, ctx)
  },

  unbind: function (el, binding, vnode) {
    // console.log('click-outside unbind')
    document.body.removeEventListener('click', Utils.store.get('clickoutside', el).hookEvent)
    Utils.store.remove('clickoutside', el)
  }
}
