import Vue from 'vue'

import { isSSR } from '../plugins/platform.js'

export default function (Component) {
  return ({ className, style, ...props }, resolver) => {
    return new Promise((resolve, reject) => {
      if (isSSR) { return resolve() }

      const node = document.createElement('div')
      document.body.appendChild(node)

      const
        ok = data => {
          resolve(data)
        },
        cancel = reason => {
          reject(reason || new Error())
        }

      let vm = new Vue({
        el: node,

        data () {
          return { props }
        },

        render: h => h(Component, {
          ref: 'dialog',
          props,
          style,
          'class': className,
          on: {
            ok,
            cancel,
            hide: () => {
              vm.$destroy()
              vm = null
            }
          }
        }),

        mounted () {
          this.$refs.dialog.show()
        }
      })

      resolver && resolver.then(ok, cancel)
    })
  }
}
