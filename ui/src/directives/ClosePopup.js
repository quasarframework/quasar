function closePopups (vm, evt, depth) {
  for (let shouldStop = false; shouldStop === false; vm = vm.$parent) {
    if (vm.__onPortalClose !== void 0) {
      if (depth > 0 || vm.$options.name !== 'QMenu' || vm.submenu !== true) {
        if (depth < 0) {
          shouldStop = true
        }
        depth -= 1
      }
      vm.__onPortalClose(evt)
    }
    if (vm === vm.$root || depth === 0) {
      shouldStop = true
    }
  }
}

function update (el, binding) {
  const ctx = el.__qclosepopup

  if (ctx !== void 0) {
    if (binding.value === false) {
      ctx.depth = 0
    }
    else {
      let depth = parseInt(binding.value, 10)
      if (isNaN(depth) || depth < 0) {
        depth = -1
      }
      ctx.depth = depth
    }
  }
}

export default {
  name: 'close-popup',

  bind (el, binding, vnode) {
    const ctx = {
      depth: 0,

      handler (evt) {
        // allow @click/@keyup to be emitted
        ctx.depth !== 0 && setTimeout(() => {
          closePopups(vnode.componentInstance || vnode.context, evt, ctx.depth)
        }, 0)
      },

      handlerKey (evt) {
        evt.keyCode === 13 && ctx.handler(evt)
      }
    }

    if (el.__qclosepopup !== void 0) {
      el.__qclosepopup_old = el.__qclosepopup
    }

    el.__qclosepopup = ctx
    update(el, binding)

    el.addEventListener('click', ctx.handler)
    el.addEventListener('keyup', ctx.handlerKey)
  },

  update,

  unbind (el) {
    const ctx = el.__qclosepopup_old || el.__qclosepopup
    if (ctx !== void 0) {
      el.removeEventListener('click', ctx.handler)
      el.removeEventListener('keyup', ctx.handlerKey)
      delete el[el.__qclosepopup_old ? '__qclosepopup_old' : '__qclosepopup']
    }
  }
}
