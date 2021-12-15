import Vue from 'vue'

import { isSSR } from '../plugins/Platform.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  okCancel: () => ssrAPI,
  hide: () => ssrAPI,
  update: () => ssrAPI
}

export function merge (target, source) {
  for (const key in source) {
    if (key !== 'spinner' && Object(source[key]) === source[key]) {
      target[key] = Object(target[key]) !== target[key]
        ? {}
        : { ...target[key] }

      merge(target[key], source[key])
    }
    else {
      target[key] = source[key]
    }
  }
}

let appRoot

function getDialogParent (parent, root) {
  if (parent !== void 0) { return parent }
  if (root !== void 0) { return root }

  if (appRoot === void 0) {
    const elRoot = document.getElementById('q-app')

    if (elRoot && elRoot.__vue__) {
      appRoot = elRoot.__vue__.$root
    }
  }

  return appRoot
}

export default function (DefaultComponent) {
  return ({ className, class: klass, style, component, root, parent, ...props }) => {
    if (isSSR === true) { return ssrAPI }

    klass !== void 0 && (props.cardClass = klass)
    style !== void 0 && (props.cardStyle = style)

    const isCustom = component !== void 0
    let DialogComponent, attrs

    if (isCustom === true) {
      DialogComponent = component
    }
    else {
      DialogComponent = DefaultComponent
      attrs = props
    }

    const
      okFns = [],
      cancelFns = [],
      API = {
        onOk (fn) {
          okFns.push(fn)
          return API
        },
        onCancel (fn) {
          cancelFns.push(fn)
          return API
        },
        onDismiss (fn) {
          okFns.push(fn)
          cancelFns.push(fn)
          return API
        },
        hide () {
          vm.$refs.dialog.hide()
          return API
        },
        update ({ className, class: klass, style, component, root, parent, ...cfg }) {
          if (vm !== null) {
            klass !== void 0 && (cfg.cardClass = klass)
            style !== void 0 && (cfg.cardStyle = style)

            if (isCustom === true) {
              Object.assign(props, cfg)
            }
            else {
              merge(props, cfg)

              // need to change "attrs" reference to
              // actually reflect it in underlying component
              // when we force update it
              attrs = { ...props }
            }

            vm.$forceUpdate()
          }

          return API
        }
      }

    const node = document.createElement('div')
    document.body.appendChild(node)

    let emittedOK = false

    const on = {
      ok: data => {
        emittedOK = true
        okFns.forEach(fn => { fn(data) })
      },

      hide: () => {
        vm.$destroy()
        vm.$el.remove()
        vm = null

        if (emittedOK !== true) {
          cancelFns.forEach(fn => { fn() })
        }
      }
    }

    let vm = new Vue({
      name: 'QGlobalDialog',

      el: node,
      parent: getDialogParent(parent, root),

      render (h) {
        return h(DialogComponent, {
          ref: 'dialog',
          props,
          attrs,
          on
        })
      },

      mounted () {
        if (this.$refs.dialog !== void 0) {
          this.$refs.dialog.show()
        }
        else {
          on['hook:mounted'] = () => {
            this.$refs.dialog !== void 0 && this.$refs.dialog.show()
          }
        }
      }
    })

    return API
  }
}
