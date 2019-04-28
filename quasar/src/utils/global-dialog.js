import Vue from 'vue'

import { isSSR } from '../plugins/Platform.js'

const ssrAPI = {
  onOk: () => ssrAPI,
  okCancel: () => ssrAPI,
  hide: () => ssrAPI
}

export default function (Component) {
  return ({ className, class: klass, style, ...props }) => {
    if (isSSR === true) { return ssrAPI }

    // TODO remove in v1 final
    if (className !== void 0) {
      props.cardClass = className

      const p = process.env
      if (p.PROD !== true) {
        console.info('\n\n[Quasar] Dialog/BottomSheet Plugin info: please rename "className" to "class" prop')
      }
    }

    klass !== void 0 && (props.cardClass = klass)
    style !== void 0 && (props.cardStyle = style)

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
        }
      }

    const node = document.createElement('div')
    document.body.appendChild(node)

    const
      ok = data => {
        okFns.forEach(fn => { fn(data) })
      },
      cancel = () => {
        cancelFns.forEach(fn => { fn() })
      }

    let vm = new Vue({
      el: node,

      data () {
        return { props }
      },

      render: h => h(Component, {
        ref: 'dialog',
        props,
        attrs: props,
        on: {
          ok,
          cancel,
          hide: () => {
            vm.$destroy()
            vm.$el.remove()
            vm = null
          }
        }
      }),

      mounted () {
        this.$refs.dialog.show()
      }
    })

    return API
  }
}
