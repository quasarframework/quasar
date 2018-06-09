import { isSSR } from '../plugins/platform'

export default function (Component, Vue) {
  return (props, resolver) => {
    return new Promise((resolve, reject) => {
      if (isSSR) { return resolve() }

      const node = document.createElement('div')
      document.body.appendChild(node)

      const
        ok = data => {
          resolve(data)
          vm.$destroy()
        },
        cancel = reason => {
          reject(reason || new Error())
          vm.$destroy()
        }

      const vm = new Vue({
        el: node,
        data () {
          return { props }
        },
        render: h => h(Component, {
          props,
          ref: 'modal',
          on: {
            ok,
            cancel
          }
        }),
        mounted () {
          this.$refs.modal.show()
        }
      })

      resolver && resolver.then(ok, cancel)
    })
  }
}
